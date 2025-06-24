import { BadRequestException, Injectable } from '@nestjs/common';

import * as csvParser from 'csv-parser';
import { Readable } from 'node:stream';
import { sanitizeProductName } from '../utils/sanitize-product-name';
import { sanitizeProductPrice } from '../utils/sanitize-product-price';
import { sanitizeExpiration } from '../utils/sanitize-product-expiration';
import { CurrencyService } from '../../currency/currency.service';
import { CreateProductsChunkUseCase } from './create-products-chunks.use-case';
import { Job } from 'bullmq';
import { EnvService } from '../../../infra/env/env.service';
import { CreateProductWithExchangeRatesDto } from '../dto/create-product-with-exchange-rates.dto';

@Injectable()
export class UploadProductsListUseCase {
  constructor(
    private readonly currencyService: CurrencyService,
    private readonly createProductsChunkUseCase: CreateProductsChunkUseCase,
    private readonly envService: EnvService,
  ) {}

  async execute(job: Job) {
    const file = job.data.file;

    // Decode the base64 buffer
    file.buffer = Buffer.from(file.buffer, 'base64');

    const baseCurrency = this.envService.get('CURRENCY_BASE');
    const targetCurrencies = this.envService.get('CURRENCY_TARGETS');
    const exchangeRates = await this.currencyService.getExchangeRates(
      baseCurrency,
      targetCurrencies,
    );

    const stream = Readable.from(file.buffer);

    const fileString = file.buffer.toString('utf-8');
    const firstLine = fileString.split(/\r?\n/)[0];
    const detectedSeparator = firstLine.includes(';') ? ';' : ',';
    const totalLines = fileString.split('\n').length - 1;
    const chunkSize = this.envService.get('CSV_CHUNK_SIZE');
    const totalChunks = Math.ceil(totalLines / chunkSize);

    let totalProcessedRows = 0;
    let chunksProcessed = 0;
    let lastProgress = 0;

    const productsWithExchangeRates: CreateProductWithExchangeRatesDto[] = [];

    return new Promise((resolve, reject) => {
      let processingChunk = Promise.resolve(); // Holds current chunk processing

      stream
        .pipe(
          csvParser({
            separator: detectedSeparator,
            headers: ['name', 'price', 'expiration'],
            skipLines: 1,
          }),
        )
        .on('data', async (row) => {
          totalProcessedRows++;

          const { productName, productCode } = sanitizeProductName(row.name);
          const productPrice = sanitizeProductPrice(row.price);
          const productExpiration = sanitizeExpiration(row.expiration);

          const convertedPrices = Object.entries(
            exchangeRates as Record<string, number>,
          ).map(([currency, exchange_rate]) => ({
            currency,
            exchange_rate,
            converted_price:
              productPrice != null ? productPrice * exchange_rate : null,
          }));

          productsWithExchangeRates.push({
            name: `${productName} #(${productCode})`,
            price: productPrice,
            expiration: productExpiration,
            exchange_rates: convertedPrices,
          });

          // File reading progress
          const streamProgress = Math.round(
            (totalProcessedRows / totalLines) * 100,
          );
          if (streamProgress !== lastProgress) {
            lastProgress = streamProgress;
            console.log(`Progress (stream): ${streamProgress}%`);
          }

          // When it reaches the chunk size, it sends it for processing
          if (productsWithExchangeRates.length >= chunkSize) {
            const chunk = [...productsWithExchangeRates];
            productsWithExchangeRates.length = 0;

            processingChunk = processingChunk.then(async () => {
              await this.createProductsChunkUseCase.execute(chunk);
              chunksProcessed++;
              const realProgress = Math.round(
                (chunksProcessed / totalChunks) * 100,
              );
              job.updateProgress(realProgress);
            });
          }
        })
        .on('end', async () => {
          if (productsWithExchangeRates.length > 0) {
            // Adds the last chunk to the processing queue
            processingChunk = processingChunk.then(() =>
              this.createProductsChunkUseCase.execute(
                productsWithExchangeRates,
              ),
            );
          }
          // Wait for the whole line to finish
          await processingChunk;
          resolve({ message: 'CSV processed successfully.' });
        })
        .on('error', (error) => {
          reject(
            new BadRequestException('Error processing CSV: ' + error.message),
          );
        });
    });
  }
}
