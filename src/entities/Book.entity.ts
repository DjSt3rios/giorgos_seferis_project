import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { BookCategoryEnum, BookModel } from '../models/book.model';

@Entity({ name: 'books' })
export class Book implements BookModel {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    year: number;

    @Column()
    category: BookCategoryEnum;
}