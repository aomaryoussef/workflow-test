import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ConsumerApplication } from './consumer-application.entity';
import { settings } from '../../../../config/settings';

@Entity({
  name: 'consumer_application_state',
  schema: settings.database.schema,
})
export class ConsumerApplicationState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'consumer_application_id', nullable: true })
  consumerApplicationId: string;

  @Column({ type: 'varchar', length: 50, name: 'state', nullable: true })
  state: string;

  @Column({
    type: 'timestamptz',
    precision: 0,
    name: 'active_since',
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

  @ManyToOne(() => ConsumerApplication)
  @JoinColumn({ name: 'consumer_application_id', referencedColumnName: 'id', })
  consumerApplication: ConsumerApplication;
}
