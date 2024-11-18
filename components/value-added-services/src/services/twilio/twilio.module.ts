import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [CommonModule],

    providers: [
        TwilioService
    ],
    exports: [TwilioService],
})
export class TwilioModule { }