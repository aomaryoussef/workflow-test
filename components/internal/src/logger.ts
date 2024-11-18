import winston from "winston";

const { combine, timestamp, printf } = winston.format;

const format = combine(
  timestamp(),
  winston.format.errors({ stack: true }),
  printf(({ service, context, traceId, level, message, timestamp, ...meta }) => {
    const obj: Record<string, any> = { service, level, message, timestamp };

    if (context !== undefined) obj.context = context;
    if (traceId !== undefined) obj.traceId = traceId;

    for (const key in meta) {
      // Some objects, e.g. errors, when stringified without specifying their property names, they end up `{}`
      if (typeof meta[key] === "object")
        meta[key] = JSON.parse(JSON.stringify(meta[key], Object.getOwnPropertyNames(meta[key])));
    }
    Object.assign(obj, meta);

    return JSON.stringify(obj);
  }),
  winston.format.prettyPrint()
);

export class CustomLogger {
  private static baseLogger = winston.createLogger({
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
    format,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(format, winston.format.colorize({ all: true })),
      }),
    ],
  });

  private logger: winston.Logger;

  constructor({ service, context }: { service: string; context?: string }) {
    this.logger = CustomLogger.baseLogger.child({ service, context });
  }

  get debug() {
    return this.logger.debug.bind(this.logger);
  }

  get info() {
    return this.logger.info.bind(this.logger);
  }

  get warn() {
    return this.logger.warn.bind(this.logger);
  }

  get error() {
    return this.logger.error.bind(this.logger);
  }
}
