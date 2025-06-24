import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject } from '@nestjs/common';

import { UploadProductsListUseCase } from '../../../modules/products/use-cases/upload-products-list.use-case.';
import { ProductsGateway } from '../../../modules/products/gateways/products.gateway';

const concurrency = parseInt(process.env.CSV_PROCESSOR_CONCURRENCY || '3');
@Processor('upload-products', { concurrency: concurrency }) // 3 jobs concurrent
export class UploadProductsListProcessor extends WorkerHost {
  constructor(
    @Inject(UploadProductsListUseCase)
    private readonly uploadProductsListUseCase: UploadProductsListUseCase,
    private readonly productsGateway: ProductsGateway,
  ) {
    super();
  }

  async process(job: Job) {
    await this.uploadProductsListUseCase.execute(job);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    console.log(`Job ${job.id} is in progress: ${job.progress}% completed.`);
    this.productsGateway.emitProgress(String(job.id), Number(job.progress));
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job with id ${job.id} COMPLETED!`);
    this.productsGateway.emitCompleted(String(job.id));
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(
      `Job with id ${job.id} FAILED! Attempt Number ${job.attemptsMade}`,
    );
    this.productsGateway.emitFailed(
      String(job.id),
      job.failedReason ?? 'Unknown error',
    );
  }
}
