import {Inject, Injectable} from "@nestjs/common";
import {LoggerFactory} from "../../types/logger.interface";
import {HttpService} from "@nestjs/axios";
import {CustomLoggerService} from "../../common/services/logger.service";
import {settings} from "../../../config/settings";
import {ServiceUnavailableError} from "../../exceptions/custom-exceptions";
import {AxiosResponse} from "axios";
import {firstValueFrom} from "rxjs";
import {MSDynamicsInvoicesRequestDTO, MSDynamicsInvoicesResponseDTO} from "./dto/msdynamics-invoices.dto";

@Injectable()
export class MSDynamicsService{
    private readonly logger: CustomLoggerService;
    private cachedToken: string | null = null;
    private tokenExpiresOn: Date | null = null;
    private readonly activeDirectoryAuthTokenUrl : string =
        `${settings.msDynamics.activeDirectoryBaseUrl}/${settings.msDynamics.activeDirectoryDynamicsTenantId}/oauth2/token`;
    private readonly activeDirectoryDynamicsResourceUrl : string = settings.msDynamics.baseUrl;
    private readonly dynamicsBaseUrl : string = settings.msDynamics.baseUrl;
    private readonly clientId: string  = settings.msDynamics.clientId;
    private readonly grantType: string = 'client_credentials';
    private readonly dynamicsInvoicesUrl: string = '/api/services/BT_Mylo_ServiceGroup/BT_Mylo_CreateMerchantInvoiceService/CreateMerchantInvoice';
    private readonly clientSecret: string = settings.msDynamics.clientSecret;


    constructor(@Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
                private readonly httpService: HttpService){
        this.logger = this.loggerFactory(MSDynamicsService.name);
        this.httpService = httpService;
    }

    /**
     * Authenticates with Active Directory to get a bearer token for MSDynamics and caches it for later
     * @returns {Promise<string>} The bearer token.
     * @throws {ServiceUnavailableError} If authentication fails.
     */
    private async authenticate(): Promise<string> {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        if (this.cachedToken && this.tokenExpiresOn && this.tokenExpiresOn > new Date()) {
            return this.cachedToken;
        }

        const formData = new FormData();
        formData.append('grant_type', this.grantType);
        formData.append('client_id', this.clientId);
        formData.append('client_secret', this.clientSecret);
        formData.append('resource', this.activeDirectoryDynamicsResourceUrl);

        try {
            const response: AxiosResponse = await firstValueFrom(
                this.httpService.get(this.activeDirectoryAuthTokenUrl , {headers, data: formData}),
            );
            this.cachedToken = response.data.access_token
            this.tokenExpiresOn = new Date(response.data.expires_on);
            this.logger.debug(`Token received from Active Directory and it expires on ${this.tokenExpiresOn}`);
            return this.cachedToken;
        } catch (error: any) {
            this.logger.error(`Error fetching access token ${error.message}`);
            throw new ServiceUnavailableError(`Failed to authenticate with MSDynamics ${error.message}`);
        }
    }

    /**
     * Posts invoices to MSDynamics.
     * @param {MSDynamicsInvoicesRequestDTO} dynamicsInvoicesRequestDTO - The request DTO containing invoice data.
     * @returns {Promise<any>} The response from MSDynamics.
     * @throws {ServiceUnavailableError} If posting invoices fails.
     */
    public async postInvoices(dynamicsInvoicesRequestDTO: MSDynamicsInvoicesRequestDTO): Promise<any> {
        const token = await this.authenticate();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
        try {
            this.logger.debug(`Posting invoices to MSDynamics ${JSON.stringify(dynamicsInvoicesRequestDTO)}`);
            const response: AxiosResponse<MSDynamicsInvoicesResponseDTO> = await firstValueFrom(
                this.httpService.post(`${this.dynamicsBaseUrl}/${this.dynamicsInvoicesUrl}`, dynamicsInvoicesRequestDTO, { headers })
            );
            this.logger.debug(`Invoices posted successfully ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error: any) {
            this.logger.error(`Error posting invoices ${error.message}`);
            throw new ServiceUnavailableError(`Failed to post invoices to MSDynamics ${error.message}`);
        }
    }
}