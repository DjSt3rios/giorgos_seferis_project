"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const routes_1 = require("../routes/routes");
const database_1 = require("../database");
const Book_entity_1 = require("../entities/Book.entity");
const auth_1 = require("../middlewares/auth");
class BooksController {
    async getAllBooks(req, res) {
        const books = await database_1.mysqlDt.getRepository(Book_entity_1.Book).find().catch((err) => {
            console.error('get all error:', err);
            return null;
        });
        res.json({ success: !!books, data: books });
    }
    ;
    async getBook(req, res) {
        const book = await database_1.mysqlDt.getRepository(Book_entity_1.Book).findOne({ where: { id: +req.params.id } }).catch((err) => {
            console.error('get error:', err);
            return null;
        });
        res.json({ success: !!book, data: book });
    }
    ;
    async createBook(req, res) {
        const bookData = req.body;
        const book = await database_1.mysqlDt.getRepository(Book_entity_1.Book).insert(bookData).catch((err) => {
            console.error('Insert error:', err);
            return null;
        });
        res.json({ success: !!book });
    }
    ;
    async deleteBook(req, res) {
        const book = await database_1.mysqlDt.getRepository(Book_entity_1.Book).delete(req.params.id).catch((err) => {
            console.error('delete error:', err);
            return null;
        });
        res.json({ success: !!book });
    }
    ;
    async updateBook(req, res) {
        const bookData = req.body;
        console.log('Updating', req.params.id);
        console.log('Data:', bookData);
        const book = await database_1.mysqlDt.getRepository(Book_entity_1.Book).update(req.params.id, bookData).catch((err) => {
            console.error('update error:', err);
            return null;
        });
        res.json({ success: !!book });
    }
    ;
    async searchBook(req, res) {
        const bookData = req.body;
        const book = await database_1.mysqlDt.getRepository(Book_entity_1.Book).find({ where: bookData }).catch((err) => {
            console.error('search error:', err);
            return null;
        });
        res.json({ success: !!book, data: book });
    }
    ;
}
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.GET,
        path: '/api/books/all',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getAllBooks", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.GET,
        path: '/api/books/:id',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getBook", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.POST,
        path: '/api/books/new',
        authMiddleware: auth_1.authUser,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "createBook", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.DELETE,
        path: '/api/books/:id',
        authMiddleware: auth_1.authUser,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "deleteBook", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.PATCH,
        path: '/api/books/:id',
        authMiddleware: auth_1.authUser,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "updateBook", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.POST,
        path: '/api/books/search',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "searchBook", null);
exports.BooksController = BooksController;
//# sourceMappingURL=books.js.map