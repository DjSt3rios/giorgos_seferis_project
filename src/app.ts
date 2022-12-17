import bodyParser from "body-parser";
import express from "express";
import logger from "morgan";
import * as path from "path";
// Routes
import { index } from "./routes";
import { books } from "./routes/books";
import { links } from './routes/links';
import { user } from './routes/user';
import { notFoundHandler } from "./middlewares/errorHandler";

export const app = express();
app.use(bodyParser.json());

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", index);
app.use("/api/books", books);
app.use("/api/links", links);
app.use("/api/user", user);

app.use(notFoundHandler);
