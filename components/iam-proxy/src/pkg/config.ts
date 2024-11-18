export default () => ({
  appPort: process.env.APP_PORT || '7001',
  appCookieName:
    process.env.APP_CSRF_COOKIE_NAME ||
    '__HOST-accounts.myapp.local-x-csrf-token',
  appCookieSecret:
    process.env.APP_COOKIE_SECRET || 'rjqokMDs4agcd5oOh6rimWETkLWdn9ON',
  kratosConsumerPublicBaseUrl:
    process.env.KRATOS_CONSUMER_PUBLIC_BASE_URL ||
    'http://accounts.consumer.myloapp.local',
  kratosConsumerInternalBaseUrl:
    process.env.KRATOS_CONSUMER_INTERNAL_BASE_URL ||
    'http://kratos.partner.myloapp.local:5534',
  kratosPartnerPublicBaseUrl:
    process.env.KRATOS_PARTNER_PUBLIC_BASE_URL ||
    'http://accounts.partner.myloapp.local',
});
