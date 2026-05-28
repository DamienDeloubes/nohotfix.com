import { promises as fs } from 'node:fs';
import * as path from 'node:path';

import { FileMigrationProvider, Migrator } from 'kysely';

import { createKyselyClient } from './client.js';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const db = createKyselyClient({ connectionString });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });

  console.log('Running migrations...');
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`  ✓ ${it.migrationName}`);
    } else if (it.status === 'Error') {
      console.error(`  ✗ ${it.migrationName}`);
    }
  });

  if (error) {
    console.error('Migration failed:', error);
    await db.destroy();
    process.exit(1);
  }

  if (!results?.length) {
    console.log('No new migrations to run.');
  } else {
    console.log('Migrations complete.');
  }

  await db.destroy();
}

main();
