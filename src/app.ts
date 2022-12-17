import bodyParser from "body-parser";
import express from "express";
import logger from "morgan";
import * as path from "path";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";

// Routes
import { index } from "./routes";
import { books } from "./routes/books";
import { links } from './routes/links';
// Create Express server
export const app = express();
app.use(bodyParser.json());

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", index);
app.use("/api/books", books);
app.use("/api/links", links);

app.use(errorNotFoundHandler);
app.use(errorHandler);
