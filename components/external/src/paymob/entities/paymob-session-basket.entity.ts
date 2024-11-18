import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('paymob_session_baskets')
export class PaymobSessionBasket {
  @Column('uuid')
  @PrimaryColumn()
  id: string;

  @Column('bigint', { nullable: true })
  transaction_id: bigint;

  @Column('varchar', { nullable: true,unique:true })
  paymob_transaction_id: string;

  @Column('varchar', { nullable: true })
  merchant_id: string;

  @Column('varchar', { nullable: false })
  terminal_id: number;

  @Column('decimal', { precision: 10, scale: 0, nullable: false })
  product_price: number;

  @Column('decimal', { precision: 10, scale: 0, nullable: true })
  down_payment: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
