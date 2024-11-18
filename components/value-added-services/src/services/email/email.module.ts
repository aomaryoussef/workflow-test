import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { EmailService } from './email.service';
import { SesEmailService } from './amazon-ses.service';

@Module({
    imports: [
        CommonModule,
    ],

    providers: [
        EmailService,
        SesEmailService
    ],
    exports: [EmailService],
})
export class EmailModule { }