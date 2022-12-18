"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlDt = void 0;
const typeorm_1 = require("typeorm");
const Book_entity_1 = require("./entities/Book.entity");
const Link_entity_1 = require("./entities/Link.entity");
const User_entity_1 = require("./entities/User.entity");
exports.mysqlDt = new typeorm_1.DataSource({
    type: "mysql",
    host: "sql.freedb.tech",
    port: 3306,
    username: "freedb_userg",
    password: "Ya4dPd!Z9bB7jRP",
    database: "freedb_g_seferis",
    entities: [Book_entity_1.Book, Link_entity_1.Link, User_entity_1.User],
    logging: true,
    synchronize: false,
});
//# sourceMappingURL=database.js.map