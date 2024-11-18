import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Consumer } from './consumer.entity';
import { settings } from '../../../../config/settings';
import { Governorate } from './governorate.entity';
import { City } from './city.entity';
import { Area } from './area.entity';

@Entity({ name: 'consumer_address', schema: settings.database.schema })
export class ConsumerAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'consumer_id' })
  consumerId: string;

  @Column({ type: 'varchar', length: 255, name: 'description', nullable: true })
  description: string;

  @Column({ type: 'boolean', name: 'is_primary' })
  isPrimary: boolean;

  @Column({ type: 'boolean', name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'int', name: 'governorate_id', nullable: true })
  governorateId: number;

  @Column({ type: 'int', name: 'city_id', nullable: true })
  cityId: number;

  @Column({ type: 'int', name: 'area_id', nullable: true })
  areaId: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'address_line_1',
    nullable: false,
  })
  addressLine1: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'address_line_2',
    nullable: true,
  })
  addressLine2: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'address_line_3',
    nullable: true,
  })
  addressLine3: string;

  @Column({ type: 'varchar', length: 50, name: 'postcode', nullable: true })
  postcode: string;

  @Column({ type: 'float', name: 'latitude', nullable: true })
  latitude: number;

  @Column({ type: 'float', name: 'longitude', nullable: true })
  longitude: number;

  @CreateDateColumn({
    type: 'timestamptz', // This is 'TIMESTAMP WITH TIME ZONE'
    precision: 0, // Removes milliseconds
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 100, name: 'created_by' })
  createdBy: string;

  @OneToOne(() => Consumer, (consumer) => consumer.consumerAddress)
  @JoinColumn({ name: 'consumer_id' })
  consumer: Consumer;

  @ManyToOne(() => Governorate)
  @JoinColumn({ name: 'governorate_id' })
  governorate: Governorate;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Area)
  @JoinColumn({ name: 'area_id' })
  area: Area;
}
