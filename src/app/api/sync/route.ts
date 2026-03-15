/**
 * /api/sync — single endpoint for sync
 *
 * GET  /api/sync?since=<ISO>  → pull rows updated since timestamp
 * POST /api/sync              → push batch of mutations
 */

import { NextRequest, NextResponse } from 'next/server';
import { pullSince, pushMutations, type SyncMutation } from '@/lib/db';

// ---------------------------------------------------------------------------
// GET — Pull
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const since = request.nextUrl.searchParams.get('since') ?? undefined;
    const data = await pullSince(since);
    return NextResponse.json({
      ...data,
      serverTimestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[sync/GET]', err);
    return NextResponse.json(
      { error: 'Failed to pull sync data' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST — Push
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mutations: SyncMutation[] = body.mutations;

    if (!Array.isArray(mutations) || mutations.length === 0) {
      return NextResponse.json(
        { error: 'No mutations provided' },
        { status: 400 },
      );
    }

    const results = await pushMutations(mutations);
    return NextResponse.json({
      results,
      serverTimestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[sync/POST]', err);
    return NextResponse.json(
      { error: 'Failed to push sync data' },
      { status: 500 },
    );
  }
}
