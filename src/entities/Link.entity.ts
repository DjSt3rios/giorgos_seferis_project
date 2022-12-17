import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { LinkCategoryEnum, LinkModel } from '../models/link.model';

@Entity({ name: 'links'})
export class Link implements LinkModel {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ name: 'additional_info' })
    additionalInfo: string;

    @Column()
    link: string;
    @Column()
    category: LinkCategoryEnum;



}