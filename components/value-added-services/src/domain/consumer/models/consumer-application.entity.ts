import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ConsumerApplicationState } from './consumer-application-state.entity';
import { settings } from '../../../../config/settings';
import { ConsumerApplicationData } from '../types/consumer-application.types';

@Entity({ name: 'consumer_application', schema: settings.database.schema })
export class ConsumerApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36, name: 'consumer_id' })
  consumerId: string;

  @Column({ type: 'varchar', length: 50, name: 'phone_number_e164' })
  phoneNumber: string;

  @Column({ type: 'json', name: 'data', nullable: true })
  data: ConsumerApplicationData;

  @CreateDateColumn({
    type: 'timestamptz', // This is 'TIMESTAMP WITH TIME ZONE'
    precision: 0, // Removes milliseconds
    name: 'created_at',

  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 100, name: 'created_by' })
  createdBy: string;

  @UpdateDateColumn({
    type: 'timestamptz',
    precision: 0,
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 100, name: 'updated_by', nullable: true })
  updatedBy: string;

  @OneToMany(
    () => ConsumerApplicationState,
    (state) => state.consumerApplication,
  )
  applicationStates: ConsumerApplicationState[];
}
