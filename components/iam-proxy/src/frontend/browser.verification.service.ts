import { Injectable } from '@nestjs/common';
import logger from '../pkg/logger';
import * as kratos from '../pkg/kratos';
import { KratosProvider } from '../provider/kratos.provider';
import { TENANT_TYPE_HEADER, TenantTypeFromString } from '../pkg/tenant.type';
import { NextFunction, Request, Response } from 'express';
import { UiText, VerificationFlow } from '@ory/client';
import * as axios from 'axios';
import { UserAuthCard } from '@ory/elements-markup';

@Injectable()
export class BrowserVerificationService {
  constructor(private kratosProvider: KratosProvider) {}

  async initVerificationFlow(req: Request, res: Response, next: NextFunction) {
    const { flow, return_to = '', message } = req.query;
    const tenantTypeStr = req.headers[TENANT_TYPE_HEADER] as string;
    const tenantType = TenantTypeFromString(tenantTypeStr);
    const cookie = req.header('Cookie');

    const initFlowUrl = kratos.getSelfServiceUrlForFlow(
      this.kratosProvider.getKratosPublicBaseUrl(tenantType),
      'verification',
      new URLSearchParams({ return_to: return_to.toString() }),
    );
    // The flow is used to identify the settings and registration flow and
    // return data like the csrf_token and so on.
    if (!kratos.isQuerySet(flow)) {
      logger.debug(
        'no flow id found in url query initializing verification flow',
        {
          query: req.query,
        },
      );
      res.redirect(303, initFlowUrl);
      return;
    }

    let verificationFlow: VerificationFlow;
    try {
      const { data } = await this.kratosProvider
        .getSdk(tenantType)
        .frontendApi.getVerificationFlow({ id: flow, cookie });
      verificationFlow = data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        kratos.redirectOnSoftError(res, next, initFlowUrl);
      } else {
        logger.error('unable to redirect to verification flow', { error });
        next(error);
      }
    }

    const initRegistrationUrl = kratos.getSelfServiceUrlForFlow(
      this.kratosProvider.getKratosPublicBaseUrl(tenantType),
      'registration',
      new URLSearchParams({
        return_to:
          (return_to && return_to.toString()) ||
          verificationFlow.return_to ||
          '',
      }),
    );

    // check for custom messages in the query string
    if (kratos.isQuerySet(message)) {
      const m: UiText[] = JSON.parse(message);

      // add them to the flow data so they can be rendered by the UI
      verificationFlow.ui.messages = [
        ...(verificationFlow.ui.messages || []),
        ...m,
      ];
    }

    // Render the data using a view (e.g. Jade Template):
    res.render('verification', {
      card: UserAuthCard(
        {
          flow: verificationFlow,
          flowType: 'verification',
          additionalProps: {
            signupURL: initRegistrationUrl,
          },
        },
        { locale: res.locals.lang },
      ),
    });
  }
}
