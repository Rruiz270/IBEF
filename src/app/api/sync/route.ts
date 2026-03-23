/**
 * /api/sync — single endpoint for sync
 *
 * GET  /api/sync?since=<ISO>  → pull rows updated since timestamp
 * POST /api/sync              → push batch of mutations + send push to other devices
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { pullSince, pushMutations, type SyncMutation } from '@/lib/db';
import { sendPushToAll } from '@/lib/pushService';

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const MutationSchema = z.object({
  table: z.enum(['tasks', 'people', 'hiring_positions', 'associate_companies', 'activity_log']),
  operation: z.enum(['upsert', 'delete']),
  id: z.string().min(1).max(200),
  data: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.string().datetime({ message: 'timestamp must be a valid ISO datetime' }),
});

const PushBodySchema = z.object({
  mutations: z.array(MutationSchema).min(1, 'At least one mutation is required').max(500),
  senderEndpoint: z.string().url().optional(),
});

/** Accept any valid ISO 8601 datetime string */
const isoDatetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

// ---------------------------------------------------------------------------
// GET — Pull
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const since = request.nextUrl.searchParams.get('since') ?? undefined;

    // Validate `since` param if provided
    if (since !== undefined) {
      if (!isoDatetimeRegex.test(since)) {
        return NextResponse.json(
          { error: 'Invalid "since" parameter — must be a valid ISO 8601 datetime string (e.g. 2024-01-01T00:00:00.000Z)' },
          { status: 400 },
        );
      }
    }

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

    // Validate request body with Zod
    const parsed = PushBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { mutations, senderEndpoint } = parsed.data;
    const results = await pushMutations(mutations as SyncMutation[]);

    // Send push notification to other devices (fire-and-forget)
    const successCount = results.filter((r) => r.ok).length;
    if (successCount > 0) {
      sendPushToAll(
        {
          title: 'i10 Project Control',
          body: `${successCount} ${successCount === 1 ? 'atualização sincronizada' : 'atualizações sincronizadas'}`,
          url: '/dashboard',
        },
        senderEndpoint,
      ).catch((err) => {
        console.error('[sync/POST] push notification error:', err);
      });
    }

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
