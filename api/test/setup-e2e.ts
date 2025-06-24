import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { execSync } from 'child_process';

const schemaId = randomUUID();
const databaseURL = generateUniqueDatabaseURL(schemaId);
process.env.DATABASE_URL = databaseURL;

const prisma = new PrismaClient();
let app: INestApplication;

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined!');
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);
  return url.toString();
}

beforeAll(async () => {
  // 1. Executa as migrações
  execSync(`DATABASE_URL=${databaseURL} npx prisma migrate deploy`, {
    stdio: 'inherit',
  });

  // 2. Gera o client
  execSync(`npx prisma generate`, { stdio: 'inherit' });

  // 3. Conecta ao banco
  await prisma.$connect();

  // 4. Inicializa o app NestJS
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (app) {
    await app.close();
  }
});
