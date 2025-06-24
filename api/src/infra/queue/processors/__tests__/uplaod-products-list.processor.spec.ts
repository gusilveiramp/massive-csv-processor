import { Test, TestingModule } from '@nestjs/testing';
import { UploadProductsListProcessor } from '../upload-products-list.processor';
import { UploadProductsListUseCase } from '../../../../modules/products/use-cases/upload-products-list.use-case.';

import { Job } from 'bullmq';
import { ProductsGateway } from '../../../../modules/products/gateways/products.gateway';

describe('UploadProductsListProcessor', () => {
  let processor: UploadProductsListProcessor;
  let uploadUseCase: UploadProductsListUseCase;
  let gateway: ProductsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadProductsListProcessor,
        {
          provide: UploadProductsListUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ProductsGateway,
          useValue: {
            emitProgress: jest.fn(),
            emitCompleted: jest.fn(),
            emitFailed: jest.fn(),
          },
        },
      ],
    }).compile();

    processor = module.get(UploadProductsListProcessor);
    uploadUseCase = module.get(UploadProductsListUseCase);
    gateway = module.get(ProductsGateway);
  });

  it('should process job using UploadProductsListUseCase', async () => {
    const job = { id: '123', data: {} } as unknown as Job;
    await processor.process(job);
    expect(uploadUseCase.execute).toHaveBeenCalledWith(job);
  });

  it('should emit progress on onProgress', () => {
    const job = { id: '1', progress: 75 } as unknown as Job;
    processor.onProgress(job);
    expect(gateway.emitProgress).toHaveBeenCalledWith('1', 75);
  });

  it('should emit completed on onCompleted', () => {
    const job = { id: '1' } as unknown as Job;
    processor.onCompleted(job);
    expect(gateway.emitCompleted).toHaveBeenCalledWith('1');
  });

  it('should emit failed on onFailed', () => {
    const job = {
      id: '1',
      attemptsMade: 2,
      failedReason: 'Something went wrong',
    } as unknown as Job;
    processor.onFailed(job);
    expect(gateway.emitFailed).toHaveBeenCalledWith(
      '1',
      'Something went wrong',
    );
  });
});
