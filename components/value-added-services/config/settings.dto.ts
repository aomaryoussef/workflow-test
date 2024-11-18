import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsIn,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class EnvironmentConfigDto {
  INTERNAL_BFF_
  @Expose()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 3000)
  VAS_PORT: number;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'value-added-services')
  VAS_APP_NAME: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsIn(['development', 'production', 'test', 'stage'])
  @Transform(({ value }) => value || 'development')
  VAS_APP_ENVIRONMENT: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 1)
  VAS_APP_MAJOR_RELEASE: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 0)
  VAS_APP_MINOR_RELEASE: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 0)
  VAS_APP_PATCH_RELEASE: number;

  @Expose()
  @IsString()
  @IsOptional()
  @IsIn(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
  @Transform(({ value }) => value || 'debug')
  VAS_APP_LOG_LEVEL: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || '123456')
  VAS_APP_API_KEY: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(
    ({ value }) =>
      value?.split(',') || [
        '01277256326',
        '01111462422',
        '01098488223',
        '01507009664',
        '01284998608',
        '01023674218',
        '01097216739',
        '01157615617',
        '01123000747',
        '01100057374',
        '01003138613',
        '01201667332',
        '01507009664',
        '01002740215',
        '01068702228',
        '01007937791',
        '01002997178',
        '0100975873',
        '01276906394',
        '01006630731',
        '01100057374',
        '01114698430',
        '01026908985',
        '01224357779',
        '01550132422',
        '01009777328',
        '01226191931',
        '01227184561',
        '01151812346',
      ],
  )
  VAS_APP_DEV_PHONE_NUMBERS_SAFE_LIST: string[];

  @Expose()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || false)
  VAS_APP_DEV_USE_TEST_DATA: boolean;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'ses')
  VAS_APP_EMAIL_PROVIDER: string

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'localhost')
  VAS_DB_HOST: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 5432)
  VAS_DB_PORT: number;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'db_user')
  VAS_DB_USERNAME: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'db_pass')
  VAS_DB_PASSWORD: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'mylo_db')
  VAS_DB_DATABASE: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'public')
  VAS_DB_SCHEMA: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'http://localhost:5001/api/risk/score')
  VAS_RISK_ENGINE_URL: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || 'CAS49d103a36844249fd2D32142a8d8EdF2')
  VAS_RISK_ENGINE_API_KEY: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_ECHO_BASE_URL?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || '123')
  VAS_ECHO_API_KEY?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_GREEN_SERVICE_BASE_URL?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_GREEN_SERVICE_API_KEY?: string;

  @Expose()
  @IsString()
  @IsIn(['twilio', 'green_service'])
  @IsOptional()
  @Transform(({ value }) => value || 'green_service')
  VAS_COMMUNICATION_CHANNEL_SMS: string;

  @Expose()
  @IsString()
  @IsIn(['twilio', 'green_service'])
  @IsOptional()
  @Transform(({ value }) => value || 'green_service')
  VAS_COMMUNICATION_CHANNEL_VOICE: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || '')
  VAS_TWILIO_ACCOUNT_SID?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || '')
  VAS_TWILIO_AUTH_TOKEN?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_TWILIO_FLOW_SID?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_TWILIO_TEMPLATE_ID?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_TWILIO_FROM_NUMBERS?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_CONSUMER_ONBOARDING_OTP?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_CASHIER_ONBOARDING_WELCOME?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_ORDER_CONFIRMATION?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_CONSUMER_ONBOARDING_WELCOME?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_PARTNER_RESET_PASSWORD?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_CHECKOUT_OTP?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_RETURN_PRODUCT?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_DUE_TODAY?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_DUE_FOUR_DAYS_AGO?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_DUE_TWENTY_ONE_DAYS_AGO?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_INSTALLMENT_PAYMENT_RECEIVED?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SMS_TEMPLATES_LOAN_SETTLEMENT_SUCCESS?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_KRATOS_ADMIN_URL?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_SCORING_ENGINE_BASE_URL?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || '123')
  VAS_SCORING_ENGINE_API_KEY?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_MINICASH_LOGIN_URL?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_MINICASH_BASE_URL?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_MINICASH_USERNAME?: string;

  @Expose()
  @IsOptional()
  @IsString()
  VAS_MINICASH_PASSWORD?: string;

  @IsString()
  @IsNotEmpty()
  VAS_WORKFLOW_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  VAS_SES_ACCESS_KEY_ID: string

  @IsString()
  @IsNotEmpty()
  VAS_SES_ACCESS_KEY: string

  @IsString()
  @IsNotEmpty()
  VAS_SES_REGION: string

  @IsString()
  @IsNotEmpty()
  VAS_SES_SOURCE_EMAIL: string

  @IsString()
  @IsNotEmpty()
  VAS_SANCTION_EMAIL_CC

  @IsString()
  @IsNotEmpty()
  VAS_SANCTION_EMAIL_TO

  @IsString()
  @IsNotEmpty()
  VAS_SANCTION_EMAIL_RECIPIENT_NAME

  @IsString()
  @IsNotEmpty()
  VAS_MS_DYNAMICS_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  VAS_MS_DYNAMICS_ACTIVE_DIRECTORY_DYNAMICS_TENANT_ID: string;

  @IsString()
  @IsNotEmpty()
  VAS_MS_DYNAMICS_ACTIVE_DIRECTORY_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  VAS_MS_DYNAMICS_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  VAS_MS_DYNAMICS_CLIENT_SECRET: string;

}
