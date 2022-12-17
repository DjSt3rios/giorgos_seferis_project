"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = exports.deleteUser = exports.addUser = exports.allUsers = void 0;
const database_1 = require("../database");
const allUsers = async (req, res) => {
    database_1.pool.query('SELECT * FROM users', (errorHandler, rows) => {
        if (errorHandler) {
            return res.json({
                success: false
            });
        }
        return res.json({
            success: true,
            data: rows
        });
    });
};
exports.allUsers = allUsers;
const addUser = async (req, res) => {
    const body = req.body;
    database_1.pool.query(`INSERT INTO users(username, password, is_admin) VALUES ("${body.username}", "${body.password}", ${body.is_admin ? 1 : 0})`, (errorHandler, packet) => {
        if (errorHandler) {
            return res.json({
                success: false
            });
        }
        return res.json({
            success: true,
            id: packet.insertId
        });
    });
};
exports.addUser = addUser;
const deleteUser = async (req, res) => {
    database_1.pool.query(`DELETE FROM users WHERE id=${req.params.id}`, (errorHandler, packet) => {
        if (errorHandler) {
            return res.json({
                success: false
            });
        }
        return res.json({
            success: true,
        });
    });
};
exports.deleteUser = deleteUser;
const getUser = async (req, res) => {
    database_1.pool.query(`SELECT * FROM users WHERE id=${req.params.id}`, (errorHandler, packet) => {
        if (errorHandler) {
            return res.json({
                success: false
            });
        }
        console.log(packet);
        return res.json({
            success: true,
            data: packet[0]
        });
    });
};
exports.getUser = getUser;
const updateUser = async (req, res) => {
    const body = req.body;
    database_1.pool.query(`UPDATE users SET username="${body.username}", password=${body.password}, is_admin=${body.is_admin ? 1 : 0} WHERE id=${req.params.id}`, (errorHandler, packet) => {
        if (errorHandler) {
            console.log(errorHandler);
            return res.json({
                success: false
            });
        }
        return res.json({
            success: true,
        });
    });
};
exports.updateUser = updateUser;
//# sourceMappingURL=user.js.map