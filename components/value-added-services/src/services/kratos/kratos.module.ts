import { Module } from '@nestjs/common';
import { KratosService } from './kratos.service';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [CommonModule],
    providers: [
        KratosService
    ],
    exports: [KratosService],
})
export class KratosModule { }