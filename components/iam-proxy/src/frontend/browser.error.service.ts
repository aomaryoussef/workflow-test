import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { KratosProvider } from '../provider/kratos.provider';
import * as kratos from '../pkg/kratos';
import { FlowError, GenericError } from '@ory/client';
import { TENANT_TYPE_HEADER, TenantTypeFromString } from '../pkg/tenant.type';
import * as axios from 'axios';
import { UserErrorCard } from '@ory/elements-markup';

type OAuth2Error = {
  error: string;
  error_description?: string;
  error_hint?: string;
};

@Injectable()
export class BrowserErrorService {
  constructor(private kratosProvider: KratosProvider) {}

  private isOAuth2Error(query: qs.ParsedQs): query is OAuth2Error {
    return query.error !== undefined;
  }

  async renderErrorView(req: Request, res: Response, next: NextFunction) {
    const { query } = req;
    const tenantTypeStr = req.headers[TENANT_TYPE_HEADER] as string;
    const tenantType = TenantTypeFromString(tenantTypeStr);
    const errNoErrorFound = new Error('no error found');

    // If the error is an OAuth2 error, its details are encoded into the URL.
    // We can simply decode them and return them here.
    if (this.isOAuth2Error(query)) {
      return {
        id: decodeURIComponent(query.error.toString()),
        error: {
          status: 'OAuth2 Error',
          id: decodeURIComponent(query.error.toString()),
          message: decodeURIComponent(
            query.error_description?.toString() || 'No description provided',
          ),
          ...(query.error_hint
            ? { hint: decodeURIComponent(query.error_hint.toString()) }
            : {}),
          code: 599, // Dummy code to trigger the full error screen
        },
      };
    } else if (kratos.isQuerySet(query.id)) {
      // If the error comes from Ory Identities/Kratos, we need to fetch its details from the backend.
      // Once that's done, we can return the error.
      try {
        const getFlowErrorResponse = await this.kratosProvider
          .getSdk(tenantType)
          .frontendApi.getFlowError({ id: query.id });
        if (getFlowErrorResponse.status !== 200) {
          next(errNoErrorFound);
          return;
        }

        res.status(200).render('error', {
          card: UserErrorCard({
            error: getFlowErrorResponse.data,
            backUrl: req.header('Referer') || 'welcome',
          }),
        });
        return;
      } catch (err: any) {
        let error: FlowError;
        if (axios.isAxiosError(err)) {
          error = err.response?.data.error;
        } else {
          error = {
            id: 'failed to fetch error details',
            error: err as GenericError,
          };
        }

        res.status(200).render('error', {
          card: UserErrorCard({
            error: {
              id: 'failed to fetch error details',
              error: {
                ...error,
                code: 500,
              },
            },
            title: 'An error occurred',
            backUrl: req.header('Referer') || 'welcome',
          }),
        });

        return;
      }
    }
  }
}
