import { Request, Response } from 'express';
import { pool } from '../database';
import { OkPacket } from 'mysql';
import { UserModel } from '../models/user.model';

export const allUsers = async (req: Request, res: Response): Promise<void> => {
    pool.query('SELECT * FROM users', (errorHandler,  rows) => {
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

export const addUser = async (req: Request, res: Response): Promise<void> => {
    const body: UserModel = req.body;
    pool.query(`INSERT INTO users(username, password, is_admin) VALUES ("${body.username}", "${body.password}", ${body.is_admin ? 1 : 0})`, (errorHandler,  packet: OkPacket) => {
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

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    pool.query(`DELETE FROM users WHERE id=${req.params.id}`, (errorHandler,  packet: OkPacket) => {
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

export const getUser = async (req: Request, res: Response): Promise<void> => {
    pool.query(`SELECT * FROM users WHERE id=${req.params.id}`, (errorHandler,  packet: any[]) => {
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

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const body: UserModel = req.body;
    pool.query(`UPDATE users SET username="${body.username}", password=${body.password}, is_admin=${body.is_admin ? 1 : 0} WHERE id=${req.params.id}`, (errorHandler,  packet: OkPacket) => {
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