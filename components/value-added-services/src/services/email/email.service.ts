import { Inject, Injectable, Logger } from '@nestjs/common';
import { SesEmailService } from './amazon-ses.service';
import { settings } from 'config/settings';
import { IEmailService, SendEmailOptions } from './types/email.types';
import { LoggerFactory } from 'src/types/logger.interface';
import { CustomLoggerService } from 'src/common/services/logger.service';

@Injectable()
export class EmailService {
  private readonly emailService: IEmailService;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly sesEmailService: SesEmailService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(EmailService.name);

    const emailProvider = settings.app.emailProvider;
    if (emailProvider === 'ses') {
      this.emailService = this.sesEmailService;
      this.logger.log('Using SES as email provider');
    } else {
      this.logger.log('Email provider not configured');
    }
  }

  async sendEmail<T>(options: SendEmailOptions<T>): Promise<void> {
    try {
      const { bodyText, templateName } = options;

      // Ensure that either bodyText or templateName is provided, but not both
      if (!bodyText && !templateName) {
        throw new Error('Either bodyText or templateName must be provided.');
      }

      return this.emailService.sendEmail(options);
    } catch (error) {
      this.logger.error({ message: 'Error sending email:', error });
    }
  }
}