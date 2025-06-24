import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infra/database/database.module';
import { ProductsModule } from './modules/products/products.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { QueuesModule } from './infra/queue/queue.module';
import { EnvModule } from './infra/env/env.module';
import { envSchema } from './infra/env/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    ProductsModule,
    CurrencyModule,
    QueuesModule,
    EnvModule,
  ],
})
export class AppModule {}
