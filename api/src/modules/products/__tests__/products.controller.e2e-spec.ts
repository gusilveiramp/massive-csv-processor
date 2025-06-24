import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a product', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Product Test',
        price: 49.99,
        expiration: new Date('2025-12-31'),
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Product Test');

    // Check exchange_rates
    expect(Array.isArray(res.body.exchange_rates)).toBe(true);
    expect(res.body.exchange_rates.length).toBeGreaterThan(0);

    const eur = res.body.exchange_rates.find((r) => r.currency === 'eur');
    expect(eur).toHaveProperty('converted_price');
  });

  it('should search for products', async () => {
    const res = await request(app.getHttpServer())
      .get('/products')
      .query({ page: 1, limit: 10 });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);

    // Validate exchange_rates in the first product (if any)
    if (res.body.products.length > 0) {
      const first = res.body.products[0];
      expect(Array.isArray(first.exchange_rates)).toBe(true);
      expect(first.exchange_rates.length).toBeGreaterThan(0);
    }
  });

  it('should find a product by id', async () => {
    const created = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Product Search',
        price: 29.99,
        expiration: new Date('2025-10-10'),
      });

    const id = created.body.id;

    const res = await request(app.getHttpServer()).get(`/products/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', id);
    expect(Array.isArray(res.body.exchange_rates)).toBe(true);
    expect(res.body.exchange_rates.length).toBeGreaterThan(0);
  });

  it('should update a product', async () => {
    const created = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Product Old',
        price: 39.99,
        expiration: new Date('2026-01-01'),
      });

    const id = created.body.id;

    const res = await request(app.getHttpServer())
      .patch(`/products/${id}`)
      .send({
        name: 'Product Updated',
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Product Updated');

    // Check exchange_rates after update
    expect(Array.isArray(res.body.exchange_rates)).toBe(true);
    expect(res.body.exchange_rates.length).toBeGreaterThan(0);
  });

  it('should delete a product', async () => {
    const created = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Product Delete',
        price: 19.99,
        expiration: new Date('2026-01-01'),
      });

    const id = created.body.id;
    const res = await request(app.getHttpServer()).delete(`/products/${id}`);

    expect(res.status).toBe(204);
  });
});
