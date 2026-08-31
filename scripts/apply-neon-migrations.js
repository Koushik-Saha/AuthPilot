const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_2pkryCJv5EjY@ep-solitary-mode-ae3b70mu-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function runMigrations() {
  console.log('Connecting to Neon PostgreSQL database...');
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to Neon successfully!');

  const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    console.log(`Executing migration: ${file}...`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      await client.query(sql);
      console.log(`✓ Migration ${file} applied successfully.`);
    } catch (err) {
      console.error(`X Error executing migration ${file}:`, err.message);
    }
  }

  await client.end();
  console.log('All migrations process completed on Neon database.');
}

runMigrations().catch((err) => {
  console.error('Migration runner failed:', err);
  process.exit(1);
});
