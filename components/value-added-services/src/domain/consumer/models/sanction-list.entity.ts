import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { SanctionType } from '../types/sanction-list.types';
import { settings } from '../../../../config/settings';

@Entity({ name: 'sanction_list', schema: settings.database.schema })
export class SanctionList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'original_name' })
    originalName: string;

    @Column({ name: 'searchable_text' })
    searchableText: string;

    @Column({ nullable: true, name: "national_id" })
    nationalId: string;

    @Column({
        type: 'enum',
        name: 'sanction_type',
        enum: SanctionType, // Use the enum type here
        nullable: false,
    })
    sanctionType: SanctionType; // New field to store the type of sanction list
}