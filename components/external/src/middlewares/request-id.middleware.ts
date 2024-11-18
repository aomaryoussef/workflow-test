import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from 'src/utils/request-context';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(
    @Inject(RequestContext) private readonly requestContext: RequestContext,
  ) {}
  use(req: Request, res: Response, next: NextFunction): void {
    const epochTime = Math.floor(Date.now() / 1000); // Get current epoch time in seconds
    //Get request headers x-trace-id if its an array get only the first value and if not get the value
    const traceId =
      (req.headers['x-trace-id'] as string) ||
      `${epochTime}${Math.floor(1000000000 + Math.random() * 9000000000)}`; //trace id used on logging and tracing
    //const requestId = req.headers['x-request-id'] ||  `${epochTime}${Math.floor(1000000000 + Math.random() * 9000000000)}`;//request id or trace id used on logging and tracing
    this.requestContext.setRequestId(traceId);
    next();
  }
}
