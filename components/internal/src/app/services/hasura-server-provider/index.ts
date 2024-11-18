"use server"

import { GraphQLClient } from "@refinedev/hasura";

let clientInstance: GraphQLClient|null = null;

function createClient() {
  if (!clientInstance) {
    clientInstance = new GraphQLClient(process.env.GRAPHQL_ENDPOINT ?? '', {
      headers: {
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET ?? '',
      }
    });
  }
  return clientInstance;
}

export default createClient;
