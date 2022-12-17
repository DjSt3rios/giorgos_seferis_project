import { Request, Response } from 'express';
import { pool } from '../database';
import { OkPacket } from 'mysql';
import { BookModel } from '../models/book.model';

export const allBooks = async (req: Request, res: Response): Promise<void> => {
    pool.query('SELECT * FROM books', (errorHandler,  rows) => {
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

export const addBook = async (req: Request, res: Response): Promise<void> => {
    const body: BookModel = req.body;
    pool.query(`INSERT INTO books(title, year) VALUES ("${body.title}", ${body.year})`, (errorHandler,  packet: OkPacket) => {
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

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    pool.query(`DELETE FROM books WHERE id=${req.params.id}`, (errorHandler,  packet: OkPacket) => {
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

export const getBook = async (req: Request, res: Response): Promise<void> => {
    pool.query(`SELECT * FROM books WHERE id=${req.params.id}`, (errorHandler,  packet: any[]) => {
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

export const updateBook = async (req: Request, res: Response): Promise<void> => {
    const body: BookModel = req.body;
    pool.query(`UPDATE books SET title="${body.title}", year=${body.year} WHERE id=${req.params.id}`, (errorHandler,  packet: OkPacket) => {
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