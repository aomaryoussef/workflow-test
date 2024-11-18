import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import {settings} from '../../../../config/settings';
import { MerchantPayment } from './merchant-payment.entity';

@Entity({name: MerchantPaymentStatusLog.TABLE_NAME, schema: settings.database.schema})
export class MerchantPaymentStatusLog {
    static readonly TABLE_NAME: string = "merchant_payment_status_logs";

    public constructor(init?:Partial<MerchantPaymentStatusLog>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', name: 'payment_id'})
    paymentId: string;
    
    @ManyToOne(() => MerchantPayment, (payment) => payment.statusLogs, { eager: false })
    @JoinColumn({ name: "payment_id"})
    payment: MerchantPayment;
    
    @Column({type: 'varchar', length: 50, name: 'status'})
    status: string;

    @Column({type: 'timestamptz', precision: 0, name: 'status_date'})
    statusDate: Date;

    @CreateDateColumn({
        type: 'timestamptz', // This is 'TIMESTAMP WITH TIME ZONE'
        precision: 0, // Removes milliseconds
        name: 'created_at',
    })
    createdAt: Date;


    @UpdateDateColumn({
        type: 'timestamptz', // This is 'TIMESTAMP WITH TIME ZONE'
        precision: 0, // Removes milliseconds
        name: 'updated_at',
    })
    updatedAt: Date;
}
