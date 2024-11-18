import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { engine } from 'express-handlebars';
import { handlebarsHelpers } from './pkg/hbsHelpers';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import './tracer';

async function bootstrap() {
  // start instrumenting your app with opentelmetry
  // tracer.start();

  const port = process.env.APP_PORT || '7001';

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://accounts.myloapp.local:7001',
    optionsSuccessStatus: 200,
  });

  app.set('view engine', 'hbs');
  app.engine(
    'hbs',
    engine({
      extname: 'hbs',
      layoutsDir: `${__dirname}/../views/layouts/`,
      partialsDir: `${__dirname}/../views/partials/`,
      defaultLayout: 'auth',
      helpers: handlebarsHelpers,
    }),
  );

  app.useStaticAssets(join(__dirname, '../', 'public'), { prefix: '/' });
  app.useStaticAssets(
    join(__dirname, '../', 'node_modules/@ory/elements-markup/dist'),
    { prefix: '/' },
  );

  await app.listen(port);
}
bootstrap();
