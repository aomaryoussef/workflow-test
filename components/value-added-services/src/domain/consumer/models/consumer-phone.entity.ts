import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { settings } from '../../../../config/settings';

@Entity({ name: 'consumer_phone', schema: settings.database.schema })
export class ConsumerPhone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'consumer_id' })
  consumerId: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'phone_number_e164',
    nullable: false,
  })
  phoneNumberE164: string;

  @Column({ type: 'boolean', name: 'is_primary' })
  isPrimary: boolean;

  @Column({ type: 'boolean', name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamptz', // This is 'TIMESTAMP WITH TIME ZONE'
    precision: 0, // Removes milliseconds
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 100, name: 'created_by' })
  createdBy: string;
}
