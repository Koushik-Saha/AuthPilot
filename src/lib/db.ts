import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

export const pool = new Pool({
  connectionString: connectionString || 'postgresql://localhost:5432/authpilot',
  ssl: connectionString && (connectionString.includes('sslmode=require') || connectionString.includes('neon.tech'))
    ? { rejectUnauthorized: false }
    : undefined,
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
