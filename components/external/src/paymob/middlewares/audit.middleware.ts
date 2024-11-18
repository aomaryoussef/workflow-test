import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express'; // Import from express
import { v4 as uuidv4 } from 'uuid'; // For generating UUID
import { PaymobAuditRepository } from '../repository/paymob-audit.repository';
import { PaymobAudit } from '../entities/paymob-audit.entity';
import { RequestContext } from '~/utils/request-context';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(
    private readonly paymobAuditRepository: PaymobAuditRepository,
    private readonly requestContext: RequestContext,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const traceId = this.requestContext.getRequestId(); //Use the RequestContext to get the trace ID
    // Log the request
    const requestLog = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
    };
    // Capture the response body
    const originalSend = res.send.bind(res);
    let responseBody: any;
    res.send = function (body: any) {
      responseBody = body; // Capture the response body
      return originalSend.apply(this, arguments); // Call the original send method
    };

    // Intercept the response
    res.on('finish', async () => {
      const transactionId = req.params.transaction_id || '0';
      // Log the response after it's been sent
      const responseLog = {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
      };

      // Save request and response to the database
      const auditLog = new PaymobAudit();
      auditLog.id = traceId;
      auditLog.transaction_id = transactionId;
      auditLog.request = requestLog;
      auditLog.response = responseLog;
      auditLog.created_at = new Date();

      // Save the log using the repository
      await this.paymobAuditRepository.save(auditLog);
    });

    next(); // Continue to the next middleware or route handler
  }
}
