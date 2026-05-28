import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1).optional(),
  WORKOS_CLIENT_ID: z.string().min(1),
  WORKOS_API_KEY: z.string().min(1),
  WORKOS_REDIRECT_URI: z.string().min(1),
  APP_URL: z.string().url(),
  COOKIE_SECRET: z.string().min(32),
  //   STRIPE_SECRET_KEY: z.string().min(1),
  //   STRIPE_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  WEB_URL: z.string().url(),
  //   DO_SPACES_KEY: z.string().min(1),
  //   DO_SPACES_SECRET: z.string().min(1),
  //   DO_SPACES_BUCKET: z.string().min(1),
  //   DO_SPACES_REGION: z.string().min(1),
  //   DO_SPACES_ENDPOINT: z.string().url(),
  SENTRY_DSN: z.string().url().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
});

export type Config = z.infer<typeof configSchema>;

export function parseConfig(): Config {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map((i) => i.path.join('.')).join(', ');
    throw new Error(`Invalid environment configuration. Missing or invalid vars: ${missing}`);
  }
  return result.data;
}
