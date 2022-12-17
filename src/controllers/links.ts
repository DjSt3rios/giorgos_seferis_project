import { Request, Response } from 'express';
import { pool } from '../database';
import { LinkModel } from '../models/link.model';
import { OkPacket } from 'mysql';

export const allLinks = async (req: Request, res: Response): Promise<void> => {
    pool.query('SELECT * FROM links', (errorHandler,  rows) => {
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

export const addLink = async (req: Request, res: Response): Promise<void> => {
    const body: LinkModel = req.body;
    pool.query(`INSERT INTO links(link, additional_info) VALUES ("${body.link}", "${body.additional_info}")`, (errorHandler,  packet: OkPacket) => {
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

export const deleteLink = async (req: Request, res: Response): Promise<void> => {
    pool.query(`DELETE FROM links WHERE id=${req.params.id}`, (errorHandler,  packet: OkPacket) => {
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

export const getLink = async (req: Request, res: Response): Promise<void> => {
    pool.query(`SELECT * FROM links WHERE id=${req.params.id}`, (errorHandler,  packet: any[]) => {
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

export const updateLink = async (req: Request, res: Response): Promise<void> => {
    const body: LinkModel = req.body;
    pool.query(`UPDATE links SET link="${body.link}", additional_info="${body.additional_info}" WHERE id=${req.params.id}`, (errorHandler,  packet: OkPacket) => {
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
