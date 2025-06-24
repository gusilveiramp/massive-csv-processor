import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { UploadProductsListProcessor } from './processors/upload-products-list.processor';
import { UploadProductsListUseCase } from '../../modules/products/use-cases/upload-products-list.use-case.';
import { CurrencyService } from '../../modules/currency/currency.service';
import { CreateProductsChunkUseCase } from '../../modules/products/use-cases/create-products-chunks.use-case';
import { HttpModule } from '@nestjs/axios';
import { ProductsGateway } from '../../modules/products/gateways/products.gateway';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';

@Module({
  imports: [
    EnvModule,
    ConfigModule,
    HttpModule,
    BullModule.forRootAsync({
      imports: [EnvModule],
      useFactory: async (env: EnvService) => ({
        connection: {
          port: env.get('REDIS_PORT'),
          host: env.get('REDIS_HOST'),
          password: env.get('REDIS_PASSWORD'),
        },
        defaultJobOptions: {
          attempts: 3,
          removeOnComplete: 1000,
          removeOnFail: 3000,
        },
      }),
      inject: [EnvService],
    }),
  ],
  providers: [
    UploadProductsListProcessor,
    UploadProductsListUseCase,
    CreateProductsChunkUseCase,
    CurrencyService,
    ProductsGateway,
  ],
})
export class QueuesModule {}
