import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { LinkModel } from '../models/link.model';

@Entity()
export class Link implements LinkModel {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ name: 'additional_info' })
    additionalInfo: string;

    @Column()
    link: string;



}