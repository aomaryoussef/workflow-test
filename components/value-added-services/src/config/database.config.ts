import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { settings } from '../../config/settings';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: settings.database.host,
  port: settings.database.port,
  username: settings.database.username,
  password: settings.database.password,
  database: settings.database.database,
  schema: settings.database.schema,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};
