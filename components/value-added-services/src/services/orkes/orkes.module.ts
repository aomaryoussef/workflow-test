import { Module } from '@nestjs/common';
import { orkesConductorClient } from '@io-orkes/conductor-javascript';
import { OrkesService } from './orkes.service';
import { settings } from 'config/settings';
import { CommonModule } from '../../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [
        {
            provide: 'ORKES_CLIENT',
            useFactory: async () => {
                return await orkesConductorClient({
                    serverUrl: `${settings.conductor.baseUrl}/api`, // Conductor server URL
                    
                });
            },
        },
        OrkesService, // OrkesService instead of WorkflowService
    ],
    exports: ['ORKES_CLIENT', OrkesService], // Export OrkesService
})
export class OrkesModule { }