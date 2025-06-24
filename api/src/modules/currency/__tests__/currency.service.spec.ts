import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, HttpModule } from '@nestjs/axios';
import { CurrencyService } from '../currency.service';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { EnvService } from '../../../infra/env/env.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpService: HttpService;
  const mockEnvService = {
    get: jest.fn().mockReturnValue('https://fake-api.com'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        CurrencyService,
        {
          provide: EnvService,
          useValue: mockEnvService,
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should return filtered exchange rates', async () => {
    const mockApiResponse: AxiosResponse = {
      data: {
        usd: {
          eur: 0.9,
          brl: 5.1,
          gbp: 0.8,
          jpy: 150,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
        url: '',
        method: 'get',
      },
    };

    jest
      .spyOn(httpService.axiosRef, 'get')
      .mockResolvedValueOnce(mockApiResponse);

    const result = await service.getExchangeRates('usd', ['eur', 'brl']);

    expect(result).toEqual({ eur: 0.9, brl: 5.1 });
  });

  it('should throw an error if the request fails', async () => {
    jest
      .spyOn(httpService.axiosRef, 'get')
      .mockRejectedValueOnce(new Error('Network error'));

    await expect(
      service.getExchangeRates('usd', ['eur', 'brl']),
    ).rejects.toThrow('Failed to get exchange rates.');
  });
});
