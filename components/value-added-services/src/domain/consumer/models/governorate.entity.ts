import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { City } from './city.entity';
import { Area } from './area.entity';
import { settings } from '../../../../config/settings';

@Entity({ name: 'governorates', schema: settings.database.schema })
export class Governorate {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255, name: 'name_ar' })
    nameAr: string;

    @Column({ type: 'varchar', length: 255, name: 'name_en' })
    nameEn: string;

    @Column({ type: 'int', name: 'mc_id' })
    mcId: number;

    @OneToMany(() => City, (city) => city.governorate)
    cities: City[];

    @OneToMany(() => Area, (area) => area.governorate)
    areas: Area[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
