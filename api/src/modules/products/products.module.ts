import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { CreateProductUseCase } from './use-cases/create-product.use-case';

import { CurrencyModule } from '../currency/currency.module';
import { FindProductUseCase } from './use-cases/find-product.use-case';
import { DeleteProductUseCase } from './use-cases/delete-product.use-case';
import { UpdateProductUseCase } from './use-cases/update-product.use-case';
import { SearchProductsUseCase } from './use-cases/search-products.use-case';
import { UploadProductsListUseCase } from './use-cases/upload-products-list.use-case.';
import { CreateProductsChunkUseCase } from './use-cases/create-products-chunks.use-case';
import { BullModule } from '@nestjs/bullmq';
import { ProductsGateway } from './gateways/products.gateway';
import { EnvModule } from '../../infra/env/env.module';

@Module({
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    UpdateProductUseCase,
    FindProductUseCase,
    DeleteProductUseCase,
    SearchProductsUseCase,
    UploadProductsListUseCase,
    CreateProductsChunkUseCase,
    ProductsGateway,
  ],
  imports: [
    EnvModule,
    CurrencyModule,
    BullModule.registerQueue({ name: 'upload-products' }),
  ],
  exports: [UploadProductsListUseCase],
})
export class ProductsModule {}
