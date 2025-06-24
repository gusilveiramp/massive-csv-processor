import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../../infra/env/env.service';

@Injectable()
export class CurrencyService {
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly envService: EnvService,
  ) {
    this.apiUrl = this.envService.get('CURRENCY_API_URL');
  }

  async getExchangeRates(
    baseCurrency: string,
    targetCurrencies: string[],
  ): Promise<Record<string, number>> {
    try {
      const url = `${this.apiUrl}/${baseCurrency}.json`;

      const response = await this.httpService.axiosRef.get(url);
      const rates = response.data[baseCurrency];

      return targetCurrencies.reduce((filteredRates, currency) => {
        if (rates[currency]) {
          filteredRates[currency] = rates[currency];
        }
        return filteredRates;
      }, {});
    } catch (error) {
      throw new Error('Failed to get exchange rates.');
    }
  }
}
