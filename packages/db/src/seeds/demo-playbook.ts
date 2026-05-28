import type { Kysely } from 'kysely';

import type { Database } from '../schema.js';

export async function seedDemoPlaybook(db: Kysely<Database>, orgId: string): Promise<void> {
  // Seeding not implemented yet
  console.log(`seedDemoPlaybook: seeding not implemented (orgId=${orgId})`);
  void db;
}
