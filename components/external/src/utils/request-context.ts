import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContext {
  private requestId: string;

  setRequestId(requestId: string) {
    this.requestId = requestId;
  }

  getRequestId(): string {
    return this.requestId;
  }
}
