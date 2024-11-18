export enum TenantType {
  CONSUMER = 'CONSUMER',
  PARTNER = 'PARTNER',
  INTERNAL_BACKOFFICE = 'INTERNAL_BACKOFFICE',
}

export const TenantTypeFromString = (tenantType: string): TenantType => {
  switch (tenantType.toUpperCase()) {
    case 'CONSUMER':
      return TenantType.CONSUMER;
    case 'PARTNER':
      return TenantType.PARTNER;
    case 'INTERNAL_BACKOFFICE':
      return TenantType.INTERNAL_BACKOFFICE;
    default:
      throw new Error(`Unknown tenant type: ${tenantType}`);
  }
};

export const TENANT_TYPE_HEADER = 'X-Internal-Tenant-Type';
