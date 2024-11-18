import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Governorate } from './governorate.entity';
import { Area } from './area.entity';
import { settings } from '../../../../config/settings';

@Entity({ name: 'cities', schema: settings.database.schema })
export class City {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255, name: 'name_ar' })
    nameAr: string;

    @Column({ type: 'varchar', length: 255, name: 'name_en' })
    nameEn: string;

    @Column({ type: 'int', name: 'mc_id' })
    mcId: number;

    @Column({ type: 'int', name: 'governorate_id' })
    governorateId: number;

    @ManyToOne(() => Governorate, (governorate) => governorate.cities)
    @JoinColumn({ name: 'governorate_id' })
    governorate: Governorate;

    @OneToMany(() => Area, (area) => area.city)
    areas: Area[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
