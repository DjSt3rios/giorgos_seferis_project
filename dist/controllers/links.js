"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLink = exports.getLink = exports.deleteLink = exports.addLink = exports.allLinks = void 0;
const database_1 = require("../database");
const allLinks = async (req, res) => {
    database_1.pool.query('SELECT * FROM links', (errorHandler, rows) => {
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
exports.allLinks = allLinks;
const addLink = async (req, res) => {
    const body = req.body;
    database_1.pool.query(`INSERT INTO links(link, additional_info) VALUES ("${body.link}", "${body.additional_info}")`, (errorHandler, packet) => {
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
exports.addLink = addLink;
const deleteLink = async (req, res) => {
    database_1.pool.query(`DELETE FROM links WHERE id=${req.params.id}`, (errorHandler, packet) => {
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
exports.deleteLink = deleteLink;
const getLink = async (req, res) => {
    database_1.pool.query(`SELECT * FROM links WHERE id=${req.params.id}`, (errorHandler, packet) => {
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
exports.getLink = getLink;
const updateLink = async (req, res) => {
    const body = req.body;
    database_1.pool.query(`UPDATE links SET link="${body.link}", additional_info="${body.additional_info}" WHERE id=${req.params.id}`, (errorHandler, packet) => {
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
exports.updateLink = updateLink;
//# sourceMappingURL=links.js.map