import { DataSource } from 'typeorm';
import { Book } from './entities/Book.entity';
import { Link } from './entities/Link.entity';
import { User } from './entities/User.entity';

export const mysqlDt = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "sterios",
    database: "seferis",
    entities: [Book, Link, User],
    logging: true,
    synchronize: false,
})