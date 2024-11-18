import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SetLanguageAndPaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const LANGUAGES = {
      EN: 'en',
      AR: 'ar',
    };

    const lang = req.headers['accept-language'];

    // Set language from Accept-Language header or default to 'ar'
    req.lang = lang === LANGUAGES.EN ? LANGUAGES.EN : LANGUAGES.AR;

    // Set pagination details with defaults
    req.page = Number(req.query.page || 1);
    req.limit = Number(
      req.query.limit || req.query.per_page || req.query.perPage || 10,
    );

    return next.handle();
  }
}
