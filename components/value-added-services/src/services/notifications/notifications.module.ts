import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CommonModule } from 'src/common/common.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [CommonModule, 
        HttpModule
 ],

    providers: [
        NotificationsService
    ],
    exports: [NotificationsService],
})
export class NotificationsModule { }