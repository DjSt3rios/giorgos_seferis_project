"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBook = exports.getBook = exports.deleteBook = exports.addBook = exports.allBooks = void 0;
const database_1 = require("../database");
const allBooks = async (req, res) => {
    database_1.pool.query('SELECT * FROM books', (errorHandler, rows) => {
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
exports.allBooks = allBooks;
const addBook = async (req, res) => {
    const body = req.body;
    database_1.pool.query(`INSERT INTO books(title, year) VALUES ("${body.title}", ${body.year})`, (errorHandler, packet) => {
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
exports.addBook = addBook;
const deleteBook = async (req, res) => {
    database_1.pool.query(`DELETE FROM books WHERE id=${req.params.id}`, (errorHandler, packet) => {
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
exports.deleteBook = deleteBook;
const getBook = async (req, res) => {
    database_1.pool.query(`SELECT * FROM books WHERE id=${req.params.id}`, (errorHandler, packet) => {
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
exports.getBook = getBook;
const updateBook = async (req, res) => {
    const body = req.body;
    database_1.pool.query(`UPDATE books SET title="${body.title}", year=${body.year} WHERE id=${req.params.id}`, (errorHandler, packet) => {
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
exports.updateBook = updateBook;
//# sourceMappingURL=books.js.map