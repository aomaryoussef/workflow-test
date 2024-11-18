import {Module} from '@nestjs/common';
import {CommonModule} from 'src/common/common.module';
import {HttpModule} from '@nestjs/axios';
import {MSDynamicsService} from "./msdynamics.service";

@Module({
    imports: [CommonModule, HttpModule],

    providers: [
        MSDynamicsService,
    ],
    exports: [MSDynamicsService],
})
export class MSDynamicsModule {
}