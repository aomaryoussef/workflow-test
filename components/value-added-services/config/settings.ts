import { plainToClass } from 'class-transformer';
import * as dotenv from 'dotenv';
dotenv.config();
import { validateSync } from 'class-validator';
import { EnvironmentConfigDto } from './settings.dto';

// Validate environment variables
export function validateConfig(config: Record<string, any>) {
  const validatedConfig = plainToClass(EnvironmentConfigDto, config, {
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
    name: validatedEnvConfig.VAS_APP_NAME,
    port: validatedEnvConfig.VAS_PORT,
    majorRelease: validatedEnvConfig.VAS_APP_MAJOR_RELEASE,
    minorRelease: validatedEnvConfig.VAS_APP_MINOR_RELEASE,
    patchRelease: validatedEnvConfig.VAS_APP_PATCH_RELEASE,
    environment: validatedEnvConfig.VAS_APP_ENVIRONMENT,
    phoneNumbersSafeList:
      validatedEnvConfig.VAS_APP_DEV_PHONE_NUMBERS_SAFE_LIST,
    useTestData: validatedEnvConfig.VAS_APP_DEV_USE_TEST_DATA,
    logLevel: validatedEnvConfig.VAS_APP_LOG_LEVEL,
    apiKey: validatedEnvConfig.VAS_APP_API_KEY,
    emailProvider: validatedEnvConfig.VAS_APP_EMAIL_PROVIDER,
  },
  database: {
    type: 'postgres', // Static value, not coming from env
    host: validatedEnvConfig.VAS_DB_HOST,
    port: validatedEnvConfig.VAS_DB_PORT,
    username: validatedEnvConfig.VAS_DB_USERNAME,
    password: validatedEnvConfig.VAS_DB_PASSWORD,
    database: validatedEnvConfig.VAS_DB_DATABASE,
    schema: validatedEnvConfig.VAS_DB_SCHEMA,
  },
  riskEngine: {
    url: validatedEnvConfig.VAS_RISK_ENGINE_URL,
    apiKey: validatedEnvConfig.VAS_RISK_ENGINE_API_KEY,
  },
  echoService: {
    baseUrl: validatedEnvConfig.VAS_ECHO_BASE_URL,
    apiKey: validatedEnvConfig.VAS_ECHO_API_KEY,
  },
  greenService: {
    baseUrl: validatedEnvConfig.VAS_GREEN_SERVICE_BASE_URL,
    apiKey: validatedEnvConfig.VAS_GREEN_SERVICE_API_KEY,
  },
  communicationChannel: {
    sms: validatedEnvConfig.VAS_COMMUNICATION_CHANNEL_SMS,
    voice: validatedEnvConfig.VAS_COMMUNICATION_CHANNEL_VOICE,
  },
  twilio: {
    accountSid: validatedEnvConfig.VAS_TWILIO_ACCOUNT_SID,
    authToken: validatedEnvConfig.VAS_TWILIO_AUTH_TOKEN,
    flowSid: validatedEnvConfig.VAS_TWILIO_FLOW_SID,
    templateId: validatedEnvConfig.VAS_TWILIO_TEMPLATE_ID,
    fromNumbers: validatedEnvConfig.VAS_TWILIO_FROM_NUMBERS,
  },
  smsTemplates: {
    consumerOnboardingOtp:
      validatedEnvConfig.VAS_SMS_TEMPLATES_CONSUMER_ONBOARDING_OTP,
    cashierOnboardingWelcome:
      validatedEnvConfig.VAS_SMS_TEMPLATES_CASHIER_ONBOARDING_WELCOME,
    orderConfirmation: validatedEnvConfig.VAS_SMS_TEMPLATES_ORDER_CONFIRMATION,
    consumerOnboardingWelcome:
      validatedEnvConfig.VAS_SMS_TEMPLATES_CONSUMER_ONBOARDING_WELCOME,
    partnerResetPassword:
      validatedEnvConfig.VAS_SMS_TEMPLATES_PARTNER_RESET_PASSWORD,
    checkoutOtp: validatedEnvConfig.VAS_SMS_TEMPLATES_CHECKOUT_OTP,
    returnProduct: validatedEnvConfig.VAS_SMS_TEMPLATES_RETURN_PRODUCT,
    dueToday: validatedEnvConfig.VAS_SMS_TEMPLATES_DUE_TODAY,
    dueFourDaysAgo: validatedEnvConfig.VAS_SMS_TEMPLATES_DUE_FOUR_DAYS_AGO,
    dueTwentyOneDaysAgo:
      validatedEnvConfig.VAS_SMS_TEMPLATES_DUE_TWENTY_ONE_DAYS_AGO,
    installmentPaymentReceived:
      validatedEnvConfig.VAS_SMS_TEMPLATES_INSTALLMENT_PAYMENT_RECEIVED,
    loanSettlementSuccess:
      validatedEnvConfig.VAS_SMS_TEMPLATES_LOAN_SETTLEMENT_SUCCESS,
  },
  scoringEngine: {
    url: validatedEnvConfig.VAS_SCORING_ENGINE_BASE_URL,
    apiKey: validatedEnvConfig.VAS_SCORING_ENGINE_API_KEY,
  },
  minicash: {
    loginUrl: validatedEnvConfig.VAS_MINICASH_LOGIN_URL,
    baseUrl: validatedEnvConfig.VAS_MINICASH_BASE_URL,
    username: validatedEnvConfig.VAS_MINICASH_USERNAME,
    password: validatedEnvConfig.VAS_MINICASH_PASSWORD,
  },
  conductor: {
    baseUrl: validatedEnvConfig.VAS_WORKFLOW_BASE_URL,
    pollingInterval: 200,
  },
  ses: {
    region: validatedEnvConfig.VAS_SES_REGION,
    accessKeyId: validatedEnvConfig.VAS_SES_ACCESS_KEY_ID,
    accessKey: validatedEnvConfig.VAS_SES_ACCESS_KEY,
    sourceEmail: validatedEnvConfig.VAS_SES_SOURCE_EMAIL,
  },
  sanctionEmail: {
    sanctionMailReceipientName: validatedEnvConfig.VAS_SANCTION_EMAIL_RECIPIENT_NAME,
    sanctionMailTo: validatedEnvConfig.VAS_SANCTION_EMAIL_TO,
    sanctionMailCc: validatedEnvConfig.VAS_SANCTION_EMAIL_CC,
  },
  kratosAdminUrl: validatedEnvConfig.VAS_KRATOS_ADMIN_URL,
  msDynamics :{
    baseUrl: validatedEnvConfig.VAS_MS_DYNAMICS_BASE_URL,
    activeDirectoryDynamicsTenantId: validatedEnvConfig.VAS_MS_DYNAMICS_ACTIVE_DIRECTORY_DYNAMICS_TENANT_ID,
    activeDirectoryBaseUrl: validatedEnvConfig.VAS_MS_DYNAMICS_ACTIVE_DIRECTORY_BASE_URL,
    clientId: validatedEnvConfig.VAS_MS_DYNAMICS_CLIENT_ID,
    clientSecret: validatedEnvConfig.VAS_MS_DYNAMICS_CLIENT_SECRET,
  },
};

export const settingFactory = () => {
  return settings;
};

process.env.TZ = 'UTC';
