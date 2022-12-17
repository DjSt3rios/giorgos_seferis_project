import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { BookModel } from '../models/book.model';

@Entity({ name: 'books' })
export class Book implements BookModel {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    year: number;

}