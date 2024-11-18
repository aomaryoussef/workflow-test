import { ErrorAuthenticatorAssuranceLevelNotSatisfied } from '@ory/client';
import { AxiosError } from 'axios';
import { NextFunction, Response } from 'express';

const isErrorAuthenticatorAssuranceLevel = (
  err: unknown,
): err is ErrorAuthenticatorAssuranceLevelNotSatisfied => {
  return (
    (err as ErrorAuthenticatorAssuranceLevelNotSatisfied).error?.id ==
    'session_aal2_required'
  );
};

export const removeTrailingSlash = (s: string) => s.replace(/\/$/, '');

export const isQuerySet = (x: any): x is string =>
  typeof x === 'string' && x.trim().length > 0;
export const getSelfServiceUrlForFlow = (
  base: string,
  flow: string,
  query?: URLSearchParams,
) =>
  `${removeTrailingSlash(base)}/self-service/${flow}/browser${
    query ? `?${query.toString()}` : ''
  }`;

// Redirects to the specified URL if the error is an AxiosError with a 404, 410,
// or 403 error code.
export const redirectOnSoftError =
  (res: Response, next: NextFunction, redirectTo: string) =>
  (err: AxiosError) => {
    if (!err.response) {
      next(err);
      return;
    }

    if (
      err.response.status === 404 ||
      err.response.status === 410 ||
      err.response.status === 403
    ) {
      // in some cases Kratos will require us to redirect to a different page when the session_aal2_required
      // for example, when recovery redirects us to settings
      // but settings requires us to redirect to login?aal=aal2
      const authenticatorAssuranceLevelError = err.response.data as unknown;
      if (
        isErrorAuthenticatorAssuranceLevel(authenticatorAssuranceLevelError)
      ) {
        res.redirect(
          authenticatorAssuranceLevelError.redirect_browser_to || redirectTo,
        );
        return;
      }
      res.redirect(`${redirectTo}`);
      return;
    }

    next(err);
  };
