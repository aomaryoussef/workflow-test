import { Pool } from "pg";
import { config } from "../../config";

export const db: Pool = new Pool({
  connectionString: `postgres://${config.databaseUsername}:${config.databasePassword}@${config.databaseHost}:${config.databasePort}/${config.databaseName}?ssl=false&sslmode=disable`,
});
