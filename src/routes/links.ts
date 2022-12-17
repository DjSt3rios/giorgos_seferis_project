import { Router } from "express";
import * as controller from "../controllers/links";

export const links = Router();

links.get("/all", controller.allLinks);
links.post('/new', controller.addLink);
links.get("/:id", controller.getLink);
links.delete('/:id', controller.deleteLink);
links.patch('/:id', controller.updateLink);
