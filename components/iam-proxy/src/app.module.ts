import { Module } from '@nestjs/common';
import { FrontendModule } from './frontend/frontend.module';
import { ConfigModule } from '@nestjs/config';
import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [ConfigModule.forRoot({}), FrontendModule, ProviderModule],
})
export class AppModule {}
