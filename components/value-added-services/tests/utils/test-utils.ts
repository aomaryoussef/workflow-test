// tests/utils/test-utils.ts

import { TypeOrmModule } from '@nestjs/typeorm';
import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TestingModule, Test } from '@nestjs/testing';

type EntityClass = { new (...args: any[]): any };

export class TestDatabaseModule {
  private static container: StartedPostgreSqlContainer;

  static async initialize() {
    if (!this.container) {
      this.container = await new PostgreSqlContainer('postgres:14.6')
        .withDatabase('testdb')
        .withUsername('testuser')
        .withPassword('testpass')
        .start();
    }
  }

  static async close() {
    if (this.container) {
      await this.container.stop();
      this.container = null;
    }
  }

  static getTypeOrmModule(entities: EntityClass[]) {
    if (!this.container) {
      throw new Error(
        'Test container not initialized. Call initialize() first.',
      );
    }

    return TypeOrmModule.forRoot({
      type: 'postgres',
      host: this.container.getHost(),
      port: this.container.getPort(),
      username: this.container.getUsername(),
      password: this.container.getPassword(),
      database: this.container.getDatabase(),
      entities: entities,
      synchronize: true, // For testing purposes only
    });
  }
}

export async function createTestingModule(
  entities: EntityClass[],
  providers: any[],
) {
  await TestDatabaseModule.initialize();

  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      TestDatabaseModule.getTypeOrmModule(entities),
      TypeOrmModule.forFeature(entities),
    ],
    providers: providers,
  }).compile();

  return moduleRef;
}
