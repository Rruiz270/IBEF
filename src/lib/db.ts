/**
 * src/lib/db.ts
 * Server-side helpers for Postgres queries via @vercel/postgres.
 */

import { sql } from '@vercel/postgres';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SyncTable =
  | 'tasks'
  | 'people'
  | 'hiring_positions'
  | 'associate_companies'
  | 'activity_log';

export interface SyncRow {
  id: string;
  data: Record<string, unknown>;
  updated_at: string;
  deleted?: boolean;
}

export interface SyncMutation {
  table: SyncTable;
  operation: 'upsert' | 'delete';
  id: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Pull — get rows updated since a given timestamp
// ---------------------------------------------------------------------------

export async function pullSince(since?: string) {
  const condition = since ? since : '1970-01-01T00:00:00.000Z';

  const [tasksRes, peopleRes, hiringRes, companiesRes, activityRes] =
    await Promise.all([
      sql`SELECT id, data, updated_at, deleted FROM tasks WHERE updated_at > ${condition} ORDER BY updated_at`,
      sql`SELECT id, data, updated_at, deleted FROM people WHERE updated_at > ${condition} ORDER BY updated_at`,
      sql`SELECT id, data, updated_at, deleted FROM hiring_positions WHERE updated_at > ${condition} ORDER BY updated_at`,
      sql`SELECT id, data, updated_at, deleted FROM associate_companies WHERE updated_at > ${condition} ORDER BY updated_at`,
      sql`SELECT id, data, updated_at FROM activity_log WHERE updated_at > ${condition} ORDER BY updated_at`,
    ]);

  return {
    tasks: tasksRes.rows as SyncRow[],
    people: peopleRes.rows as SyncRow[],
    hiringPositions: hiringRes.rows as SyncRow[],
    associateCompanies: companiesRes.rows as SyncRow[],
    activityLog: activityRes.rows as SyncRow[],
  };
}

// ---------------------------------------------------------------------------
// Push — per-table upsert/delete helpers
// ---------------------------------------------------------------------------

async function upsertTask(id: string, data: string, ts: string) {
  await sql`
    INSERT INTO tasks (id, data, updated_at, deleted)
    VALUES (${id}, ${data}::jsonb, ${ts}::timestamptz, FALSE)
    ON CONFLICT (id) DO UPDATE
      SET data = CASE WHEN tasks.updated_at < ${ts}::timestamptz THEN ${data}::jsonb ELSE tasks.data END,
          updated_at = CASE WHEN tasks.updated_at < ${ts}::timestamptz THEN ${ts}::timestamptz ELSE tasks.updated_at END,
          deleted = CASE WHEN tasks.updated_at < ${ts}::timestamptz THEN FALSE ELSE tasks.deleted END
  `;
}

async function deleteTask(id: string, ts: string) {
  await sql`
    UPDATE tasks SET deleted = TRUE, updated_at = ${ts}::timestamptz
    WHERE id = ${id} AND updated_at < ${ts}::timestamptz
  `;
  await sql`
    INSERT INTO tasks (id, data, updated_at, deleted)
    VALUES (${id}, '{}'::jsonb, ${ts}::timestamptz, TRUE)
    ON CONFLICT (id) DO NOTHING
  `;
}

async function upsertPerson(id: string, data: string, ts: string) {
  await sql`
    INSERT INTO people (id, data, updated_at, deleted)
    VALUES (${id}, ${data}::jsonb, ${ts}::timestamptz, FALSE)
    ON CONFLICT (id) DO UPDATE
      SET data = CASE WHEN people.updated_at < ${ts}::timestamptz THEN ${data}::jsonb ELSE people.data END,
          updated_at = CASE WHEN people.updated_at < ${ts}::timestamptz THEN ${ts}::timestamptz ELSE people.updated_at END,
          deleted = CASE WHEN people.updated_at < ${ts}::timestamptz THEN FALSE ELSE people.deleted END
  `;
}

async function deletePerson(id: string, ts: string) {
  await sql`
    UPDATE people SET deleted = TRUE, updated_at = ${ts}::timestamptz
    WHERE id = ${id} AND updated_at < ${ts}::timestamptz
  `;
  await sql`
    INSERT INTO people (id, data, updated_at, deleted)
    VALUES (${id}, '{}'::jsonb, ${ts}::timestamptz, TRUE)
    ON CONFLICT (id) DO NOTHING
  `;
}

async function upsertHiring(id: string, data: string, ts: string) {
  await sql`
    INSERT INTO hiring_positions (id, data, updated_at, deleted)
    VALUES (${id}, ${data}::jsonb, ${ts}::timestamptz, FALSE)
    ON CONFLICT (id) DO UPDATE
      SET data = CASE WHEN hiring_positions.updated_at < ${ts}::timestamptz THEN ${data}::jsonb ELSE hiring_positions.data END,
          updated_at = CASE WHEN hiring_positions.updated_at < ${ts}::timestamptz THEN ${ts}::timestamptz ELSE hiring_positions.updated_at END,
          deleted = CASE WHEN hiring_positions.updated_at < ${ts}::timestamptz THEN FALSE ELSE hiring_positions.deleted END
  `;
}

async function deleteHiring(id: string, ts: string) {
  await sql`
    UPDATE hiring_positions SET deleted = TRUE, updated_at = ${ts}::timestamptz
    WHERE id = ${id} AND updated_at < ${ts}::timestamptz
  `;
  await sql`
    INSERT INTO hiring_positions (id, data, updated_at, deleted)
    VALUES (${id}, '{}'::jsonb, ${ts}::timestamptz, TRUE)
    ON CONFLICT (id) DO NOTHING
  `;
}

async function upsertCompany(id: string, data: string, ts: string) {
  await sql`
    INSERT INTO associate_companies (id, data, updated_at, deleted)
    VALUES (${id}, ${data}::jsonb, ${ts}::timestamptz, FALSE)
    ON CONFLICT (id) DO UPDATE
      SET data = CASE WHEN associate_companies.updated_at < ${ts}::timestamptz THEN ${data}::jsonb ELSE associate_companies.data END,
          updated_at = CASE WHEN associate_companies.updated_at < ${ts}::timestamptz THEN ${ts}::timestamptz ELSE associate_companies.updated_at END,
          deleted = CASE WHEN associate_companies.updated_at < ${ts}::timestamptz THEN FALSE ELSE associate_companies.deleted END
  `;
}

async function deleteCompany(id: string, ts: string) {
  await sql`
    UPDATE associate_companies SET deleted = TRUE, updated_at = ${ts}::timestamptz
    WHERE id = ${id} AND updated_at < ${ts}::timestamptz
  `;
  await sql`
    INSERT INTO associate_companies (id, data, updated_at, deleted)
    VALUES (${id}, '{}'::jsonb, ${ts}::timestamptz, TRUE)
    ON CONFLICT (id) DO NOTHING
  `;
}

async function upsertActivityLog(id: string, data: string, ts: string) {
  await sql`
    INSERT INTO activity_log (id, data, updated_at)
    VALUES (${id}, ${data}::jsonb, ${ts}::timestamptz)
    ON CONFLICT (id) DO UPDATE
      SET data = CASE WHEN activity_log.updated_at < ${ts}::timestamptz THEN ${data}::jsonb ELSE activity_log.data END,
          updated_at = CASE WHEN activity_log.updated_at < ${ts}::timestamptz THEN ${ts}::timestamptz ELSE activity_log.updated_at END
  `;
}

// ---------------------------------------------------------------------------
// Push — apply a batch of mutations (last-write-wins)
// ---------------------------------------------------------------------------

export async function pushMutations(mutations: SyncMutation[]) {
  const results: { id: string; ok: boolean; error?: string }[] = [];

  for (const m of mutations) {
    try {
      const dataStr = JSON.stringify(m.data ?? {});

      switch (m.table) {
        case 'activity_log':
          await upsertActivityLog(m.id, dataStr, m.timestamp);
          break;
        case 'tasks':
          if (m.operation === 'delete') await deleteTask(m.id, m.timestamp);
          else await upsertTask(m.id, dataStr, m.timestamp);
          break;
        case 'people':
          if (m.operation === 'delete') await deletePerson(m.id, m.timestamp);
          else await upsertPerson(m.id, dataStr, m.timestamp);
          break;
        case 'hiring_positions':
          if (m.operation === 'delete') await deleteHiring(m.id, m.timestamp);
          else await upsertHiring(m.id, dataStr, m.timestamp);
          break;
        case 'associate_companies':
          if (m.operation === 'delete') await deleteCompany(m.id, m.timestamp);
          else await upsertCompany(m.id, dataStr, m.timestamp);
          break;
      }

      results.push({ id: m.id, ok: true });
    } catch (err) {
      results.push({ id: m.id, ok: false, error: String(err) });
    }
  }

  return results;
}
