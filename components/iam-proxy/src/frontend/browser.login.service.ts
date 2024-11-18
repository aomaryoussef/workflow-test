import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import logger from '../pkg/logger';
import { KratosProvider } from '../provider/kratos.provider';
import * as kratos from '../pkg/kratos';
import { LoginFlow } from '@ory/client';
import { TENANT_TYPE_HEADER, TenantTypeFromString } from '../pkg/tenant.type';
import * as path from 'path';
import * as axios from 'axios';
import { UserAuthCard } from '@ory/elements-markup';

@Injectable()
export class BrowserLoginService {
  constructor(private kratosProvider: KratosProvider) {}

  async initLoginFlow(req: Request, res: Response, next: NextFunction) {
    const {
      flow,
      aal = '',
      refresh = '',
      return_to = '',
      via = '',
      login_challenge,
    } = req.query;
    const tenantTypeStr = req.headers[TENANT_TYPE_HEADER] as string;
    const tenantType = TenantTypeFromString(tenantTypeStr);
    const cookie = req.header('Cookie');
    const kratosBrowserUrl =
      this.kratosProvider.getKratosPublicBaseUrl(tenantType);
    const initFlowQuery = new URLSearchParams({
      aal: aal.toString(),
      refresh: refresh.toString(),
      return_to: return_to.toString(),
      via: via.toString(),
    });
    if (kratos.isQuerySet(login_challenge)) {
      logger.debug('login_challenge found in URL query: ', {
        login_challenge: login_challenge,
      });
      initFlowQuery.append('login_challenge', login_challenge);
    }

    const initFlowUrl = kratos.getSelfServiceUrlForFlow(
      kratosBrowserUrl,
      'login',
      initFlowQuery,
    );

    // The flow is used to identify the settings and registration flow and
    // return data like the csrf_token and so on.
    if (!kratos.isQuerySet(flow)) {
      logger.debug('no flow id found in url query initializing login flow', {
        redirect_url: initFlowUrl,
      });
      res.redirect(303, initFlowUrl);
      return;
    }

    // It is probably a bit strange to have a logout URL here, however this screen
    // is also used for 2FA flows. If something goes wrong there, we probably want
    // to give the user the option to sign out!
    const getLogoutUrl = async (loginFlow: LoginFlow) => {
      let logoutUrl = '';
      try {
        logoutUrl = await this.kratosProvider
          .getSdk(tenantType)
          .frontendApi.createBrowserLogoutFlow({
            cookie: cookie,
            returnTo:
              (return_to && return_to.toString()) || loginFlow.return_to || '',
          })
          .then(({ data }) => data.logout_url);
        return logoutUrl;
      } catch (err) {
        logger.error('unable to create logout url', { error: err });
      }
    };

    const redirectToVerificationFlow = async (loginFlow: LoginFlow) => {
      // we will create a new verification flow and redirect the user to the verification page
      try {
        const { headers, data: verificationFlow } = await this.kratosProvider
          .getSdk(tenantType)
          .frontendApi.createBrowserVerificationFlow({
            returnTo:
              (return_to && return_to.toString()) || loginFlow.return_to || '',
          });
        res.setHeader('set-cookie', headers['set-cookie']);
        // encode the verification flow id in the query parameters
        const verificationParameters = new URLSearchParams({
          flow: verificationFlow.id,
          message: JSON.stringify(loginFlow.ui.messages),
        });

        const baseUrl = req.path.split('/');
        // get rid of the last part of the path (e.g. "login")
        baseUrl.pop();
        // redirect to the verification page with the custom message
        res.redirect(
          303,
          // join the base url with the verification path
          path.join(
            req.baseUrl,
            'verification?' + verificationParameters.toString(),
          ),
        );
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          kratos.redirectOnSoftError(
            res,
            next,
            kratos.getSelfServiceUrlForFlow(
              kratosBrowserUrl,
              'verification',
              new URLSearchParams({
                return_to:
                  (return_to && return_to.toString()) ||
                  loginFlow.return_to ||
                  '',
              }),
            ),
          );
        } else {
          logger.error('unable to redirect to verification flow', { error });
          next(error);
        }
      }
    };

    let loginFlow: LoginFlow;
    try {
      const { data } = await this.kratosProvider
        .getSdk(tenantType)
        .frontendApi.getLoginFlow({ id: flow, cookie });
      loginFlow = data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        kratos.redirectOnSoftError(res, next, initFlowUrl);
        return;
      } else {
        logger.error('unable to get login flow', { error });
        next(error);
      }
    }

    if (loginFlow.ui.messages && loginFlow.ui.messages.length > 0) {
      // the login requires that the user verifies their email address before logging in
      if (loginFlow.ui.messages.some(({ id }) => id === 4000010)) {
        // we will create a new verification flow and redirect the user to the verification page
        return redirectToVerificationFlow(loginFlow);
      }
    }

    // Render the data using a view:
    const initRegistrationQuery = new URLSearchParams({
      return_to:
        (return_to && return_to.toString()) || loginFlow.return_to || '',
    });
    if (loginFlow.oauth2_login_request?.challenge) {
      initRegistrationQuery.set(
        'login_challenge',
        loginFlow.oauth2_login_request.challenge,
      );
    }

    let initRecoveryUrl = '';
    const initRegistrationUrl = kratos.getSelfServiceUrlForFlow(
      kratosBrowserUrl,
      'registration',
      initRegistrationQuery,
    );
    if (!loginFlow.refresh) {
      initRecoveryUrl = kratos.getSelfServiceUrlForFlow(
        kratosBrowserUrl,
        'recovery',
        new URLSearchParams({
          return_to:
            (return_to && return_to.toString()) || loginFlow.return_to || '',
        }),
      );
    }

    let logoutUrl: string | undefined = '';
    if (loginFlow.requested_aal === 'aal2' || loginFlow.refresh) {
      logoutUrl = await getLogoutUrl(loginFlow);
    }

    res.render('login', {
      nodes: loginFlow.ui.nodes,
      card: UserAuthCard(
        {
          flow: loginFlow,
          flowType: 'login',
          additionalProps: {
            forgotPasswordURL: initRecoveryUrl,
            signupURL: initRegistrationUrl,
            logoutURL: logoutUrl,
          },
        },
        { locale: res.locals.lang },
      ),
      extraContext: res.locals.extraContext,
    });
  }
}
