import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PaymobSessionBasket } from '../../paymob/entities/paymob-session-basket.entity';
import { PaymobAudit } from '~/paymob/entities/paymob-audit.entity';
export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'postgres'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'mylo'),
  entities: [PaymobSessionBasket,PaymobAudit],
  synchronize: true,
});
