import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class InternalBffConfigDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10) || 3000)
  INTERNAL_BFF_PORT: number;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'internal-bff')
  INTERNAL_BFF_APP_NAME: string;

  @IsString()
  @IsOptional()
  @IsIn(['development', 'production', 'test', 'stage'])
  @Transform(({ value }) => value || 'development')
  INTERNAL_BFF_APP_ENVIRONMENT: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 1)
  INTERNAL_BFF_APP_MAJOR_RELEASE: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 0)
  INTERNAL_BFF_APP_MINOR_RELEASE: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 0)
  INTERNAL_BFF_APP_PATCH_RELEASE: number;

  @IsString()
  @IsOptional()
  @IsIn(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
  @Transform(({ value }) => value || 'debug')
  INTERNAL_BFF_APP_LOG_LEVEL: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'http://localhost:3004/')
  INTERNAL_BFF_VAS_BASE_URL: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'http://localhost:4455/.ory/kratos/public')
  INTERNAL_BFF_IAM_BASE_URL: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'http://keto:4466')
  INTERNAL_BFF_KETO_READ_BASE_URL: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'https://mc2-stg.btech.com/graphql')
  INTERNAL_BFF_SCORING_URL: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || '123')
  INTERNAL_BFF_SCORING_TOKEN: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'http://minicash-test.btech.com')
  INTERNAL_BFF_MINICASH_BASE_URL: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || '/MiniCashAPI/api/Scoring/GetUserData')
  INTERNAL_BFF_SCORING_ENGINE_GET_USER_DATA_URL: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || '/MinicashAPI/Token')
  INTERNAL_BFF_MINICASH_LOGIN_URL: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'Mylo.Minicash.Stg')
  INTERNAL_BFF_MINICASH_USERNAME: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'MM2024!@')
  INTERNAL_BFF_MINICASH_PASSWORD: string;

}

