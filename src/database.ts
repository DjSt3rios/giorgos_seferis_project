import * as mysql from 'mysql';
export const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'sterios',
    database: 'seferis'
});