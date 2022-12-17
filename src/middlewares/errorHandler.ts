import { NextFunction, Request, Response } from "express";

declare type WebError = Error & { status?: number };
export const errorHandler = (err: WebError, req: Request, res: Response, next: NextFunction): void => {
    res.sendFile('index.html', {
        root: './public'
    });
};

export const errorNotFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    res.sendFile('index.html', {
        root: './public'
    });
};
