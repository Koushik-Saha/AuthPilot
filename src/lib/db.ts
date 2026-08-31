import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_2pkryCJv5EjY@ep-solitary-mode-ae3b70mu-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require'

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect()
  try {
    const res = await client.query(text, params)
    return res.rows
  } finally {
    client.release()
  }
}
