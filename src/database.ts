import { DataSource } from 'typeorm';
import { Book } from './entities/Book.entity';
import { Link } from './entities/Link.entity';
import { User } from './entities/User.entity';

export const mysqlDt = new DataSource({
    type: "mysql",
    host: "sql.freedb.tech",
    port: 3306,
    username: "freedb_userg",
    password: "Ya4dPd!Z9bB7jRP",
    database: "freedb_g_seferis",
    entities: [Book, Link, User],
    logging: true,
    synchronize: false,
})