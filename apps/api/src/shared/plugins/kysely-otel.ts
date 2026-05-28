import { SpanStatusCode, trace, type Span } from '@opentelemetry/api';
import type { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs, QueryResult, RootOperationNode, UnknownRow } from 'kysely';

const tracer = trace.getTracer('kysely');

interface QueryMeta {
  operation: string;
  table: string | undefined;
  span: Span;
}

/**
 * Extract the target table name from a Kysely AST node.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyNode = any;

function extractTable(node: RootOperationNode): string | undefined {
  const n = node as AnyNode;
  switch (node.kind) {
    case 'InsertQueryNode':
      return n.into?.table?.identifier?.name;
    case 'UpdateQueryNode':
      return n.table?.table?.identifier?.name;
    case 'DeleteQueryNode':
    case 'SelectQueryNode':
      return n.from?.froms?.[0]?.table?.identifier?.name;
    default:
      return undefined;
  }
}

export class KyselyOtelPlugin implements KyselyPlugin {
  readonly #queryData = new WeakMap<object, QueryMeta>();

  transformQuery(args: PluginTransformQueryArgs): PluginTransformQueryArgs['node'] {
    const operation = args.node.kind.replace('QueryNode', '').toLowerCase();
    const table = extractTable(args.node);
    const spanName = table ? `db.${operation} ${table}` : `db.${operation}`;

    // Start the span here so it captures actual query execution time
    const span = tracer.startSpan(spanName);
    span.setAttribute('db.system', 'postgresql');
    span.setAttribute('db.operation.name', operation);
    if (table) {
      span.setAttribute('db.collection.name', table);
    }

    this.#queryData.set(args.queryId, { operation, table, span });
    return args.node;
  }

  async transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>> {
    const meta = this.#queryData.get(args.queryId);
    if (!meta) return args.result;

    const { span } = meta;

    try {
      if (args.result.numAffectedRows !== undefined) {
        span.setAttribute('db.response.rows_affected', Number(args.result.numAffectedRows));
      }
      if (args.result.rows) {
        span.setAttribute('db.response.returned_rows', args.result.rows.length);
      }

      span.setStatus({ code: SpanStatusCode.OK });
      return args.result;
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error instanceof Error ? error.message : 'unknown error' });
      if (error instanceof Error) {
        span.recordException(error);
      }
      throw error;
    } finally {
      span.end();
    }
  }
}
