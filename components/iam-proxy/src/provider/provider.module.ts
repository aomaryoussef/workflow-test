import { Module } from '@nestjs/common';
import { KratosProvider } from './kratos.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [KratosProvider],
  exports: [KratosProvider],
})
export class ProviderModule {}
