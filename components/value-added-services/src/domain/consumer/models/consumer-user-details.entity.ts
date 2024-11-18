import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Consumer } from './consumer.entity';
import { settings } from '../../../../config/settings';

@Entity({ name: 'consumer_user_details', schema: settings.database.schema })
export class ConsumerUserDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'consumer_id' })
  consumerId: string;

  @Column({ type: 'varchar', length: 50, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 50, name: 'middle_name', nullable: true })
  middleName: string;

  @Column({ type: 'varchar', length: 50, name: 'last_name', nullable: true })
  lastName: string;

  @Column({ name: 'national_id', type: 'varchar', length: 20 })
  nationalId: string;

  @Column({ type: 'date', name: 'date_of_birth', nullable: true })
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'city_of_birth',
    nullable: true,
  })
  cityOfBirth: string;

  @Column({ type: 'varchar', length: 50, name: 'nationality', nullable: true })
  nationality: string;

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

  @OneToOne(() => Consumer, (consumer) => consumer.consumerDetails)
  @JoinColumn({ name: 'consumer_id' })
  consumer: Consumer;
}
