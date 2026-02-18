import { createClient } from '@blinkdotnew/sdk';

export const blink = createClient({
  projectId: (import.meta as any).env.VITE_BLINK_PROJECT_ID || 'virgins-dating-app-s4h0uvdp',
  publishableKey: (import.meta as any).env.VITE_BLINK_PUBLISHABLE_KEY,
  auth: { mode: 'headless' },
});