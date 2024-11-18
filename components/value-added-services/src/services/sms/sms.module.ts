import { Module } from '@nestjs/common';
import { SMSHandlerService } from './sms-handler.service';
import { CommonModule } from 'src/common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TwilioModule } from '../twilio/twilio.module';
import { NunjucksUtils } from './template-rendering.utils';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [CommonModule,
        HttpModule,
        TwilioModule,
        NotificationsModule
    ],

    providers: [
        SMSHandlerService,
        NunjucksUtils
    ],
    exports: [SMSHandlerService],
})
export class SMSModule { }