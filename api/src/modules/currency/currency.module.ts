import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { EnvModule } from '../../infra/env/env.module';

@Module({
  imports: [HttpModule, EnvModule],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
