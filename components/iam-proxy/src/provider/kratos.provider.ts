import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Configuration, FrontendApi, IdentityApi } from '@ory/client';
import { TenantType } from '../pkg/tenant.type';

export interface KratosSdk {
  frontendApi: FrontendApi;
  identityApi: IdentityApi;
}

@Injectable()
export class KratosProvider {
  private sdkMap = new Map<string, KratosSdk>();

  constructor(private configService: ConfigService) {
    this.sdkMap.set(TenantType.CONSUMER, {
      frontendApi: new FrontendApi(
        new Configuration({
          basePath: configService.get<string>(
            'KRATOS_CONSUMER_PUBLIC_BASE_URL',
          ),
        }),
      ),
      identityApi: new IdentityApi(
        new Configuration({
          basePath: configService.get<string>('KRATOS_CONSUMER_ADMIN_BASE_URL'),
        }),
      ),
    });
    this.sdkMap.set(TenantType.PARTNER, {
      frontendApi: new FrontendApi(
        new Configuration({
          basePath: configService.get<string>('KRATOS_PARTNER_PUBLIC_BASE_URL'),
        }),
      ),
      identityApi: new IdentityApi(
        new Configuration({
          basePath: configService.get<string>('KRATOS_PARTNER_ADMIN_BASE_URL'),
        }),
      ),
    });
  }

  getSdk(tenantType: TenantType): KratosSdk {
    return this.sdkMap.get(tenantType);
  }

  getKratosPublicBaseUrl(tenantType: TenantType): string {
    return this.configService.get<string>(
      `KRATOS_${tenantType.toString()}_PUBLIC_BASE_URL`,
    );
  }
}
