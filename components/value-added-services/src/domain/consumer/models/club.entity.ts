import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { settings } from '../../../../config/settings';


@Entity({ name: 'clubs', schema: settings.database.schema })
export class Club {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255, name: 'name_ar' })
    nameAr: string;

    @Column({ type: 'varchar', length: 255, name: 'name_en' })
    nameEn: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
