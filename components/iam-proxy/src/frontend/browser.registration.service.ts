import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import logger from '../pkg/logger';
import * as kratos from '../pkg/kratos';
import { KratosProvider } from '../provider/kratos.provider';
import { TENANT_TYPE_HEADER, TenantTypeFromString } from '../pkg/tenant.type';
import { RegistrationFlow } from '@ory/client';
import { UserAuthCard } from '@ory/elements-markup';
import * as axios from 'axios';

@Injectable()
export class BrowserRegistrationService {
  constructor(private kratosProvider: KratosProvider) {}

  /**
   * Initialize the registration flow for browser based frontend.
   * A return_to URL is used to determine which kratos endpoint to redirect to after the flow is complete.
   * If the flowId is not set, it will redirect to kratos to generate a flow.
   * If the flowId is set, it will fetch the flow and render the registration page.
   *
   */
  async initRegistrationFlow(req: Request, res: Response, next: NextFunction) {
    const { flow, return_to, after_verification_return_to, login_challenge } =
      req.query;
    const tenantTypeStr = req.headers[TENANT_TYPE_HEADER] as string;
    const tenantType = TenantTypeFromString(tenantTypeStr);
    const cookie = req.header('Cookie');
    const initFlowQuery: URLSearchParams = new URLSearchParams({
      ...(return_to && { return_to: return_to.toString() }),
      ...(after_verification_return_to && {
        after_verification_return_to: after_verification_return_to.toString(),
      }),
    });
    if (kratos.isQuerySet(login_challenge)) {
      logger.debug('login_challenge found in URL query: ', {
        query: req.query,
      });
      initFlowQuery.append('login_challenge', login_challenge);
    } else {
      logger.debug('no login_challenge found in URL query: ', {
        query: req.query,
      });
    }
    const initFlowUrl = kratos.getSelfServiceUrlForFlow(
      this.kratosProvider.getKratosPublicBaseUrl(tenantType),
      'registration',
      Array.from(initFlowQuery.values()).length > 0 ? initFlowQuery : undefined,
    );

    if (!kratos.isQuerySet(flow)) {
      // Send redirect response
      logger.debug('redirect to registration flow initiate', {
        redirect_url: initFlowUrl,
      });
      res.redirect(303, initFlowUrl);
      return;
    }

    let registrationFlow: RegistrationFlow;
    try {
      const { data } = await this.kratosProvider
        .getSdk(tenantType)
        .frontendApi.getRegistrationFlow({
          id: flow.toString(),
          cookie,
        });
      registrationFlow = data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        kratos.redirectOnSoftError(res, next, initFlowUrl);
      } else {
        logger.error('unable to redirect to registration flow', { error });
        next(error);
      }
    }

    const initLoginQuery = new URLSearchParams({
      return_to:
        (return_to && return_to.toString()) || registrationFlow.return_to || '',
    });
    if (registrationFlow.oauth2_login_request?.challenge) {
      initLoginQuery.set(
        'login_challenge',
        registrationFlow.oauth2_login_request.challenge,
      );
    }

    res.render('registration', {
      nodes: registrationFlow.ui.nodes,
      card: UserAuthCard(
        {
          flow: registrationFlow,
          flowType: 'registration',
          additionalProps: {
            loginURL: kratos.getSelfServiceUrlForFlow(
              this.kratosProvider.getKratosPublicBaseUrl(tenantType),
              'login',
              initLoginQuery,
            ),
          },
        },
        { locale: res.locals.lang },
      ),
      extraContext: res.locals.extraContext,
    });
  }
}
