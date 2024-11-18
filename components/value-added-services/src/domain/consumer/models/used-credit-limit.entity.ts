import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { settings } from '../../../../config/settings';

@Entity({
  name: 'consumer_used_credit_limits',
  schema: settings.database.schema,
})
export class UsedConsumerCreditLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'consumer_id' })
  consumerId: string;

  @Column({ type: 'int', name: 'used_credit' })
  usedCredit: number;

  @CreateDateColumn({
    type: 'timestamptz', // This is 'TIMESTAMP WITH TIME ZONE'
    precision: 0, // Removes milliseconds
    name: 'created_at',
  })
  createdAt: Date;
}
