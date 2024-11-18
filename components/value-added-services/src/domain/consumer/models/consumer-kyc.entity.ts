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

@Entity({ name: 'consumer_kyc', schema: settings.database.schema })
export class ConsumerKyc {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'consumer_id' })
  consumerId: string;

  @Column({ type: 'varchar', length: 100, name: 'job_title', nullable: true })
  jobTitle: string;

  @Column({ name: 'single_payment_day', type: 'int', default: 1 })
  singlePaymentDay: number;

  @Column({ type: 'varchar', length: 100, name: 'work_type', nullable: true })
  workType: string;

  @Column({ name: 'national_id', type: 'varchar', length: 20 })
  nationalId: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'company_name',
    nullable: true,
  })
  companyName: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'other_company_name',
    nullable: true,
  })
  otherCompanyName: string;

  @Column({ type: 'varchar', length: 50, name: 'job_level', nullable: true })
  jobLevel: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'education_level',
    nullable: true,
  })
  educationLevel: string;

  @Column({ type: 'int', name: 'primary_income', nullable: true })
  primaryIncome: number;

  @Column({ type: 'int', name: 'additional_income', nullable: true })
  additionalIncome: number;

  @Column({ type: 'varchar', length: 50, name: 'car_model', nullable: true })
  carModel: string;

  @Column({ type: 'int', name: 'car_year', nullable: true })
  carYear: number;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'marital_status',
    nullable: true,
  })
  maritalStatus: string;

  @Column({ type: 'varchar', length: 50, name: 'house_level', nullable: true })
  houseLevel: string;

  @Column({ type: 'json', name: 'club', nullable: true })
  club: any;

  @Column({ type: 'json', name: 'dependants', nullable: true })
  dependants: any;

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

  @UpdateDateColumn({
    type: 'timestamptz',
    precision: 0,
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 100, name: 'updated_by', nullable: true })
  updatedBy: string;

  @OneToOne(() => Consumer, consumer => consumer.consumerKyc)
  @JoinColumn({ name: 'consumer_id' })
  consumer: Consumer;
}
