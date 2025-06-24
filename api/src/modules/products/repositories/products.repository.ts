import { ProductEntity } from '../entities/product.entity';

export abstract class ProductsRepository {
  abstract create(product: ProductEntity): Promise<ProductEntity>;
  abstract createMany(products: ProductEntity[]): Promise<void>;
  abstract findById(id: number): Promise<ProductEntity | null>;
  abstract update(
    id: number,
    productData: Partial<ProductEntity>,
  ): Promise<ProductEntity | null>;
  abstract delete(id: number): Promise<boolean>;
  abstract search(
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ products: ProductEntity[]; total: number }>;
}
