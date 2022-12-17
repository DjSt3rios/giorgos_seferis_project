import { Router } from "express";
import * as controller from "../controllers/books";

export const books = Router();

books.get("/all", controller.allBooks);
books.post('/new', controller.addBook);
books.get("/:id", controller.getBook);
books.delete('/:id', controller.deleteBook);
books.patch('/:id', controller.updateBook);