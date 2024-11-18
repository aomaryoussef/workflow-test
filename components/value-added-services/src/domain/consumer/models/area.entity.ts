import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { City } from './city.entity';
import { Governorate } from './governorate.entity';
import { settings } from '../../../../config/settings';

@Entity({ name: 'areas', schema: settings.database.schema })
export class Area {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255, name: 'name_ar' })
    nameAr: string;

    @Column({ type: 'varchar', length: 255, name: 'name_en' })
    nameEn: string;

    @Column({ type: 'int', name: 'mc_id' })
    mcId: number;

    @Column({ type: 'int', name: 'city_id' })
    cityId: number;

    @Column({ type: 'int', name: 'governorate_id' })
    governorateId: number;

    @ManyToOne(() => City, (city) => city.areas)
    @JoinColumn({ name: 'city_id' })
    city: City;

    @ManyToOne(() => Governorate)
    @JoinColumn({ name: 'governorate_id' })
    governorate: Governorate;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
