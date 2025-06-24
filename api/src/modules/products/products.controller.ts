import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { CreateProductUseCase } from './use-cases/create-product.use-case';
import { UpdateProductUseCase } from './use-cases/update-product.use-case';
import { FindProductUseCase } from './use-cases/find-product.use-case';
import { DeleteProductUseCase } from './use-cases/delete-product.use-case';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { SearchProductsDto } from './dto/search-products.dto';
import { SearchProductsUseCase } from './use-cases/search-products.use-case';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UpdateProductDto } from './dto/update-product.dto';

import { EnvService } from '../../infra/env/env.service';
import { buildParseFilePipe } from '../../common/pipes/build-parse-file.pipe';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly findProductUseCase: FindProductUseCase,
    private readonly searchProductsUseCase: SearchProductsUseCase,
    private readonly envService: EnvService,

    @InjectQueue('upload-products')
    private readonly productsQueue: Queue,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    const maxSizeMB = this.envService.get('CSV_MAX_FILE_SIZE_MB');
    const pipe = buildParseFilePipe({
      type: 'csv',
      maxSizeMB,
    });
    await pipe.transform(file);

    const job = await this.productsQueue.add('csv-process-job', {
      file: {
        ...file,
        buffer: file.buffer.toString('base64'),
      },
    });
    return {
      message: 'Files are being processed in the background.',
      jobId: job.id,
    };
  }

  @Post()
  async create(@Body() data: CreateProductDto): Promise<ProductEntity> {
    return this.createProductUseCase.execute(data);
  }

  @Get()
  async search(@Query() query: SearchProductsDto) {
    return this.searchProductsUseCase.execute(query);
  }

  @Get(':id')
  async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductEntity | null> {
    return this.findProductUseCase.execute(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ) {
    return this.updateProductUseCase.execute(Number(id), data);
  }

  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.deleteProductUseCase.execute(Number(id));
  }
}
