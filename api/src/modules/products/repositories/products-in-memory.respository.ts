import { ProductsRepository } from './products.repository';
import { ProductEntity } from '../entities/product.entity';

export class ProductsInMemoryRepository implements ProductsRepository {
  private products: ProductEntity[] = [];
  private nextId = 1; // Simulate auto-increment behavior

  async create(product: ProductEntity): Promise<ProductEntity> {
    const newProduct = new ProductEntity({
      ...product,
      id: this.nextId++,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.products.push(newProduct);
    return newProduct;
  }

  async findById(id: number): Promise<ProductEntity | null> {
    return this.products.find((product) => product.id === id) || null;
  }

  async update(
    id: number,
    productData: Partial<ProductEntity>,
  ): Promise<ProductEntity | null> {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...productData,
      updated_at: new Date(),
    };

    return this.products[index];
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter((product) => product.id !== id);
    return this.products.length < initialLength;
  }

  async search(
    search?: string,
    page = 1,
    limit = 10,
  ): Promise<{ products: ProductEntity[]; total: number }> {
    let filteredProducts = [...this.products];

    // If search term is provided, filter by product name (case insensitive)
    if (search) {
      const lowerCaseSearch = search.toLowerCase();
      filteredProducts = filteredProducts.filter((product) =>
        product.name?.toLowerCase().includes(lowerCaseSearch),
      );
    }

    // Get total count before pagination
    const total = filteredProducts.length;

    // Apply pagination (slice array)
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return { products: paginatedProducts, total };
  }

  async createMany(products: ProductEntity[]): Promise<void> {
    for (const product of products) {
      const newProduct = new ProductEntity({
        ...product,
        id: this.nextId++,
        created_at: new Date(),
        updated_at: new Date(),
      });

      this.products.push(newProduct);
    }
  }
}
