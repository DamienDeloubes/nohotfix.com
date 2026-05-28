import type { Database } from '@nohotfix/db';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import type { Kysely, Transaction } from 'kysely';

import {
  KyselyChangelogRepository,
  KyselyPlaybookRepository,
  KyselyPlaybookSectionRepository,
  KyselyPlaybookSpecRepository,
  KyselySpecLibraryRepository,
} from '../../adapters/repositories/index.js';

export interface TransactionalRoot {
  specLibraryRepo: KyselySpecLibraryRepository;
  changelogRepo: KyselyChangelogRepository;
  playbookRepo: KyselyPlaybookRepository;
  playbookSectionRepo: KyselyPlaybookSectionRepository;
  playbookSpecRepo: KyselyPlaybookSpecRepository;
}

export type WithTransaction = <T>(fn: (txRoot: TransactionalRoot) => Promise<T>) => Promise<T>;

const txTracer = trace.getTracer('db.transaction');

export function createWithTransaction(db: Kysely<Database>): WithTransaction {
  return async <T>(fn: (txRoot: TransactionalRoot) => Promise<T>): Promise<T> => {
    return txTracer.startActiveSpan('db.transaction', async (span) => {
      try {
        const result = await db.transaction().execute(async (trx: Transaction<Database>) => {
          const txSpecLibraryRepo = new KyselySpecLibraryRepository(trx);
          const txChangelogRepo = new KyselyChangelogRepository(trx);
          const txPlaybookRepo = new KyselyPlaybookRepository(trx);
          const txPlaybookSectionRepo = new KyselyPlaybookSectionRepository(trx);
          const txPlaybookSpecRepo = new KyselyPlaybookSpecRepository(trx);
          return fn({
            specLibraryRepo: txSpecLibraryRepo,
            changelogRepo: txChangelogRepo,
            playbookRepo: txPlaybookRepo,
            playbookSectionRepo: txPlaybookSectionRepo,
            playbookSpecRepo: txPlaybookSpecRepo,
          });
        });
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error instanceof Error ? error.message : 'unknown error' });
        if (error instanceof Error) {
          span.recordException(error);
        }
        throw error;
      } finally {
        span.end();
      }
    });
  };
}
