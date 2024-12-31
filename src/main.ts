import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { ResponseTransformInterceptor } from './interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //cors
  app.enableCors();

  //prefix
  app.setGlobalPrefix('api');

  //validation
  app.useGlobalPipes(new ValidationPipe());

  //interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseTransformInterceptor(),
    new ErrorInterceptor(),
  );

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('API BLOGGER')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc-blogger', app, document, {
    customSiteTitle: 'API BLOGGER',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
