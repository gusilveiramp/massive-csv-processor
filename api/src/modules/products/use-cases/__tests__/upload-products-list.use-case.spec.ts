import { UploadProductsListUseCase } from '../upload-products-list.use-case.';
import { CurrencyService } from '../../../currency/currency.service';
import { CreateProductsChunkUseCase } from '../create-products-chunks.use-case';

import { Job } from 'bullmq';
import { EnvService } from '../../../../infra/env/env.service';

describe('UploadProductsListUseCase', () => {
  let useCase: UploadProductsListUseCase;
  let mockCurrencyService: CurrencyService;
  let mockCreateProductsChunkUseCase: CreateProductsChunkUseCase;
  const mockEnvService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'CSV_CHUNK_SIZE':
          return 1000;
        case 'CURRENCY_BASE':
          return 'usd';
        case 'CURRENCY_TARGETS':
          return ['eur', 'gbp', 'jpy', 'brl', 'cad'];
        default:
          return undefined;
      }
    }),
  };

  beforeEach(() => {
    mockCurrencyService = {
      getExchangeRates: jest.fn().mockResolvedValue({
        eur: 0.9,
        brl: 5.0,
      }),
    } as Partial<CurrencyService> as CurrencyService;

    mockCreateProductsChunkUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as Partial<CreateProductsChunkUseCase> as CreateProductsChunkUseCase;

    useCase = new UploadProductsListUseCase(
      mockCurrencyService as unknown as CurrencyService,
      mockCreateProductsChunkUseCase as unknown as CreateProductsChunkUseCase,
      mockEnvService as unknown as EnvService,
    );
  });

  it('should parse CSV, convert prices, and save chunks', async () => {
    const csv = `name;price;expiration
Smartphone X [001];1000;2025-12-31
Notebook Z [002];2000;2026-01-01`;

    const mockJob = {
      data: {
        file: {
          originalname: 'data.csv',
          mimetype: 'text/csv',
          buffer: Buffer.from(csv).toString('base64'),
        },
      },
      updateProgress: jest.fn(),
    } as unknown as Job;

    const result = await useCase.execute(mockJob);

    expect(mockCurrencyService.getExchangeRates).toHaveBeenCalledWith('usd', [
      'eur',
      'gbp',
      'jpy',
      'brl',
      'cad',
    ]);

    expect(mockCreateProductsChunkUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockCreateProductsChunkUseCase.execute).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.stringContaining('Smartphone X'),
          price: 1000,
          expiration: null,
          exchange_rates: expect.arrayContaining([
            expect.objectContaining({ currency: 'eur', converted_price: 900 }),
            expect.objectContaining({ currency: 'brl', converted_price: 5000 }),
          ]),
        }),
      ]),
    );

    expect(result).toEqual({ message: 'CSV processed successfully.' });
  });
});
