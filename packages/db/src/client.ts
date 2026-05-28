import { Kysely, PostgresDialect, type KyselyPlugin } from 'kysely';
import { Pool } from 'pg';

import type { Database } from './schema.js';

export interface KyselyClientConfig {
  connectionString: string;
  plugins?: KyselyPlugin[];
}

export function createKyselyClient(config: KyselyClientConfig): Kysely<Database> {
  const pool = new Pool({
    connectionString: config.connectionString,
  });

  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
    ...(config.plugins ? { plugins: config.plugins } : {}),
  });
}
