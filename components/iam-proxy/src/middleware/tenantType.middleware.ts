import { TENANT_TYPE_HEADER, TenantType } from '../pkg/tenant.type';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const ensureValueIsString = (value: any): string => {
  return typeof value === 'string' ? value.trim() : '';
};

const determineTenantType = (host: string): TenantType => {
  if (host.includes(TenantType.CONSUMER.toLowerCase())) {
    return TenantType.CONSUMER;
  }
  if (host.includes(TenantType.PARTNER.toLowerCase())) {
    return TenantType.PARTNER;
  }
  if (host.includes(TenantType.INTERNAL_BACKOFFICE.toLowerCase())) {
    return TenantType.INTERNAL_BACKOFFICE;
  }
  throw Error('Invalid tenant type');
};

@Injectable()
export class TenantTypeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { host } = req.headers;
    const hostStr = ensureValueIsString(host);
    if (hostStr.length !== 0) {
      req.headers[TENANT_TYPE_HEADER] = determineTenantType(hostStr).toString();
      next();
    } else {
      next();
    }
  }
}
