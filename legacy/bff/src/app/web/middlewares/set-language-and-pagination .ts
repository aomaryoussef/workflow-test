import { Request, Response, NextFunction } from 'express';
import { LANGUAGES } from '../typings/constants';

export const setLanguageAndPagination = (req: Request, res: Response, next: NextFunction) => {
    const lang = req.header('Accept-Language');
    // Set language from Accept-Language header or default to 'ar'
    req.lang = lang === LANGUAGES.EN ? LANGUAGES.EN : LANGUAGES.AR; // Use constants
    // Set pagination details, with defaults
    req.page = Number(req.query.page || 1) ;
    req.perPage = Number(req.query.per_page ||  req.query.perPage || 10);

    next();
};