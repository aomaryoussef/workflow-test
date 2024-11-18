import { Request } from 'express';

declare module 'express' {
  export interface PaginationRequest {
    lang?: string;
    page?: number;
    limit?: number;
  }
}
