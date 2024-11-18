// src/common/decorators/trace-id.decorator.ts

export function WithTraceId() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Log the context to ensure `this` has `traceIdService`
      const traceIdService = this.traceIdService;
      if (!traceIdService || typeof traceIdService.setTraceId !== 'function') {
        throw new Error('traceIdService.storeTraceId is not a function');
      }

      const traceId =
        args[0]?.inputData?.traceId || args[0]?.inputData?.correlationId;

      return traceIdService.setTraceId(traceId, async () => {
        return await originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}
