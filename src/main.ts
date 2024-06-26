import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  /**
   * Get port from .env
   * Get global prefix from .env
   */
  const port = configService.get<number>('PORT');
  const globalPrefix = configService.get<string>('API_PREFIX');

  /**
   * Set global validation pipe
   * Set global prefix endpoint
   * Enable CORS
   */
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();

  await app.listen(port);
}

bootstrap();
