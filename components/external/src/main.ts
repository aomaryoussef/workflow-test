import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { FawryModule } from './fawry/fawry.module';
import { ConfigService } from '@nestjs/config';
import { PaymobModule } from './paymob/paymob.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const loggerFactory = app.get<Function>('CUSTOM_LOGGER');
  const logger = loggerFactory('app');
  app.useLogger(logger);

  app.setGlobalPrefix('external');

  setupSwaggerDocumentation(app);
  app.enableCors();
  dotenv.config();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');

  await app.listen(port);
}
bootstrap();

function setupSwaggerDocumentation(app: INestApplication) {
  const allControllersConfig = new DocumentBuilder()
    .setTitle('Mylo External BFF')
    .setDescription(
      'Mylo External BFF to implement external integration with different providers',
    )
    .setVersion('1.0')
    .addBasicAuth()
    .build();

  const allControllersDocument = SwaggerModule.createDocument(
    app,
    allControllersConfig,
  );
  SwaggerModule.setup('external/api/docs', app, allControllersDocument);

  const specificDocs = [
    {
      path: 'external/fawry/api/docs',
      title: 'Fawry Docs',
      requireAuth: true,
      description: 'Documentation for fawry',
      modules: [FawryModule],
    },
    {
      path: 'external/paymob/api/docs',
      title: 'Paymob Docs',
      description: 'Documentation for paymob ',
      requireAuth: true,
      modules: [PaymobModule],
    },
  ];

  specificDocs.forEach((doc) => {
    const config = new DocumentBuilder()
      .setTitle(doc.title)
      .setDescription(doc.description)
      .setVersion('1.0');

    if (doc.requireAuth) {
      config.addBasicAuth();
    }

    const document = SwaggerModule.createDocument(app, config.build(), {
      include: doc.modules,
    });
    SwaggerModule.setup(doc.path, app, document);
  });
}
