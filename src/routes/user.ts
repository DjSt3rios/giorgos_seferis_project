import { Router } from "express";
import * as controller from "../controllers/books";

export const user = Router();

user.get("/all", controller.allBooks);
user.post('/new', controller.addBook);
user.get("/:id", controller.getBook);
user.delete('/:id', controller.deleteBook);
user.patch('/:id', controller.updateBook);