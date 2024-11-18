import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import {settings} from '../../../../config/settings';
import {PaymentConnectorType} from "../types/payment-connector.type";

@Entity({name: InvoicingTransaction.TABLE_NAME, schema: settings.database.schema})
export class InvoicingTransaction {
    static readonly TABLE_NAME: string = "invoicing_transaction";

    public constructor(init?:Partial<InvoicingTransaction>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 50, name: 'reference_id'})
    referenceId: string;

    @Column({type: 'varchar', length: 50, name: 'payment_account_id'})
    paymentAccountId: string;

    @Column({type: 'varchar', length: 50 , name: 'payment_connector_type'})
    paymentConnectorType: PaymentConnectorType;

    @Column({type: 'bigint', name: 'payable_units'})
    payableUnits: number;

    @Column({type: 'varchar', length: 10, name: 'payable_currency'})
    payableCurrency: string;

    @Column({type: 'varchar', length: 150, name: 'narration_comment'})
    narrationComment: string;

    @Column({type: 'timestamptz', precision: 0, name: 'transaction_date'})
    transactionDate: Date;

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
