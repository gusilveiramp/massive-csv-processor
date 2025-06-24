import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EnvService } from './infra/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(EnvService);
  const port = configService.get('NODE_PORT');
  await app.listen(port);
}

bootstrap().catch((error) => {
  console.error('Error during app bootstrap:', error);
  process.exit(1);
});
