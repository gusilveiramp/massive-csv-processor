import { z } from 'zod';

export const envSchema = z.object({
  // API
  NODE_PORT: z.coerce.number().default(3333),
  SOCKET_PORT: z.coerce.number().default(3334),

  // PostgreSQL
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PASSWORD: z.string().default('docker'),

  // CSV Processamento
  CSV_CHUNK_SIZE: z.coerce
    .number()
    .max(6000, { message: 'CSV_CHUNK_SIZE cannot be greater than 6000' })
    .default(1000),
  CSV_PROCESSOR_CONCURRENCY: z.coerce.number().default(2),
  CSV_MAX_FILE_SIZE_MB: z.coerce.number().optional(),

  // Currency API
  CURRENCY_API_URL: z
    .string()
    .default(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies',
    ),
  CURRENCY_BASE: z.string().default('usd'),
  CURRENCY_TARGETS: z
    .string()
    .default('eur,brl,jpy')
    .transform((val) => val.split(',').map((s) => s.trim())),
});

export type Env = z.infer<typeof envSchema>;
