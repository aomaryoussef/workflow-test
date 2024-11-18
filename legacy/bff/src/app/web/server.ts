import express, { Express } from "express";
import { rateLimit } from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";
import expressLayouts from "express-ejs-layouts";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import cookies from "cookie-parser";
import path from "path";
import morgan from "morgan";
import { errorHandler } from "./error-handler";
import { config } from "../../../config";
import { privateSessionBasketRouter } from "./session-baskets/private-routes";
import { privatePartnerRouter } from "./partner/private-routes";
import { publicPartnerRouter } from "./partner/public-routes";
import { privateConsumerRouter } from "./consumer/private-routes";
import { publicConsumerRouter } from "./consumer/public-routes";
import { staticRouter } from "./static/routes";
import { version } from "../../../package.json";
import { publicSharedComponentsRouter } from "./shared/public-routes";
import { privateBackOfficeRouter } from "./back-office/private-routes";
import { publicBackOfficeRouter } from "./back-office/public-routes";
import { privatePartnerApiRouter } from "./partner/private-api-routes";
import { publicRegistryRouter } from "./registry/public-routes";
import { CustomLogger } from "../../services/logger";
import { httpRequestLogger } from "./middlewares/http-request-logger";
import { publicLookupApiRouter } from "./shared/public-api-routes";
import traceId from "../../middlewares/tracing";
const logger = new CustomLogger("server");

const app: Express = express();

app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000, // Limit each IP to 1000 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }),
);
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(cookies());
app.use(traceId);
app.use(morgan(httpRequestLogger));
try {
  const file = fs.readFileSync(path.resolve(__dirname.replace("/build", ""), "./api.yaml"), "utf8");
  const swaggerDocument = YAML.parse(file);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.error("Failed to load swagger documentation with error ", e);
}

app.use(expressLayouts);
app.set("layout", "layout/internal-screens");
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "shared", "views"),
  path.join(__dirname, "partner", "views"),
  path.join(__dirname, "back-office", "views"),
]);

app.use("/private/api/session-basket", privateSessionBasketRouter);
app.use("/private/partner", privatePartnerRouter);
app.use("/public/partner", publicPartnerRouter);
app.use("/private/api/partner", privatePartnerApiRouter);
app.use("/private/api/consumers", privateConsumerRouter);
app.use("/public/api/consumers", publicConsumerRouter);
app.use("/private/back-office", privateBackOfficeRouter);
app.use("/public/back-office", publicBackOfficeRouter);
app.use("/public/shared", publicSharedComponentsRouter);
app.use("/public/api/lookups", publicLookupApiRouter);
app.use("/public/registry", publicRegistryRouter);
app.use("/static", staticRouter);
app.get("/", (_req, res) => {
  res.send(config.appName);
});
app.get("/info", (_req, res) => {
  logger.info("server is running");
  logger.debug(`server is running on port ${config.port}`);
  res.json({ app: config.appName, version: version, environment: config.environment });
});

app.get("/version", (_req, res) => {
  res.json({ version });
});

app.use(errorHandler);

export default app;
