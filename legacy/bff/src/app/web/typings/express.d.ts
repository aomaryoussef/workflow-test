import { Request } from 'express';
import { Language } from './constants'; // Import your LangType from constants

declare global {
    namespace Express {
        interface Request {
            lang?: Language;
            page?: number;
            perPage?: number;
        }
    }
}