import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import * as fs from 'fs';
import * as path from 'path';
import { settings } from 'config/settings';
import { EmailTemplate, IEmailService, SendEmailOptions } from './types/email.types';

@Injectable()
export class SesEmailService implements IEmailService {
  private readonly sesClient: SESClient;
  private readonly logger = new Logger(SesEmailService.name);

  constructor() {
    this.sesClient = new SESClient({
      region: settings.ses.region,
      credentials: {
        accessKeyId: settings.ses.accessKeyId,
        secretAccessKey: settings.ses.accessKey,
      },
    });
  }

  private loadTemplate<T>(templateName: EmailTemplate, placeholders: T): string {
    const templatePath = path.join(
      __dirname,
      '../../..', // Navigate to root of vas
      'assets/html/email-templates',
      `${templateName}.html`
    );
    const template = fs.readFileSync(templatePath, 'utf8');
    let populatedTemplate = template;

    for (const [key, value] of Object.entries(placeholders)) {
      const placeholder = `{{.${key}}}`;
      populatedTemplate = populatedTemplate.replace(new RegExp(placeholder, 'g'), value as string);
    }

    return populatedTemplate;
  }

  async sendEmail<T>(options: SendEmailOptions<T>): Promise<void> {
    const { toAddresses, ccAddresses, subject, bodyText, templateName, placeholders } = options;

    let bodyHtml = '';

    if (templateName && placeholders) {
      bodyHtml = this.loadTemplate(templateName, placeholders);
    }

    const params = {
      Destination: {
        ToAddresses: toAddresses,
        ...(ccAddresses && { CcAddresses: ccAddresses }), // Add CC addresses if provided
      },
      Message: {
        Body: {
          Text: { Charset: 'UTF-8', Data: bodyText || '' }, // Plain text email
          ...(bodyHtml && { Html: { Charset: 'UTF-8', Data: bodyHtml } }), // HTML email
        },
        Subject: { Charset: 'UTF-8', Data: subject },
      },
      Source: settings.ses.sourceEmail,
    };

    const command = new SendEmailCommand(params);
    try {
      await this.sesClient.send(command);
      this.logger.log('Email sent successfully via SES');
    } catch (error) {
      this.logger.error({ message: 'Error sending email via SES:', error });
    }
  }
}