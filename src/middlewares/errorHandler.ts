import { Request, Response } from "express";
export const notFoundHandler = (req: Request, res: Response): void => {
    res.sendFile('index.html', {
        root: './public'
    });
};
