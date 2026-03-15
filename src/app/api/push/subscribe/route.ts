/**
 * /api/push/subscribe
 *
 * POST   — Save a push subscription
 * DELETE — Remove a push subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveSubscription, removeSubscription } from '@/lib/pushService';

// ---------------------------------------------------------------------------
// POST — save subscription
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: 'Invalid subscription: endpoint, keys.p256dh, and keys.auth are required' },
        { status: 400 },
      );
    }

    await saveSubscription({ endpoint, keys });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[push/subscribe POST]', err);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE — remove subscription
// ---------------------------------------------------------------------------

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'endpoint is required' },
        { status: 400 },
      );
    }

    await removeSubscription(endpoint);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[push/subscribe DELETE]', err);
    return NextResponse.json(
      { error: 'Failed to remove subscription' },
      { status: 500 },
    );
  }
}
