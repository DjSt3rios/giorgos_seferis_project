import bodyParser from "body-parser";
import express from "express";
import * as path from "path";
// Routes
import { mysqlDt } from './database';

mysqlDt.initialize().then(() => {
    console.log("Database connection established.");
}).catch((error) => console.log("Could not connect to database!", error))

export const app = express();
app.use(bodyParser.json());
import { BooksController } from './controllers/books';
import { LinksController } from './controllers/links';
import { UsersController } from './controllers/user';
import { notFoundHandler } from './middlewares/error';

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, "../public")));
new BooksController();
new LinksController();
new UsersController();

app.use(notFoundHandler);
