import dotenv from "dotenv";
import { name } from "./package.json";

dotenv.config();

export interface ApplicationConfig {
  appName: string;
  databaseHost: string;
  databasePort: string;
  databaseName: string;
  databaseUsername: string;
  databasePassword: string;
  environment: string;
  port: string;
  basketTimeout: number;
  checkoutDomain: string;
  baseURL: string;
  iamBaseURL: string;
  ketoReadBaseURL: string;
  partnerBaseURL: string;
  partnerUsersBaseURL: string;
  consumerBaseURL: string;
  scoringBaseURL: string;
  scoringToken: string;
  minicashBaseURL: string;
  minicashLoginURL: string;
  scoringEngineGetUserDataURL: string;
  minicashUsername: string;
  minicashPassword: string;
  offerWaitingTime: number;
  lmsBaseURL: string;
  registryBaseURL: string;
  workflowBaseURL: string;
  dataDogSite: string;
  dataDogToken: string;
  dataDogApplicationId: string;
  dataDogEnvironment: string;
  amplitudeToken: string;
  hasuraBaseURL: string;
  formanceBaseURL: string;
  formanceRequireLogin: boolean;
  formanceClientId: string;
  formanceClientSecret: string;
  formanceConnectorId: string;
  formanceWorldPaymentAccountId: string;
}

const config: ApplicationConfig = {
  appName: name,
  environment: process.env.OL_BFF_NODE_ENV || "production",
  databaseHost: process.env.OL_BFF_DATABASE_HOST || "127.0.0.1",
  databasePort: process.env.OL_BFF_DATABASE_PORT || "5432",
  databaseName: process.env.OL_BFF_DATABASE_NAME || "mylo_db",
  databaseUsername: process.env.OL_BFF_DATABASE_USERNAME || "db_user",
  databasePassword: process.env.OL_BFF_DATABASE_PASSWORD || "db_pass",
  port: process.env.OL_BFF_PORT || "3000",
  basketTimeout: process.env.OL_BFF_BASKET_TIMEOUT ? Number(process.env.OL_BFF_BASKET_TIMEOUT) : 120,
  checkoutDomain: process.env.OL_BFF_CHECKOUT_DOMAIN,
  baseURL: process.env.OL_BFF_BASE_URL,
  iamBaseURL: process.env.OL_BFF_IAM_BASE_URL,
  ketoReadBaseURL: process.env.OL_BFF_KETO_READ_BASE_URL,
  partnerBaseURL: process.env.OL_BFF_PARTNER_SERVICE_BASE_URL,
  partnerUsersBaseURL: process.env.OL_BFF_PARTNER_USERS_SERVICE_BASE_URL,
  consumerBaseURL: process.env.OL_BFF_CONSUMER_SERVICE_BASE_URL,
  scoringBaseURL: process.env.OL_BFF_SCORING_URL,
  scoringToken: process.env.OL_BFF_SCORING_TOKEN,
  minicashBaseURL: process.env.OL_BFF_MINICASH_BASE_URL,
  minicashLoginURL: process.env.OL_BFF_MINICASH_LOGIN_URL,
  scoringEngineGetUserDataURL: process.env.OL_BFF_SCORING_ENGINE_GET_USER_DATA_URL,
  minicashUsername: process.env.OL_BFF_MINICASH_USERNAME,
  minicashPassword: process.env.OL_BFF_MINICASH_PASSWORD,
  offerWaitingTime: process.env.OL_BFF_COMMERCIAL_OFFERS_WAITING_TIME
    ? Number(process.env.OL_BFF_COMMERCIAL_OFFERS_WAITING_TIME)
    : 2000,
  lmsBaseURL: process.env.OL_BFF_LMS_SERVICE_BASE_URL,
  registryBaseURL: process.env.OL_BFF_REGISTRY_SERVICE_BASE_URL,
  workflowBaseURL: process.env.OL_BFF_WORKFLOW_BASE_URL,
  dataDogSite: process.env.OL_BFF_DATADOG_SITE,
  dataDogToken: process.env.OL_BFF_DATADOG_TOKEN,
  dataDogApplicationId: process.env.OL_BFF_DATADOG_APPLICATION_ID,
  dataDogEnvironment: process.env.OL_BFF_DATADOG_ENVIRONMENT,
  amplitudeToken: process.env.OL_BFF_AMPLITUDE_TOKEN,
  hasuraBaseURL: process.env.OL_BFF_HASURA_BASE_URL || "http://hasura:8080/v1/graphql",
  formanceBaseURL: process.env.OL_BFF_FORMANCE_BASE_URL,
  formanceRequireLogin: process.env.OL_BFF_FORMANCE_REQUIRE_LOGIN === "true",
  formanceClientId: process.env.OL_BFF_FORMANCE_CLIENT_ID || "d7d7d2d0-af3f-45c9-82b1-da347e7acb82",
  formanceClientSecret: process.env.OL_BFF_FORMANCE_CLIENT_SECRET || "4ba5b231-4430-431d-b661-a4e38a31a113",
  formanceConnectorId:
    process.env.OL_BFF_FORMANCE_CONNECTOR_ID ||
    "eyJQcm92aWRlciI6IkdFTkVSSUMiLCJSZWZlcmVuY2UiOiJhN2RjYWM2Zi0xZWRjLTQ4MGYtYTBmNi04MmFkYzZjNmU1NzAifQ",
  formanceWorldPaymentAccountId:
    process.env.OL_BFF_FORMANCE_WORLD_PAYMENT_ACCOUNT_ID ||
    "eyJDb25uZWN0b3JJRCI6eyJQcm92aWRlciI6IkdFTkVSSUMiLCJSZWZlcmVuY2UiOiJhN2RjYWM2Zi0xZWRjLTQ4MGYtYTBmNi04MmFkYzZjNmU1NzAifSwiUmVmZXJlbmNlIjoiV09STEQifQ",
};

export { config };
