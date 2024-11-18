import axios, { AxiosInstance } from 'axios';
import { CreateConsumerIdentityInput, CreateConsumerIdentityOutput } from '../[locale]/(consumer)/domain/types/consumer-identity';
import { UpdateConsumerOnboardingStatusInput, UpdateConsumerOnboardingStatusOutput } from '../[locale]/(consumer)/domain/types/onboarding-status';
import { CreateConsumerApplicationInput, CreateConsumerApplicationOutput } from '../[locale]/(consumer)/domain/types/consumer-application';

export class ValueAddedServicesClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: 'https://value-mylo-test.myloapp.com/api',
        });
    }

    public async createConsumerIdentity(payload: CreateConsumerIdentityInput): Promise<CreateConsumerIdentityOutput>  {
        return this.client.post<CreateConsumerIdentityInput, CreateConsumerIdentityOutput>('/consumers/onboarding', payload);
    }

    public async updateConsumerOnboardingStatus(payload: UpdateConsumerOnboardingStatusInput): Promise<UpdateConsumerOnboardingStatusOutput> {
        return { success: true }
     //   return this.client.post<UpdateConsumerOnboardingStatusInput, UpdateConsumerOnboardingStatusOutput>('/value-added-data', payload);

    }

    public async createConsumerApplication(payload: CreateConsumerApplicationInput): Promise<CreateConsumerApplicationOutput> {
        return { success:true }
        //return this.client.post<CreateConsumerApplicationInput, CreateConsumerApplicationOutput>('/value-added-data', payload);

    }

}

export default ValueAddedServicesClient;