import { Request, Response } from 'express';
import User from '../models/User';

// 30-day rotating devotional plan — cycles through the year
const DEVOTIONALS = [
  { verse: 'Ruth 1:16', text: '"Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God."', theme: 'Loyalty & Commitment', reflection: 'True covenant love is unconditional. How can you demonstrate loyal love in your relationships today?' },
  { verse: 'Song of Songs 8:6', text: '"Place me like a seal over your heart… for love is as strong as death, its jealousy unyielding as the grave."', theme: 'Sacred Love', reflection: 'God designed love to be unbreakable. What boundaries are you setting to honor this design?' },
  { verse: '1 Corinthians 13:4-5', text: '"Love is patient, love is kind. It does not envy, it does not boast, it is not proud."', theme: 'The Nature of Love', reflection: 'Which attribute of love do you most need to cultivate in your own heart right now?' },
  { verse: 'Proverbs 31:10', text: '"A wife of noble character who can find? She is worth far more than rubies."', theme: 'Character Over Appearance', reflection: 'Are you pursuing and developing inner beauty and noble character, the qualities that endure?' },
  { verse: 'Ephesians 5:25', text: '"Husbands, love your wives, just as Christ loved the church and gave himself up for her."', theme: 'Sacrificial Love', reflection: 'What does it look like to love sacrificially rather than selfishly in your closest relationships?' },
  { verse: 'Genesis 2:24', text: '"That is why a man leaves his father and mother and is united to his wife, and they become one flesh."', theme: 'Covenant Marriage', reflection: 'Marriage is God\'s design from the beginning. How are you preparing your heart for this covenant?' },
  { verse: 'Psalm 37:4', text: '"Delight yourself in the LORD, and he will give you the desires of your heart."', theme: 'Trust in God\'s Timing', reflection: 'Are you seeking God first, trusting that He will order your steps toward the right person?' },
  { verse: 'Proverbs 18:22', text: '"He who finds a wife finds what is good and receives favor from the LORD."', theme: 'God\'s Favor in Partnership', reflection: 'How are you actively pursuing wisdom and Godliness as you seek a life partner?' },
  { verse: '2 Corinthians 6:14', text: '"Do not be yoked together with unbelievers. For what do righteousness and wickedness have in common?"', theme: 'Spiritual Compatibility', reflection: 'Is shared faith your non-negotiable foundation for a future spouse? Why does this matter?' },
  { verse: 'Colossians 3:14', text: '"And over all these virtues put on love, which binds them all together in perfect unity."', theme: 'Love Binds All', reflection: 'Love is not just a feeling — it\'s a daily choice. What choice for love will you make today?' },
  { verse: '1 Peter 3:7', text: '"Husbands, be considerate as you live with your wives, and treat them with respect."', theme: 'Dignity & Honor', reflection: 'How can you cultivate a posture of honor and consideration toward the opposite sex today?' },
  { verse: 'Proverbs 3:5-6', text: '"Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him."', theme: 'Surrendered Trust', reflection: 'Are you releasing control of your love life to God, trusting His plan above your own timeline?' },
  { verse: 'Hebrews 13:4', text: '"Marriage should be honored by all, and the marriage bed kept pure, for God will judge the adulterer and all the sexually immoral."', theme: 'Purity as Honor', reflection: 'Purity is an act of worship and faith. How does your daily life reflect this conviction?' },
  { verse: 'Isaiah 54:5', text: '"For your Maker is your husband — the LORD Almighty is his name — the Holy One of Israel is your Redeemer."', theme: 'God as Pursuer', reflection: 'Before any earthly love, God\'s love for you is complete. How does this truth secure your identity?' },
  { verse: 'Jeremiah 29:11', text: '"For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future."', theme: 'Hope in the Wait', reflection: 'Even in seasons of waiting, God\'s plan is perfect. How can you embrace this season with gratitude?' },
  { verse: 'Titus 2:4-5', text: '"Then they can urge the younger women to love their husbands and children, to be self-controlled and pure."', theme: 'Intentional Character', reflection: 'Who is investing in your character? Are you seeking mentorship and community to grow?' },
  { verse: 'Proverbs 19:14', text: '"Houses and wealth are inherited from parents, but a prudent wife is from the LORD."', theme: 'A God-Given Gift', reflection: 'The right partner is a gift, not something to be seized by force or manipulation. How does this shape how you pursue relationships?' },
  { verse: 'Matthew 19:6', text: '"So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate."', theme: 'Divine Union', reflection: 'How seriously do you take the permanence of marriage? Does this shape your approach to dating?' },
  { verse: 'Song of Songs 2:7', text: '"Do not arouse or awaken love until it so desires."', theme: 'Patience in Love', reflection: 'Rushing love damages what waiting would have built. Where do you need more patience in your journey?' },
  { verse: '1 Thessalonians 4:4', text: '"Each of you should learn to control your own body in a way that is holy and honorable."', theme: 'Self-Mastery', reflection: 'Self-control is a fruit of the Spirit. How are you cultivating it in your romantic life?' },
  { verse: 'Ecclesiastes 4:9', text: '"Two are better than one, because they have a good return for their labor."', theme: 'Partnership', reflection: 'God designed us for godly partnership. What kind of partner are you becoming while you wait?' },
  { verse: 'Romans 12:10', text: '"Be devoted to one another in love. Honor one another above yourselves."', theme: 'Mutual Honor', reflection: 'Does your approach to dating honor others above yourself? What would change if it did?' },
  { verse: 'Zephaniah 3:17', text: '"The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you."', theme: 'God\'s Delight in You', reflection: 'You are seen, known, and delighted in by God right now. How does His love satisfy what you\'re longing for?' },
  { verse: 'Philippians 4:6', text: '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."', theme: 'Peace in the Process', reflection: 'Have you brought your desires for love and marriage to God in prayer? Make this a daily practice.' },
  { verse: '1 John 4:19', text: '"We love because he first loved us."', theme: 'Love\'s Origin', reflection: 'The capacity to love comes from receiving God\'s love. Are you drawing from His well daily?' },
  { verse: 'Genesis 1:27', text: '"So God created mankind in his own image, in the image of God he created them; male and female he created them."', theme: 'Image Bearers', reflection: 'Every person you meet bears the image of God. How would this truth transform how you see potential partners?' },
  { verse: 'Micah 6:8', text: '"Act justly, love mercy, and walk humbly with your God."', theme: 'Character Worth Seeking', reflection: 'Are these the qualities you most value in a potential partner? Are they developing in you?' },
  { verse: 'Galatians 5:22-23', text: '"But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control."', theme: 'Fruit of the Spirit', reflection: 'Which fruit of the Spirit do you most want to see evidenced in a future spouse? In yourself?' },
  { verse: 'Joshua 24:15', text: '"But as for me and my household, we will serve the LORD."', theme: 'Shared Vision', reflection: 'Shared spiritual leadership is a foundation of covenant marriage. Are you seeking someone who will lead alongside you toward God?' },
  { verse: 'Lamentations 3:25', text: '"The LORD is good to those whose hope is in him, to the one who seeks him."', theme: 'Seeking God First', reflection: 'The greatest thing you can do for your future relationship is seek God deeply today. How will you do that this week?' },
];

function getTodayDevotional() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return DEVOTIONALS[dayOfYear % DEVOTIONALS.length];
}

export const getToday = async (_req: Request, res: Response) => {
  const d = getTodayDevotional();
  const today = new Date();
  res.json({
    date: today.toISOString().split('T')[0],
    dayName: today.toLocaleDateString('en-US', { weekday: 'long' }),
    ...d,
  });
};

export const getDevotionalMatch = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const me = await User.findById(userId).select('gender faith values blockedUsers likedBy passedBy preferences isDeleted isBanned').lean() as any;
    if (!me) return res.status(401).json({ message: 'Not authenticated' });

    const devotional = getTodayDevotional();
    const theme = devotional.theme.toLowerCase();

    // Find a user who shares faith/values alignment with today's theme
    const blockedIds: string[] = (me.blockedUsers || []).map((id: any) => id.toString());
    const excludedIds: string[] = [
      userId,
      ...blockedIds,
      ...(me.likedBy || []).map((id: any) => id.toString()),
      ...(me.passedBy || []).map((id: any) => id.toString()),
    ];

    // Build match filter — prefer opposite gender if preference set
    const genderFilter = me.preferences?.gender
      ? { gender: me.preferences.gender }
      : { gender: { $ne: me.gender } };

    // Soft match on theme-related values or faith keywords
    const themeKeywords = theme.split(/\s+|&/).map((w: string) => new RegExp(w, 'i'));

    const candidate = await User.findOne({
      _id: { $nin: excludedIds },
      isDeleted: false,
      isBanned: false,
      isEmailVerified: true,
      ...genderFilter,
      $or: [
        { values: { $in: themeKeywords } },
        { faith: { $in: themeKeywords } },
        { bio: { $in: themeKeywords } },
      ],
    })
      .select('name age city faith faithLevel denomination values bio profileImage trustLevel reputationScore')
      .lean();

    // Fallback: just return any discovery candidate if no theme match
    const match = candidate || await User.findOne({
      _id: { $nin: excludedIds },
      isDeleted: false,
      isBanned: false,
      isEmailVerified: true,
      ...genderFilter,
    })
      .select('name age city faith faithLevel denomination values bio profileImage trustLevel reputationScore')
      .lean();

    res.json({ devotional, match });
  } catch {
    res.status(500).json({ message: 'Failed to get devotional match' });
  }
};
