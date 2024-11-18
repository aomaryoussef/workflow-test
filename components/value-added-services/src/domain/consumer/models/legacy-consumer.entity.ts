import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ConsumerStatus } from '../types/consumer.types';
import { settings } from '../../../../config/settings';

@Entity({ name: 'consumers', schema: settings.database.schema })
export class LegacyConsumer {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column({ name: 'phone_number', type: 'varchar', length: 20, unique: true })
    @Index()
    phoneNumber: string;

    @Column({ name: 'status', type: 'enum', enum: ConsumerStatus })
    status: ConsumerStatus;

    @Column({ name: 'iam_id', type: 'varchar', nullable: true })
    @Index()
    iamId?: string;

    @Column({ name: 'full_name', type: 'varchar', nullable: true })
    fullName?: string;

    @Column({ name: 'first_name', type: 'varchar', nullable: true })
    firstName?: string;

    @Column({ name: 'last_name', type: 'varchar', nullable: true })
    lastName?: string;

    @Column({ name: 'national_id', type: 'varchar', nullable: true })
    nationalId?: string;

    @Column({ name: 'job_name', type: 'varchar', nullable: true })
    jobName?: string;

    @Column({ name: 'work_type', type: 'varchar', nullable: true })
    workType?: string;

    @Column({ name: 'company', type: 'varchar', nullable: true })
    company?: string;

    @Column({ name: 'club', type: 'varchar', nullable: true })
    club?: string;

    @Column({ name: 'house_type', type: 'varchar', nullable: true })
    houseType?: string;

    @Column({ name: 'city', type: 'varchar', nullable: true })
    city?: string;

    @Column({ name: 'district', type: 'varchar', nullable: true })
    district?: string;

    @Column({ name: 'governorate', type: 'varchar', nullable: true })
    governorate?: string;

    @Column({ name: 'salary', type: 'numeric', nullable: true })
    salary?: number;

    @Column({ name: 'additional_salary', type: 'numeric', nullable: true })
    additionalSalary?: number;

    @Column({ name: 'address_description', type: 'text', nullable: true })
    addressDescription?: string;

    @Column({ name: 'guarantor_job', type: 'varchar', nullable: true })
    guarantorJob?: string;

    @Column({ name: 'guarantor_relationship', type: 'varchar', nullable: true })
    guarantorRelationship?: string;

    @Column({ name: 'car_year', type: 'int', nullable: true })
    carYear?: number;

    @Column({ name: 'marital_status', type: 'varchar', nullable: true })
    maritalStatus?: string;

    @Column({ name: 'address', type: 'text', nullable: true })
    address?: string;

    @Column({ name: 'single_payment_day', type: 'int', default: 1 })
    singlePaymentDay: number;

    @CreateDateColumn({ name: 'activated_at', type: 'timestamp' })
    activatedAt: Date;

    @Column({ name: 'activated_by_iam_id', type: 'varchar', nullable: true })
    activatedByIamId?: string;

    @Column({ name: 'activation_branch', type: 'varchar', nullable: true })
    activationBranch?: string;

    @Column({ name: 'origination_channel', type: 'varchar', default: 'minicash' })
    originationChannel: string;

    @Column({ name: 'classification', type: 'varchar', default: 'NA' })
    classification: string;

    @Column({ name: 'national_id_address', type: 'varchar', nullable: true })
    nationalIdAddress?: string;

    @Column({ name: 'home_phone_number', type: 'varchar', nullable: true })
    homePhoneNumber?: string;

    @Column({ name: 'company_address', type: 'varchar', nullable: true })
    companyAddress?: string;

    @Column({ name: 'work_phone_number', type: 'varchar', nullable: true })
    workPhoneNumber?: string;

    @Column({ name: 'additional_salary_source', type: 'varchar', nullable: true })
    additionalSalarySource?: string;

    @CreateDateColumn({
        type: 'timestamptz', // This is 'TIMESTAMP WITH TIME ZONE'
        precision: 0, // Removes milliseconds
        name: 'created_at',

    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        precision: 0,
        name: 'updated_at',
    })
    updatedAt: Date;
}