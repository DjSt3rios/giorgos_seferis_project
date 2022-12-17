import * as jwt from 'jsonwebtoken';
import {Request, Response} from 'express';

export const authUser = (req: Request, res: Response, next: Function) => {
    const token: string = req.headers['access-token'] as string;

    if (!token) {
        return res.status(403).json({ success: false, message: "Authentication token not found" });
    }
    try {
        const decoded = jwt.verify(token, "uth2022www");
        (req as any).user = decoded;
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }
    return next();
};