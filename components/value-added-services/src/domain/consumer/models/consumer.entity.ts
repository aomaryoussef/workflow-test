import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ConsumerUserDetails } from './consumer-user-details.entity';
import { ConsumerKyc } from './consumer-kyc.entity';
import { ConsumerState } from './consumer-state.entity';
import { ConsumerAddress } from './consumer-address.entity';
import { settings } from '../../../../config/settings';

@Entity({ name: 'new_consumers', schema: settings.database.schema })
export class Consumer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36, name: 'identity_id' })
  identityId: string;

  @Column({
    type: 'varchar',
    length: 14,
    name: 'unique_identifier',
    nullable: true,
  })
  uniqueIdentifier: string;

  @CreateDateColumn({
    type: 'timestamptz', // This is 'TIMESTAMP WITH TIME ZONE'
    precision: 0, // Removes milliseconds
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 100, name: 'created_by' })
  createdBy: string;

  @OneToOne(() => ConsumerKyc, (consumerKyc) => consumerKyc.consumer)
  consumerKyc: ConsumerKyc;

  @OneToOne(
    () => ConsumerAddress,
    (consumerAddress) => consumerAddress.consumer,
  )
  consumerAddress: ConsumerAddress;

  @OneToOne(
    () => ConsumerUserDetails,
    (consumerDetails) => consumerDetails.consumer,
  )
  consumerDetails: ConsumerUserDetails;

  @OneToMany(() => ConsumerState, (state) => state.consumer)
  consumerStates: ConsumerState[];
}
