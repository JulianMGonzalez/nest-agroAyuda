import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Logger */
  const logger = new Logger('AgroAyuda');

  /* Prefix */
  app.setGlobalPrefix('api');

  /* Global Pipes */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  /* Swagger */
  const config = new DocumentBuilder()
    .setTitle('AgroAyuda API')
    .setDescription('The AgroAyuda API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  /* Cors */
  app.enableCors();
  // app.enableCors( options );

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
