import { Controller, Get, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { BrowserRegistrationService } from './browser.registration.service';
import { BrowserVerificationService } from './browser.verification.service';
import { BrowserLoginService } from './browser.login.service';
import { BrowserErrorService } from './browser.error.service';

@Controller('/idp')
export class FrontendController {
  constructor(
    private browserRegistrationService: BrowserRegistrationService,
    private browserVerificationService: BrowserVerificationService,
    private browserLoginService: BrowserLoginService,
    private browserErrorService: BrowserErrorService,
  ) {}

  @Get('/registration')
  async initSelfServiceRegistrationFlow(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    await this.browserRegistrationService.initRegistrationFlow(req, res, next);
  }

  @Get('/verification')
  async initSelfServiceVerificationFlow(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    await this.browserVerificationService.initVerificationFlow(req, res, next);
  }

  @Get('/login')
  async initLoginFlow(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    await this.browserLoginService.initLoginFlow(req, res, next);
  }

  @Get('/error')
  async renderError(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    await this.browserErrorService.renderErrorView(req, res, next);
  }
}
