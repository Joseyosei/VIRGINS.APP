import cron from 'node-cron';
import User from '../models/User';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import { sendPushToUser } from '../services/pushService';
import { runCovenantAlgorithm } from '../services/matchingService';
import { generateIcebreaker } from '../services/geminiService';

/**
 * Nightly digest — 9pm daily.
 * For each user inactive > 48 hours, find top-3 new candidates and nudge.
 */
const newMatchesDigest = cron.schedule('0 21 * * *', async () => {
  console.log('[RetentionJob] Running new-matches digest...');
  try {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const inactiveUsers = await User.find({
      lastSeen:   { $lt: cutoff },
      isBanned:   false,
      isDeleted:  false,
      pushToken:  { $exists: true, $ne: '' },
    }).select('_id city gender preferences');

    for (const user of inactiveUsers) {
      try {
        const prefs = (user as any).preferences || {};
        const results = await runCovenantAlgorithm(user._id.toString(), {
          gender: prefs.gender || (user.gender === 'Man' ? 'Woman' : 'Man'),
          minAge: prefs.minAge || 18,
          maxAge: prefs.maxAge || 50,
          faithImportance:    prefs.faithImportance    ?? 35,
          valueImportance:    prefs.valueImportance    ?? 30,
          locationImportance: 10,
          targetDenominations: prefs.targetDenominations || [],
          requiredValues:      prefs.requiredValues      || [],
        });

        const top3 = results.slice(0, 3);
        if (top3.length === 0) continue;

        const city = user.city || 'your area';
        await sendPushToUser(
          user._id.toString(),
          '✨ New Covenant Matches!',
          `${top3.length} faith-compatible profiles joined near ${city}. Come take a look!`,
          { type: 'new_matches' }
        );
      } catch { /* skip individual failure */ }
    }
    console.log(`[RetentionJob] Digest sent to ${inactiveUsers.length} users`);
  } catch (err) {
    console.error('[RetentionJob] Digest error:', err);
  }
}, { scheduled: false } as any); // started conditionally in production

/**
 * Conversation momentum nudge — runs every 6 hours.
 * If a conversation has been silent for 72 hours, prompt the last sender with an icebreaker.
 */
const conversationMomentumNudge = cron.schedule('0 */6 * * *', async () => {
  console.log('[RetentionJob] Running conversation momentum nudge...');
  try {
    const cutoff72h  = new Date(Date.now() - 72 * 60 * 60 * 1000);
    const cutoff144h = new Date(Date.now() - 144 * 60 * 60 * 1000); // don't nudge very stale convos

    const staleConvs = await Conversation.find({
      lastMessageAt: { $gt: cutoff144h, $lt: cutoff72h },
    }).limit(100);

    for (const conv of staleConvs) {
      try {
        const lastMsg = await Message.findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .select('senderId');
        if (!lastMsg) continue;

        const lastSenderId = lastMsg.senderId.toString();
        const sender = await User.findById(lastSenderId).select('pushToken name');
        if (!sender?.pushToken) continue;

        await sendPushToUser(
          lastSenderId,
          '💬 Keep the conversation going!',
          `Your match hasn't responded yet. Want a fresh icebreaker?`,
          { type: 'conversation_nudge', conversationId: conv._id.toString() }
        );
      } catch { /* skip individual */ }
    }
    console.log(`[RetentionJob] Momentum nudge sent for ${staleConvs.length} conversations`);
  } catch (err) {
    console.error('[RetentionJob] Momentum nudge error:', err);
  }
}, { scheduled: false } as any);

/**
 * Profile completeness nudge — runs every Sunday at 10am.
 */
const profileCompletenessNudge = cron.schedule('0 10 * * 0', async () => {
  console.log('[RetentionJob] Running profile completeness nudge...');
  try {
    // Users missing key profile fields
    const incomplete = await User.find({
      isBanned:  false,
      isDeleted: false,
      pushToken: { $exists: true, $ne: '' },
      $or: [
        { bio: { $in: [null, ''] } },
        { images: { $size: 0 } },
        { values: { $size: 0 } },
      ],
    }).select('_id name').limit(500);

    for (const user of incomplete) {
      try {
        await sendPushToUser(
          user._id.toString(),
          '📸 Complete your profile',
          'Profiles with a bio and photos get 4× more interest. It only takes 2 minutes!',
          { type: 'profile_completeness' }
        );
      } catch { /* skip */ }
    }
    console.log(`[RetentionJob] Completeness nudge sent to ${incomplete.length} users`);
  } catch (err) {
    console.error('[RetentionJob] Completeness nudge error:', err);
  }
}, { scheduled: false } as any);

export function startRetentionJobs() {
  if (process.env.NODE_ENV === 'production') {
    newMatchesDigest.start();
    conversationMomentumNudge.start();
    profileCompletenessNudge.start();
    console.log('[RetentionJobs] All retention cron jobs started');
  } else {
    console.log('[RetentionJobs] Skipping cron jobs in non-production environment');
  }
}
