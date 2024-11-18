import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    OneToMany
} from 'typeorm';
import {settings} from '../../../../config/settings';
import {PaymentConnectorType} from "../types/payment-connector.type";
import {InvoicingTransaction} from "./invoicing-transaction.entity";
import { MerchantPaymentStatusLog } from './merchant-payment-status-log.entity';

@Entity({name: MerchantPayment.TABLE_NAME, schema: settings.database.schema})
export class MerchantPayment{
    static readonly TABLE_NAME : string = "merchant_payment";
    static readonly TRANSACTIONS_JOIN_TABLE_NAME : string = "merchant_payment_invoicing_transactions";

    public constructor(init?:Partial<MerchantPayment>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'bigint', generated: 'increment', name: 'sequence_id'})
    sequenceId: number;

    @Column({type: 'varchar', length: 50, name: 'payment_account_id'})
    paymentAccountId: string;

    @Column({type: 'varchar', length: 50 , name: 'payment_connector_type'})
    paymentConnectorType: PaymentConnectorType;

    @Column({type: 'bigint', name: 'payable_units'})
    payableUnits: number;

    @Column({type: 'varchar', length: 10, name: 'payable_currency'})
    payableCurrency: string;

    @ManyToMany(() => InvoicingTransaction)
    @JoinTable({
        name: MerchantPayment.TRANSACTIONS_JOIN_TABLE_NAME,
        joinColumn: {
            name: 'merchant_payment_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'invoicing_transaction_id',
            referencedColumnName: 'id'
        }
    })
    transactions: InvoicingTransaction[];
  
    @JoinTable()
    @OneToMany(() => MerchantPaymentStatusLog, (update) => update.payment, { eager: false })
    statusLogs: MerchantPaymentStatusLog[];

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
