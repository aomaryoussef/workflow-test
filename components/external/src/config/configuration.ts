export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    logLevel: process.env.APP_LOG_LEVEL || 'debug',
  },
  formance: {
    baseURL: process.env.FORMANCE_BASE_URL || 'http://localhost:8086',
    requireLogin: process.env.FORMANCE_REQUIRE_LOGIN === 'true',
    connectorId:
      process.env.FORMANCE_CONNECTOR_ID ||
      'eyJQcm92aWRlciI6IkdFTkVSSUMiLCJSZWZlcmVuY2UiOiJhN2RjYWM2Zi0xZWRjLTQ4MGYtYTBmNi04MmFkYzZjNmU1NzAifQ',
    clientId:
      process.env.FORMANCE_CLIENT_ID || 'd7d7d2d0-af3f-45c9-82b1-da347e7acb82',
    clientSecret:
      process.env.FORMANCE_CLIENT_SECRET ||
      '4ba5b231-4430-431d-b661-a4e38a31a113',
    worldPaymentAccountId:
      process.env.FORMANCE_WORLD_PAYMENT_ACCOUNT_ID ||
      'eyJDb25uZWN0b3JJRCI6eyJQcm92aWRlciI6IkdFTkVSSUMiLCJSZWZlcmVuY2UiOiJhN2RjYWM2Zi0xZWRjLTQ4MGYtYTBmNi04MmFkYzZjNmU1NzAifSwiUmVmZXJlbmNlIjoiV09STEQifQ',
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'mylo',
  },
  fawry: {
    enableLogin: process.env.FAWRY_ENABLE_LOGIN === 'true',
    securityKey:
      process.env.FAWRY_SECURITY_KEY || 'e3c59f40-4c8b-42bc-be08-0121e85fc663',
  },
  serviceDepartment: {
    url:
      process.env.SERVICE_DEPARTMENT_URL || 'http://service-department:1337/v1',
  },
  hasura: {
    url: process.env.HASURA_URL || 'http://hasura:8080/v1/graphql',
  },
  iam: {
    kratosPublicBaseUrl:
      process.env.IAM_KRATOS_PUBLIC_BASE_URL || 'http://kratos:4433',
  },
  orkes: {
    baseURL: process.env.ORKES_BASE_URL || 'http://orkes:8080',
    workflows: {
      consumerRepayment: {
        name:
          process.env.ORKES_WORKFLOWS_CONSUMER_REPAYMENT_NAME ||
          'consumer_collection_process',
        version:
          parseInt(
            process.env.ORKES_WORKFLOWS_CONSUMER_REPAYMENT_VERSION,
            10,
          ) || 14,
      },
    },
  },
  workflow: {
    url: process.env.WORKFLOW_URL || 'http://localhost:5001',
  },
});
