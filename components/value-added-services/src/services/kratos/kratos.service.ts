import { Injectable, Logger } from '@nestjs/common';
import {
  IdentityApi,
  Configuration,
  CreateIdentityBody,
  IdentityStateEnum,
  CreateRecoveryCodeForIdentityBody,
} from '@ory/kratos-client';
import { settings } from '../../../config/settings';
import {
  BadRequestError,
  DuplicateError,
  GenericError,
  ServiceUnavailableError,
} from '../../exceptions/custom-exceptions';

export enum KratosIdentitySchema {
  EMAIL = 'email_schema_v0',
  PHONE = 'phone_schema_v0',
}

@Injectable()
export class KratosService {
  private readonly logger = new Logger(KratosService.name);
  private readonly kratosClient: IdentityApi;

  constructor() {
    const kratosConfig = new Configuration({
      basePath: settings.kratosAdminUrl,
    });
    this.kratosClient = new IdentityApi(kratosConfig);
  }

  /**
   * Creates a new identity in the Kratos service.
   *
   * @param kratosSchema - The identity schema (email or phone).
   * @param identifier - The unique identifier (email or phone number).
   * @param useDefaultPassword - Boolean to determine if the default password should be used.
   * @returns The ID of the created identity or null if creation failed.
   */
  async createIdentity(
    kratosSchema: KratosIdentitySchema,
    identifier: string,
    useDefaultPassword = settings.app.useTestData,
  ): Promise<string | null> {
    this.logger.debug(`Creating identity with schema: ${kratosSchema}`);

    const credentials = useDefaultPassword
      ? { password: { config: { password: '123456' } } }
      : {};

    const createIdentityBody: CreateIdentityBody = {
      schema_id: kratosSchema,
      state: IdentityStateEnum.Active,
      traits: {},
      verifiable_addresses: [],
      credentials,
    };

    if (kratosSchema === KratosIdentitySchema.EMAIL) {
      createIdentityBody.traits = {
        email: identifier,
        password_created: false,
      };
      createIdentityBody.verifiable_addresses = [
        {
          value: identifier,
          verified: true,
          via: 'email',
          status: 'completed',
        },
      ];
    } else if (kratosSchema === KratosIdentitySchema.PHONE) {
      const phoneNumber = identifier.startsWith('+2')
        ? identifier
        : '+2' + identifier;
      createIdentityBody.traits = {
        phone: phoneNumber,
        password_created: false,
      };
      createIdentityBody.verifiable_addresses = [
        {
          value: phoneNumber,
          verified: true,
          via: 'sms',
          status: 'completed',
        },
      ];
    }

    this.logger.debug(
      `Identity creation payload: ${JSON.stringify(createIdentityBody)}`,
    );

    try {
      const response = await this.kratosClient.createIdentity({
        createIdentityBody,
      });
      this.logger.log('Identity successfully created', response.data);
      return response.data.id;
    } catch (error) {
      if (error.response?.status === 409) {
        this.logger.error('Identity already exists in Ory: ' + error.message);
        throw new DuplicateError('Kratos Identity already exists');
      } else if (error.response) {
        this.logger.error('Error response received from Kratos API', {
          error: error.response.data,
          statusCode: error.response.status,
        });
        throw new BadRequestError(
          `Error response received from Kratos API: ${error.response.data.message}`,
        );
      } else {
        this.logger.error('Error occurred while creating identity', {
          message: error.message,
        });
        throw new GenericError(
          'Something went wrong while communicating with the Kratos service. Please try again later.',
        );
      }
    }
  }

  /**
   * Creates a recovery code for an identity in the Kratos service.
   *
   * @param identityId - The ID of the identity for which to create the recovery code.
   * @returns The recovery code response and flow_id or null if the operation fails.
   */
  async createRecoveryCode(identityId: string): Promise<any | null> {
    this.logger.debug(`Creating recovery code for identity: ${identityId}`);

    const createRecoveryCodeForIdentityBody: CreateRecoveryCodeForIdentityBody =
      {
        identity_id: identityId,
      };

    try {
      const response = await this.kratosClient.createRecoveryCodeForIdentity({
        createRecoveryCodeForIdentityBody,
      });

      const recoveryLink = response.data.recovery_link;
      let flowId = '';

      if (recoveryLink) {
        const match = recoveryLink.match(/flow=([0-9a-fA-F-]+)/);
        flowId = match ? match[1] : '';
      }

      this.logger.log('Recovery code created successfully');
      return {
        flow_id: flowId,
        recovery_code: response.data.recovery_code,
      };
    } catch (error) {
      this.logger.error('Failed to create recovery code: ' + error.message, {
        error: error.response?.data,
      });
      return null;
    }
  }

  /**
   * Updates the applicationState of an identity in the Kratos service.
   *
   * @param identityId - The ID of the identity to update.
   * @param state - The new applicationState of the identity (e.g., active, inactive).
   * @returns True if the operation was successful, false otherwise.
   */
  async updateIdentity(
    identityId: string,
    state: IdentityStateEnum,
  ): Promise<boolean> {
    this.logger.debug(`Updating state for identity: ${identityId} to ${state}`);

    const jsonPatchDocument = [
      {
        op: 'replace',
        path: '/applicationState',
        value: state,
      },
    ];

    try {
      await this.kratosClient.patchIdentity({
        id: identityId,
        jsonPatch: jsonPatchDocument, // Use the correct property name here
      });
      this.logger.log('Identity applicationState updated successfully');
      return true;
    } catch (error) {
      this.logger.error(
        'Failed to update identity applicationState: ' + error.message,
        {
          error: error.response?.data,
        },
      );
      return false;
    }
  }
  /**
   * Retrieves an identity by its credentials identifier (e.g., email or phone).
   *
   * @param identifier - The phone_number identifier of the identity to fetch.
   * @returns The identity object if found, otherwise null.
   * @throws ServiceUnavailableError if the Kratos service is unavailable.
   */
  async getIdentityByIdentifier(
    identifier: string,
  ): Promise<Record<string, any> | null> {
    this.logger.debug(`Fetching identity by identifier: ${identifier}`);

    try {
      // Fetching identities from Kratos by identifier
      const response = await this.kratosClient.listIdentities({
        credentialsIdentifier: identifier,
      });

      const identities = response.data;

      if (identities.length > 0) {
        const identity = identities[0];
        this.logger.log(`Identity found: ${identity.id}`);
        return identity;
      } else {
        this.logger.error(
          `Failed to get identity for identifier: ${identifier}`,
        );
        return null;
      }
    } catch (error) {
      this.logger.error(`Kratos service is unavailable: ${error.message}`, {
        error: error.response?.data,
      });
      throw new ServiceUnavailableError('Kratos service is unavailable');
    }
  }

  /**
   * Retrieves sessions for an identity using its credentials identifier (e.g., email or phone).
   *
   * @param identifier - The phone_number or email identifier of the identity to fetch sessions for.
   * @returns An array of session objects if found, otherwise null.
   * @throws ServiceUnavailableError if the Kratos service is unavailable.
   */
  async getIdentitySessionsByIdentifier(
    identifier: string,
  ): Promise<any[] | null> {
    this.logger.debug(`Fetching sessions for identifier: ${identifier}`);

    try {
      // Use the existing getIdentityByIdentifier method to fetch the identity
      const identity = await this.getIdentityByIdentifier(identifier);

      if (!identity) {
        this.logger.error(`No identity found for identifier: ${identifier}`);
        return null;
      }

      this.logger.log(`Identity found: ${identity.id}`);

      // Fetch the sessions for the found identity
      const response = await this.kratosClient.listIdentitySessions({
        id: identity.id,
      });

      this.logger.debug(`Sessions response: ${JSON.stringify(response.data)}`);

      const sessions = response.data;

      if (sessions && sessions.length > 0) {
        this.logger.log(
          `Sessions found for identity ${identity.id}: ${sessions.length}`,
        );
        return sessions;
      } else {
        this.logger.error(`No sessions found for identity ID: ${identity.id}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Kratos service is unavailable: ${error.message}`, {
        error: error.response?.data,
      });
      throw new ServiceUnavailableError('Kratos service is unavailable');
    }
  }

  /**
   * Retrieves an identity by its ID from the Kratos service.
   *
   * @param identityId - The ID of the identity to fetch.
   * @returns The identity object if found, otherwise null.
   * @throws ServiceUnavailableError if the Kratos service is unavailable.
   */
  async getIdentity(identityId: string): Promise<Record<string, any> | null> {
    this.logger.debug(`Fetching identity by ID: ${identityId}`);

    try {
      // Fetch the identity from Kratos by ID
      const response = await this.kratosClient.getIdentity({ id: identityId });
      this.logger.log(`Identity retrieved successfully: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get identity: ${error.message}`, {
        error: error.response?.data,
      });
      return null;
    }
  }
  /**
   * Retrieves the flow_id for a specific phone number or email using the getIdentitySessionsByIdentifier method.
   *
   * @param identifier - The phone number or email to search for the identity sessions.
   * @returns The flow_id if found, otherwise null.
   * @throws ServiceUnavailableError if the Kratos service is unavailable.
   */
  async getFlowIdByIdentifier(identifier: string): Promise<string | null> {
    this.logger.debug(`Fetching flow_id for identifier: ${identifier}`);

    try {
      // Use the getIdentitySessionsByIdentifier method to fetch sessions
      const sessions = await this.getIdentitySessionsByIdentifier(identifier);

      if (!sessions || sessions.length === 0) {
        this.logger.error(`No sessions found for identifier: ${identifier}`);
        return null;
      }

      // Extract the flowId from the first session, modify as needed
      const flowId = sessions[0]?.authentication_flow_id || null; // Adjust this based on the actual session structure

      if (!flowId) {
        this.logger.error(
          `No flow_id associated with identifier: ${identifier}`,
        );
        return null;
      }

      this.logger.log(`Flow ID retrieved successfully: ${flowId}`);
      return flowId;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve flow_id for identifier: ${identifier}, ${error.message}`,
        {
          error: error.response?.data,
        },
      );
      throw new ServiceUnavailableError('Kratos service is unavailable');
    }
  }

  /**
   * Extracts the flow_id from identity traits or other relevant data.
   * This is a mock implementation and should be adjusted based on actual logic.
   *
   * @param traits - Traits of the identity, potentially containing flow-related data.
   * @returns The extracted flow_id if present.
   */
  private extractFlowIdFromTraits(traits: Record<string, any>): string | null {
    // TODO: to check if it's the correct field to extract the flow_id
    if (traits && traits.flow_link) {
      const match = traits.flow_link.match(/flow=([0-9a-fA-F-]+)/);
      return match ? match[1] : null;
    }
    return null;
  }
}
