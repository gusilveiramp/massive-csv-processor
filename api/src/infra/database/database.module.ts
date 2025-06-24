import { Global, Module } from '@nestjs/common';
import { ProductsRepository } from '../../modules/products/repositories/products.repository';
import { PrismaProductsRepository } from './prisma/repositories/prisma-product.repository';
import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
  exports: [PrismaService, ProductsRepository],
})
export class DatabaseModule {}
