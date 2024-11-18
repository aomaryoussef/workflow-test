import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Consumer } from './consumer.entity';
import { settings } from '../../../../config/settings';
import { ConsumerStatus } from '../types/consumer.types';

@Entity({ name: 'consumer_state', schema: settings.database.schema })
export class ConsumerState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'consumer_id', nullable: true })
  consumerId: string;

  @Column({ type: 'varchar', length: 50, name: 'state' })
  state: ConsumerStatus;

  @Column({ name: 'branch', type: 'varchar', nullable: true })
  branch?: string;

  @Column({ name: 'comment', type: 'text', nullable: true })
  comment?: string;

  @Column({
    type: 'timestamptz',
    precision: 0,
    name: 'active_since',
    default: () => 'CURRENT_TIMESTAMP',
  })
  activeSince: Date;

  @CreateDateColumn({
    type: 'timestamptz', // This is 'TIMESTAMP WITH TIME ZONE'
    precision: 0, // Removes milliseconds
    name: 'created_at',

  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 100, name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => Consumer)
  @JoinColumn({ name: 'consumer_id' })
  consumer: Consumer;
}
