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
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization, access-token");
    next();
});
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
