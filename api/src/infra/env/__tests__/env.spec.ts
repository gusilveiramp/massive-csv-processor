import { envSchema } from '../env';

describe('envSchema', () => {
  it('should pass with valid environment variables', () => {
    const validEnv = {
      NODE_PORT: '3000',
      SOCKET_PORT: '0',
      DATABASE_URL: 'https://example.com',
      REDIS_PORT: '6379',
      REDIS_HOST: 'localhost',
      REDIS_PASSWORD: 'docker',
      CSV_CHUNK_SIZE: '1000',
      CSV_PROCESSOR_CONCURRENCY: '2',
      CSV_MAX_FILE_SIZE_MB: '10',
      CURRENCY_API_URL:
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies',
      CURRENCY_BASE: 'usd',
      CURRENCY_TARGETS: 'eur,brl,jpy',
    };

    const parsed = envSchema.parse(validEnv);

    expect(parsed.NODE_PORT).toBe(3000);
    expect(parsed.CSV_CHUNK_SIZE).toBe(1000);
    expect(parsed.CURRENCY_TARGETS).toEqual(['eur', 'brl', 'jpy']);
  });

  it('should throw if DATABASE_URL is missing or invalid', () => {
    expect(() =>
      envSchema.parse({
        NODE_PORT: '3000',
      }),
    ).toThrow();
  });

  it('should apply defaults when values are missing', () => {
    const partialEnv = {
      DATABASE_URL: 'https://example.com',
    };

    const parsed = envSchema.parse(partialEnv);

    expect(parsed.REDIS_PORT).toBe(6379);
    expect(parsed.CURRENCY_BASE).toBe('usd');
    expect(parsed.CURRENCY_TARGETS).toEqual(['eur', 'brl', 'jpy']);
  });
});
