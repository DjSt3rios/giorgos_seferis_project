import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { UserModel } from '../models/user.model';

@Entity()
export class User implements UserModel {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column({ name: 'is_admin' })
    isAdmin: boolean;
}