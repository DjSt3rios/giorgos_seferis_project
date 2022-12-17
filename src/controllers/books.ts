import { Request, Response } from 'express';
import { BookModel } from '../models/book.model';
import { ControllerRoute, METHOD } from '../routes/routes';
import { mysqlDt } from '../database';
import { Book } from '../entities/Book.entity';
import { authUser } from '../middlewares/auth';

export class BooksController {
    @ControllerRoute({
        method: METHOD.GET,
        path: '/api/books/all',
    }) async getAllBooks(req: Request, res: Response): Promise<void> {
        const books = await mysqlDt.getRepository(Book).find().catch((err) => {
            console.error('get all error:', err);
            return null;
        });
        res.json({ success: !!books, data: books });
    };

    @ControllerRoute({
        method: METHOD.GET,
        path: '/api/books/:id',
    }) async getBook(req: Request, res: Response): Promise<void> {
        const book = await mysqlDt.getRepository(Book).findOne({ where: { id: +req.params.id }}).catch((err) => {
            console.error('get error:', err);
            return null;
        });
        res.json({ success: !!book, data: book });
    };

    @ControllerRoute({
        method: METHOD.POST,
        path: '/api/books/new',
        authMiddleware: authUser,
    }) async createBook(req: Request, res: Response): Promise<void> {
        const bookData: BookModel = req.body;
        const book = await mysqlDt.getRepository(Book).insert(bookData).catch((err) => {
            console.error('Insert error:', err);
            return null;
        });
        res.json({ success: !!book });
    };

    @ControllerRoute({
        method: METHOD.DELETE,
        path: '/api/books/:id',
        authMiddleware: authUser,
    }) async deleteBook(req: Request, res: Response): Promise<void> {
        const book = await mysqlDt.getRepository(Book).delete(req.params.id).catch((err) => {
            console.error('delete error:', err);
            return null;
        });
        res.json({ success: !!book });
    };

    @ControllerRoute({
        method: METHOD.PATCH,
        path: '/api/books/:id',
        authMiddleware: authUser,
    }) async updateBook(req: Request, res: Response): Promise<void> {
        const bookData: BookModel = req.body;
        const book = await mysqlDt.getRepository(Book).update(req.params.id, bookData).catch((err) => {
            console.error('update error:', err);
            return null;
        });
        res.json({ success: !!book });
    };

    @ControllerRoute({
        method: METHOD.POST,
        path: '/api/books/search',
    }) async searchBook(req: Request, res: Response): Promise<void> {
        const bookData: BookModel = req.body;
        const book = await mysqlDt.getRepository(Book).find({ where: bookData }).catch((err) => {
            console.error('search error:', err);
            return null;
        });
        res.json({ success: !!book, data: book });
    };
}