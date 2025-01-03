import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { swaggerConfig } from './config/swagger.config';
import { AllInOneInterceptor } from './interceptor/all.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //cors
  app.enableCors();

  //prefix
  app.setGlobalPrefix('api');

  //validation
  app.useGlobalPipes(new ValidationPipe());

  //interceptors
  app.useGlobalInterceptors(new AllInOneInterceptor());

  // Swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Setup Swagger pada path '/api'
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
