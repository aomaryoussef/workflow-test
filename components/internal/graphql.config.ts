import type { IGraphQLConfig } from "graphql-config";
import './envConfig.ts'


const config: IGraphQLConfig = {
  schema: [{
    [process.env.GRAPHQL_ENDPOINT ?? '']: {
      headers: {
        ["x-hasura-admin-secret"]: process.env.HASURA_ADMIN_SECRET ?? ''
      },
    },
  },],
  extensions: {
    codegen: {
      // Optional, you can use this to format your generated files.
      hooks: {
        afterOneFileWrite: ["eslint --fix", "prettier --write"],
      },
      generates: {
        "src/app/[locale]/graphql/schema.types.ts": {
          plugins: ["typescript"],
          config: {
            skipTypename: true,
            enumsAsTypes: true,
          },
        },
        "src/app/[locale]/graphql/types.ts": {
          preset: "import-types",
          documents: ["src/**/*.{ts,tsx}"],
          plugins: ["typescript-operations"],
          config: {
            skipTypename: true,
            enumsAsTypes: true,
            preResolveTypes: false,
            useTypeImports: true,
          },
          presetConfig: {
            typesPath: "./schema.types",
          },
        },
      },
    },
  },
};

export default config;