import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { settings } from '../config/settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const loggerFactory = app.get<Function>('CUSTOM_LOGGER');
  const logger = loggerFactory('app');
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are sent
      transform: true, // Automatically transform payloads to match DTO types
    }),
  );


  const MAJOR_VERSION = settings.app.majorRelease;
  const MINOR_VERSION = settings.app.minorRelease;
  const PATCH_VERSION = settings.app.patchRelease;

  const swaggerDescription = `
    This is the definition of **mylo Value Added Services REST API** v${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}
    
    Some useful information about **API** responses:
    
    - All error responses are returned as **ErrorResponse**
    - **Query** request: will always return **Pagination** as response
    - **Get** request: will always return **ObjectResponse** as response
    - If any **error** occurs: will always return **ErrorResponse** as response.
    
    You can find out whether it’s a **Query** or **Get** in the description of each Endpoint.
    
    Available Authentications:
    - **API-Key** (\`api-key\` in header) (development)
    - **Bearer JWT** (staging and production)
  `;

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('mylo Value Added Services API')
    .setDescription(swaggerDescription)
    .setVersion(`${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger will be available at /api
  await app.listen(settings.app.port);
}
bootstrap();
