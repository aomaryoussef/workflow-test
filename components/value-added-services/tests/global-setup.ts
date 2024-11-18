import { TestDatabaseModule } from './utils/test-utils';

export default async function globalSetup() {
  // Set the environment variable
  process.env.NODE_ENV = 'test';

  await TestDatabaseModule.initialize();
}
