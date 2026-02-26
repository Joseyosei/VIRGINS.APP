import sgMail from '@sendgrid/mail';

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@virgins.app';
const APP_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const API_KEY = process.env.SENDGRID_API_KEY || '';

if (API_KEY && !API_KEY.startsWith('SG.replace')) {
  sgMail.setApiKey(API_KEY);
}

const canSend = () => API_KEY && !API_KEY.startsWith('SG.replace') && !API_KEY.startsWith('replace');

async function send(to: string, subject: string, html: string) {
  if (!canSend()) {
    console.log(`[EMAIL STUB] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL STUB] ${html.replace(/<[^>]+>/g, ' ').trim().substring(0, 200)}`);
    return;
  }
  await sgMail.send({ to, from: FROM_EMAIL, subject, html });
}

export const sendWelcomeEmail = (to: string, name: string) =>
  send(to, 'Welcome to VIRGINS — Love Worth Waiting For', `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#FAF7F2;padding:40px;border-radius:16px">
      <h1 style="color:#4B0082;font-size:28px;margin-bottom:8px">Welcome, ${name}! 💛</h1>
      <p style="color:#555;line-height:1.6">You've joined a community built on faith, values, and intentional love. Your journey toward a covenant relationship starts here.</p>
      <a href="${APP_URL}/verify" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#4B0082;color:#FAF7F2;text-decoration:none;border-radius:12px;font-weight:bold">Verify Your Account</a>
      <p style="color:#888;font-size:12px">If you didn't create this account, ignore this email.</p>
    </div>
  `);

export const sendPasswordResetEmail = (to: string, token: string) =>
  send(to, 'Reset Your VIRGINS Password', `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#FAF7F2;padding:40px;border-radius:16px">
      <h1 style="color:#4B0082;font-size:24px;margin-bottom:8px">Password Reset Request</h1>
      <p style="color:#555;line-height:1.6">We received a request to reset your password. Click the link below — it expires in 1 hour.</p>
      <a href="${APP_URL}?page=password-reset&token=${token}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#4B0082;color:#FAF7F2;text-decoration:none;border-radius:12px;font-weight:bold">Reset Password</a>
      <p style="color:#888;font-size:12px">If you didn't request this, your password remains unchanged.</p>
    </div>
  `);

export const sendReferenceRequestEmail = (to: string, requestorName: string, confirmUrl: string) =>
  send(to, `${requestorName} has listed you as a character reference on VIRGINS`, `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#FAF7F2;padding:40px;border-radius:16px">
      <h1 style="color:#4B0082;font-size:24px;margin-bottom:8px">Character Reference Request</h1>
      <p style="color:#555;line-height:1.6"><strong>${requestorName}</strong> has requested that you vouch for their character on the VIRGINS dating platform — a community for people saving sex for marriage.</p>
      <a href="${confirmUrl}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#C9A84C;color:#1A0033;text-decoration:none;border-radius:12px;font-weight:bold">Confirm Reference</a>
      <p style="color:#888;font-size:12px">This link expires in 7 days. If you don't know this person, simply ignore this email.</p>
    </div>
  `);

export const sendMatchNotificationEmail = (to: string, matchName: string) =>
  send(to, `You have a Covenant Match with ${matchName}! 💛`, `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#FAF7F2;padding:40px;border-radius:16px">
      <h1 style="color:#4B0082;font-size:24px;margin-bottom:8px">It's a Match! 💛</h1>
      <p style="color:#555;line-height:1.6">You and <strong>${matchName}</strong> have matched on VIRGINS. Log in to start a meaningful conversation.</p>
      <a href="${APP_URL}?page=messages" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#4B0082;color:#FAF7F2;text-decoration:none;border-radius:12px;font-weight:bold">Say Hello</a>
    </div>
  `);
