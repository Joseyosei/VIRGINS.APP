import User from '../models/User';

let firebaseApp: any = null;

const getFirebase = async () => {
  if (firebaseApp) return firebaseApp;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson || serviceAccountJson.startsWith('replace')) {
    return null; // Not configured — stub mode
  }

  try {
    const admin = await import('firebase-admin');
    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountJson, 'base64').toString('utf-8')
    );
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return firebaseApp;
  } catch (err) {
    console.error('[Push] Firebase init failed:', err);
    return null;
  }
};

export const sendPushToUser = async (
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  try {
    const user = await User.findById(userId).select('pushToken');
    if (!user?.pushToken) return;

    const app = await getFirebase();
    if (!app) {
      console.log(`[Push STUB] To: ${userId} | ${title}: ${body}`);
      return;
    }

    const admin = await import('firebase-admin');
    await admin.messaging().send({
      token: user.pushToken,
      notification: { title, body },
      data: data || {},
    });
  } catch (err) {
    console.error('[Push] sendPushToUser error:', err);
  }
};

export const sendPushToUsers = async (
  userIds: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  try {
    const users = await User.find({ _id: { $in: userIds }, pushToken: { $exists: true, $ne: null } }).select('pushToken');
    const tokens = users.map(u => u.pushToken).filter(Boolean) as string[];
    if (!tokens.length) return;

    const app = await getFirebase();
    if (!app) {
      console.log(`[Push STUB] Batch to ${tokens.length} users | ${title}: ${body}`);
      return;
    }

    const admin = await import('firebase-admin');
    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body },
      data: data || {},
    });
  } catch (err) {
    console.error('[Push] sendPushToUsers error:', err);
  }
};
