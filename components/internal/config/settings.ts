import dotenv from "dotenv";

dotenv.config();

const settings = {
  environment: process.env.OL_BFF_NODE_ENV || "production",
  app: {
    name: "mylo-internal-bff",
    environment: process.env.OL_BFF_NODE_ENV || "production",
  },
  hasura: {
    baseUrl: process.env.OL_BFF_GRAPHQL_URL || ""
  },
  consumerBaseURL:
    process.env.OL_BFF_CONSUMER_SERVICE_BASE_URL ||
    "http://service-department:1337/v1/consumers",
};

export { settings };
