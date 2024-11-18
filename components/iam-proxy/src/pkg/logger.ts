import { Logger } from 'tslog';

const logger = new Logger({ name: process.env.APP_NAME || 'iam-proxy' });

export default logger;
