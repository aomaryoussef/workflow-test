import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';
import { settings } from '../../../config/settings';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private client: Twilio | null = null;
  private readonly fromNumbers: string[];
  private readonly flowSid: string;

  constructor() {
    this.fromNumbers = settings.twilio.fromNumbers.split(',');
    this.flowSid = settings.twilio.flowSid;
  }

  private initializeClient(): void {
    if (!this.client) {
      const accountSid = settings.twilio.accountSid;
      const authToken = settings.twilio.authToken;
      try {
        this.client = new Twilio(accountSid, authToken);
      } catch (err) {
        this.logger.error(`Failed to initialize Twilio client: ${err.message}`);
      }
    }
  }

  private parseOtp(parameters: Record<string, any>): Record<string, any> {
    const otpDigits = parameters.otp_digits;
    delete parameters.otp_digits;
    otpDigits.split('').forEach((digit: string, index: number) => {
      parameters[`otp_digits_${index}`] = digit;
    });
    return parameters;
  }

  async triggerVoiceCall(
    otpType: string,
    toPhoneNumber: string,
    otpCode: string,
    payload: Record<string, any> = {},
  ): Promise<boolean> {
    this.initializeClient();
    if (!this.client) {
      this.logger.error('Twilio client is not initialized');
      return false;
    }
    const fromPhoneNumber = `+${this.fromNumbers[Math.floor(Math.random() * this.fromNumbers.length)]}`;
    const parameters = { otp_type: otpType, otp_digits: otpCode, ...payload };

    try {
      const execution = await this.client.studio.v2
        .flows(this.flowSid)
        .executions.create({
          to: toPhoneNumber,
          from: fromPhoneNumber,
          parameters: this.parseOtp(parameters),
        });
      this.logger.debug(
        `Successfully triggered voice call, execution sid: ${execution.sid}`,
      );
      return true;
    } catch (err) {
      this.logger.error(
        `An error occurred triggering Twilio voice call: ${err.message}`,
      );
      throw new Error('Error triggering Twilio voice call');
    }
  }

  async sendSms(
    toPhoneNumber: string,
    templateContent: string,
  ): Promise<boolean> {
    this.initializeClient();
    if (!this.client) {
      this.logger.error('Twilio client is not initialized');
      return false;
    }
    const fromPhoneNumber = `+${this.fromNumbers[Math.floor(Math.random() * this.fromNumbers.length)]}`;

    try {
      const message = await this.client.messages.create({
        to: toPhoneNumber,
        from: fromPhoneNumber,
        body: templateContent,
      });
      this.logger.debug(
        `SMS successfully sent via Twilio, message sid: ${message.sid}`,
      );
      return true;
    } catch (err) {
      this.logger.error(
        `An error occurred triggering Twilio SMS sender: ${err.message}`,
      );
      throw new Error('Error triggering Twilio SMS sender');
    }
  }
}
