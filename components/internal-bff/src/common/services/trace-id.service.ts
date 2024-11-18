import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class TraceIdService {
  constructor(
    private readonly asyncLocalStorage: AsyncLocalStorage<Map<string, string>>,
  ) {}

  // Stores Trace ID in AsyncLocalStorage
  public setTraceId<T>(traceId: string, callback: () => T): T {
    if (!traceId) traceId = this.generateTraceId();
    const store = new Map<string, string>();
    store.set('TRACE_ID', traceId);
    return this.asyncLocalStorage.run(store, callback);
  }

  // Retrieves the current Trace ID from AsyncLocalStorage
  public getTraceId(): string | undefined {
    const store = this.asyncLocalStorage.getStore();
    return store?.get('TRACE_ID');
  }

  public generateTraceId(): string {
    const epochTime = Math.floor(Date.now() / 1000);
    // Get current epoch time in seconds
    const randomNumber = this.generateRandomNumber();
    // Generate a 10-digit random number
    return `${epochTime}${randomNumber}`;
  }

  private generateRandomNumber(): number {
    return Math.floor(1000000000 + Math.random() * 9000000000);
  }
}
