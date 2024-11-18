import { Module } from '@nestjs/common';
import { MinicashService } from './minicash.service';
import { CommonModule } from 'src/common/common.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [CommonModule,HttpModule],

    providers: [
        MinicashService
    ],
    exports: [MinicashService],
})
export class MinicashModule { }