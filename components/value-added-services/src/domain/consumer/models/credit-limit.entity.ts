import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { settings } from '../../../../config/settings';

@Entity({ name: 'consumer_credit_limits', schema: settings.database.schema })
export class ConsumerCreditLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false, name: 'consumer_id' })
  consumerId: string;

  @Column({ type: 'int', name: 'max_credit_limit' })
  maxCreditLimit: number;

  @Column({ type: 'int', name: 'available_credit_limit' })
  availableCreditLimit: number;

  @Column({
    type: 'timestamptz', // This is 'TIMESTAMP WITH TIME ZONE'
    precision: 0, // Removes milliseconds
    name: 'active_since',
  })
  activeSince: Date;

  @CreateDateColumn({
    type: 'timestamptz', // This is 'TIMESTAMP WITH TIME ZONE'
    precision: 0, // Removes milliseconds
    name: 'created_at',
  })
  createdAt: Date;
}
