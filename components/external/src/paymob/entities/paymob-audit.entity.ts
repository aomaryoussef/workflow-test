import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('paymob_audit')
export class PaymobAudit {
  // request id used  identify the transaction
  @Column('string')
  @PrimaryColumn()
  id: string;

  // Foreign key to identify the transaction
  @Column('bigint', { nullable: false })
  transaction_id: string;

  // Capture the full request payload for auditing purposes
  @Column('jsonb', { nullable: false })
  request: object;

  // Capture the full response payload for auditing purposes
  @Column('jsonb', { nullable: false })
  response: object;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
