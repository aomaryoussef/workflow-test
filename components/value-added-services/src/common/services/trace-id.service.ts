import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TraceIdService {
    constructor(private readonly asyncLocalStorage: AsyncLocalStorage<Map<string, string>>) { }
    // Stores Trace ID in AsyncLocalStorage
    public setTraceId<T>(traceId: string, callback: () => T): T {
        if (!traceId) traceId = uuidv4()
        const store = new Map<string, string>();
        store.set('TRACE_ID', traceId);
        return this.asyncLocalStorage.run(store, callback);
    }

    // Retrieves the current Trace ID from AsyncLocalStorage
    public getTraceId(): string | undefined {
        const store = this.asyncLocalStorage.getStore();
        return store?.get('TRACE_ID');
    }
}