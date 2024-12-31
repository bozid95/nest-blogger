import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //prefix
  app.setGlobalPrefix('api');

  //validation
  app.useGlobalPipes(new ValidationPipe());

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
