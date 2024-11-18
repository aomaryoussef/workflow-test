import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as dotenv from 'dotenv';
import { InternalBffConfigDto } from './settings.type';

dotenv.config();

// Validate environment variables
export function validateConfig(config: Record<string, any>) {
  const validatedConfig = plainToClass(InternalBffConfigDto, config, {
    enableImplicitConversion: true, // Automatically convert types
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Config validation error: ${errors}`);
  }

  return validatedConfig;
}

const validatedEnvConfig = validateConfig(process.env);

// Create validatedSettings based on Joi validated values
export const settings = {
  app: {
    name: validatedEnvConfig.INTERNAL_BFF_APP_NAME,
    port: validatedEnvConfig.INTERNAL_BFF_PORT,
    majorRelease: validatedEnvConfig.INTERNAL_BFF_APP_MAJOR_RELEASE,
    minorRelease: validatedEnvConfig.INTERNAL_BFF_APP_MINOR_RELEASE,
    patchRelease: validatedEnvConfig.INTERNAL_BFF_APP_PATCH_RELEASE,
    environment: validatedEnvConfig.INTERNAL_BFF_APP_ENVIRONMENT,
    logLevel: validatedEnvConfig.INTERNAL_BFF_APP_LOG_LEVEL,
  },
  valueAddedService: {
    baseUrl: validatedEnvConfig.INTERNAL_BFF_VAS_BASE_URL, // Static value, not coming from env
  },
  hasura: {
    baseUrl: process.env.INTERNAL_BFF_GRAPHQL_URL || '',
  },
  minicash: {
    loginUrl: validatedEnvConfig.INTERNAL_BFF_MINICASH_LOGIN_URL,
    baseUrl: validatedEnvConfig.INTERNAL_BFF_MINICASH_BASE_URL,
    username: validatedEnvConfig.INTERNAL_BFF_MINICASH_USERNAME,
    password: validatedEnvConfig.INTERNAL_BFF_MINICASH_PASSWORD,
  },
  scoringEngine: {
    url: validatedEnvConfig.INTERNAL_BFF_SCORING_URL,
    apiKey: validatedEnvConfig.INTERNAL_BFF_SCORING_TOKEN,
  },
};
export const settingsFactory = () => {
  return settings;
};
process.env.TZ = 'UTC';
