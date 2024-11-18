import { TestDatabaseModule } from './utils/test-utils';

export default async function globalTeardown() {
  await TestDatabaseModule.close();
}
