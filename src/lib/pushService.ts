/**
 * src/lib/pushService.ts
 * Server-side Web Push: save/remove subscriptions and send push to devices.
 */

import webpush from 'web-push';
import { sql } from '@vercel/postgres';

// ---------------------------------------------------------------------------
// VAPID config
// ---------------------------------------------------------------------------

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY ?? '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? 'mailto:admin@i10.org.br';

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

// ---------------------------------------------------------------------------
// Subscription CRUD
// ---------------------------------------------------------------------------

export interface PushSubscriptionRecord {
  id: string;
  endpoint: string;
  keys_p256dh: string;
  keys_auth: string;
}

/** Save (upsert) a push subscription. */
export async function saveSubscription(sub: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  // Use a hash of the endpoint as the id for idempotency
  const id = hashEndpoint(sub.endpoint);

  await sql`
    INSERT INTO push_subscriptions (id, endpoint, keys_p256dh, keys_auth)
    VALUES (${id}, ${sub.endpoint}, ${sub.keys.p256dh}, ${sub.keys.auth})
    ON CONFLICT (endpoint) DO UPDATE
      SET keys_p256dh = ${sub.keys.p256dh},
          keys_auth   = ${sub.keys.auth},
          created_at  = NOW()
  `;
}

/** Remove a push subscription by endpoint. */
export async function removeSubscription(endpoint: string) {
  await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`;
}

/** Get all subscriptions, optionally excluding one endpoint. */
export async function getSubscriptions(excludeEndpoint?: string): Promise<PushSubscriptionRecord[]> {
  if (excludeEndpoint) {
    const res = await sql`
      SELECT id, endpoint, keys_p256dh, keys_auth
      FROM push_subscriptions
      WHERE endpoint != ${excludeEndpoint}
    `;
    return res.rows as PushSubscriptionRecord[];
  }

  const res = await sql`
    SELECT id, endpoint, keys_p256dh, keys_auth
    FROM push_subscriptions
  `;
  return res.rows as PushSubscriptionRecord[];
}

// ---------------------------------------------------------------------------
// Send push
// ---------------------------------------------------------------------------

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/**
 * Send a push notification to all subscribed devices,
 * optionally excluding the sender's endpoint.
 */
export async function sendPushToAll(payload: PushPayload, excludeEndpoint?: string) {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    console.warn('[pushService] VAPID keys not configured, skipping push');
    return;
  }

  const subs = await getSubscriptions(excludeEndpoint);
  if (subs.length === 0) return;

  const body = JSON.stringify(payload);

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
        },
        body,
      ),
    ),
  );

  // Clean up expired/invalid subscriptions (410 Gone or 404)
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === 'rejected') {
      const statusCode = (result.reason as { statusCode?: number })?.statusCode;
      if (statusCode === 410 || statusCode === 404) {
        await removeSubscription(subs[i].endpoint).catch(() => {});
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hashEndpoint(endpoint: string): string {
  const { createHash } = require('crypto') as typeof import('crypto');
  return createHash('sha256').update(endpoint).digest('hex');
}
