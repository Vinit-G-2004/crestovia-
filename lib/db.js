import { neon } from '@neondatabase/serverless';
import { seedState } from './seed';

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

const sql = connectionString ? neon(connectionString) : null;

let tableReady = false;

async function ensureTable() {
  if (tableReady) return;
  if (!sql) throw new Error('No database connected. Add a Postgres database to this project on Vercel.');
  await sql`
    CREATE TABLE IF NOT EXISTS app_state (
      id INT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  tableReady = true;
}

// Returns the single stored state row, creating it with seed data on first use.
export async function getState() {
  await ensureTable();
  const rows = await sql`SELECT data FROM app_state WHERE id = 1`;
  if (rows[0]) return rows[0].data;
  const seeded = seedState();
  await sql`INSERT INTO app_state (id, data) VALUES (1, ${JSON.stringify(seeded)}::jsonb)
            ON CONFLICT (id) DO NOTHING`;
  const rows2 = await sql`SELECT data FROM app_state WHERE id = 1`;
  return rows2[0] ? rows2[0].data : seeded;
}

export async function setState(data) {
  await ensureTable();
  await sql`
    INSERT INTO app_state (id, data, updated_at) VALUES (1, ${JSON.stringify(data)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
  `;
}
