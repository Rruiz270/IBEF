/**
 * scripts/seed.ts
 * Populate the Postgres database with data from projectData.ts.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires POSTGRES_URL in .env.local (or Vercel env vars).
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { sql } from '@vercel/postgres';
import {
  tasks,
  hiring,
  companies,
  people,
} from '../src/data/projectData';

async function seed() {
  console.log('Seeding tasks...');
  for (const task of tasks) {
    await sql`
      INSERT INTO tasks (id, data, updated_at, deleted)
      VALUES (${task.id}, ${JSON.stringify(task)}::jsonb, NOW(), FALSE)
      ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(task)}::jsonb, updated_at = NOW()
    `;
  }
  console.log(`  ${tasks.length} tasks seeded.`);

  console.log('Seeding people...');
  for (const person of people) {
    await sql`
      INSERT INTO people (id, data, updated_at, deleted)
      VALUES (${person.id}, ${JSON.stringify(person)}::jsonb, NOW(), FALSE)
      ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(person)}::jsonb, updated_at = NOW()
    `;
  }
  console.log(`  ${people.length} people seeded.`);

  console.log('Seeding hiring positions...');
  for (const pos of hiring) {
    await sql`
      INSERT INTO hiring_positions (id, data, updated_at, deleted)
      VALUES (${pos.id}, ${JSON.stringify(pos)}::jsonb, NOW(), FALSE)
      ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(pos)}::jsonb, updated_at = NOW()
    `;
  }
  console.log(`  ${hiring.length} hiring positions seeded.`);

  console.log('Seeding associate companies...');
  for (const company of companies) {
    await sql`
      INSERT INTO associate_companies (id, data, updated_at, deleted)
      VALUES (${company.id}, ${JSON.stringify(company)}::jsonb, NOW(), FALSE)
      ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(company)}::jsonb, updated_at = NOW()
    `;
  }
  console.log(`  ${companies.length} companies seeded.`);

  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
