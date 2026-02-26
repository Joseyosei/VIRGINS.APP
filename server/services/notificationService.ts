import Notification from '../models/Notification';
import { sendPushToUser } from './pushService';

export const createNotification = async (
  userId: string,
  type: 'match' | 'message' | 'like' | 'verification' | 'system',
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> => {
  try {
    await Notification.create({ userId, type, title, body, data: data || {} });
    // Also attempt push notification
    await sendPushToUser(userId, title, body, data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : undefined);
  } catch (err) {
    console.error('[NotificationService] createNotification error:', err);
  }
};
