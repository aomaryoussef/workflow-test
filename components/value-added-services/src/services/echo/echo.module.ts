import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { EchoService } from './echo.service';

@Module({
    imports: [CommonModule],
    providers: [
        EchoService
    ],
    exports: [EchoService],
})
export class EchoModule { }