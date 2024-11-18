import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { settings } from '../../../config/settings';
import { TwilioService } from '../twilio/twilio.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NunjucksUtils } from './template-rendering.utils';

@Injectable()
export class SMSHandlerService {
  private readonly logger = new Logger(SMSHandlerService.name);
  private readonly smsChannel = settings.communicationChannel.sms;
  private readonly templateMapping = {
    consumer: {
      template: 'consumer-onboarding',
      template_id: settings.smsTemplates.consumerOnboardingOtp,
    },
    checkout: {
      template: 'checkout-otp',
      template_id: settings.smsTemplates.checkoutOtp,
    },
    partner: {
      template: 'reset-pass-sms-template',
      template_id: settings.smsTemplates.partnerResetPassword,
    },
  };

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly twilioService: TwilioService,
    private readonly nunjucksUtils: NunjucksUtils,
  ) { }

  async sendSms(
    phoneNumber: string,
    otpCode: string,
    templateType: string,
    additionalParams: Record<string, any> = {},
  ): Promise<void> {
    this.logger.debug(
      `sending sms via channel: ${this.smsChannel} to: ${phoneNumber} with OTP: ${otpCode}`,
    );
    const context = { OTP: otpCode, otp: otpCode, ...additionalParams };
    const strippedPhone = phoneNumber.replace('+20', '0');

    if (settings.app.environment !== 'production' && !settings.app.phoneNumbersSafeList?.includes(strippedPhone)) {
      this.logger.debug(`phone number ${phoneNumber} is not in safe list, no sms is sent`);
      return;
    }
    if (this.smsChannel === 'twilio') {
      await this.sendViaTwilio(phoneNumber, templateType, context);
    } else {
      await this.sendViaGreenService(phoneNumber, templateType, context);
    }
  }

  private async sendViaTwilio(
    phoneNumber: string,
    templateType: string,
    context: Record<string, any>,
  ): Promise<void> {
    const templateDirectory = this.templateMapping[templateType]?.template;
    if (!templateDirectory) {
      this.logger.error(
        `Invalid template_type: ${templateType}, must be one of [consumer, checkout]`,
      );
      throw new Error(
        `Invalid template_type: ${templateType}, must be one of [consumer, checkout]`,
      );
    }

    const templatePath = join(
      __dirname,
      `../../static/templates/${templateType}/${templateDirectory}.template`,
    );
    const templateContent = readFileSync(templatePath, 'utf-8');
    const renderedContent = this.nunjucksUtils.render(templateContent, context);

    if (!renderedContent) {
      this.logger.error('no template content retrieved, no sms is sent');
      throw new Error('no template content retrieved, no sms is sent');
    }

    await this.twilioService.sendSms(phoneNumber, renderedContent);
    this.logger.debug('sms via twilio sent successfully');
  }

  private async sendViaGreenService(
    phoneNumber: string,
    templateType: string,
    context: Record<string, any>,
  ): Promise<void> {
    const templateId = this.templateMapping[templateType]?.template_id;
    if (!templateId) {
      this.logger.error('no template_id retrieved, no sms is sent');
      throw new Error('no template_id retrieved, no sms is sent');
    }

    const sendProvider = phoneNumber.startsWith('+2010')
      ? 'vodafone'
      : 'infobip';

    this.logger.debug(`sendProvider: ${sendProvider}`);
    await this.notificationsService.sendSms(
      templateId,
      phoneNumber,
      sendProvider,
      context,
    );
    this.logger.debug('sms via green_service sent successfully');
  }
}
