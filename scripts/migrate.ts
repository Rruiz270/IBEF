/**
 * scripts/migrate.ts
 * Run once to create tables in Vercel Postgres.
 *
 * Usage:
 *   npx tsx scripts/migrate.ts
 *
 * Requires POSTGRES_URL in .env.local (or Vercel env vars).
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { sql } from '@vercel/postgres';

async function migrate() {
  console.log('Creating tables...');

  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted BOOLEAN NOT NULL DEFAULT FALSE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS people (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted BOOLEAN NOT NULL DEFAULT FALSE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS hiring_positions (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted BOOLEAN NOT NULL DEFAULT FALSE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS associate_companies (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted BOOLEAN NOT NULL DEFAULT FALSE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Indexes for incremental sync
  console.log('Creating indexes...');

  await sql`CREATE INDEX IF NOT EXISTS idx_tasks_updated ON tasks(updated_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_people_updated ON people(updated_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_hiring_updated ON hiring_positions(updated_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_companies_updated ON associate_companies(updated_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_activity_updated ON activity_log(updated_at)`;

  console.log('Migration complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
