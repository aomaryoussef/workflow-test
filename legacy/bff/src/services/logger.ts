import winston from "winston";
const { combine, timestamp, json } = winston.format;
import fs from "fs";
import { config } from "../../config";

const LOG_DIR = "logs";

export class CustomLogger {
  private logger: winston.Logger;
  constructor(service: string, context: string = "") {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR);
    }
    this.logger = winston.createLogger({
      defaultMeta: { service: service, context },
      format: combine(timestamp(), json()),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `./${LOG_DIR}/error.log`, level: "error" }),
      ],
    });
    if (config.environment === "development") {
      this.logger.level = "debug";
    } else {
      this.logger.level = "info";
    }
  }
  info(message: string) {
    this.logger.log({ level: "info", message });
  }
  debug(message: string) {
    this.logger.log({ level: "debug", message });
  }
  error(message: string) {
    this.logger.log({ level: "error", message });
  }
}
