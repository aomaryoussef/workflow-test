import { ResultOfTypeof } from "./types";

export class ConnectionError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);

    // Maintain proper stack trace in case of error in other contexts (like V8 environments)
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidResponseError extends Error {
  constructor(
    message: string,
    public readonly expectedType: ResultOfTypeof | string,
    public readonly receivedType: ResultOfTypeof | string,
    public readonly originalError?: Error
  ) {
    super(message);

    // Maintain proper stack trace in case of error in other contexts (like V8 environments)
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }

  toString(): string {
    return `${this.name}: ${this.message} (Expected: ${this.expectedType}, Received: ${this.receivedType})`;
  }
}
