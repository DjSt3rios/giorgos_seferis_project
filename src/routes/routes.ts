import { Request, Response } from "express";
import { app } from '../app';

export enum METHOD {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    DELETE = 'delete',
}
export interface RouteConfigProps {
    method: METHOD;
    path: string;
    authMiddleware?: any;
}

export function ControllerRoute({method, path, authMiddleware}: RouteConfigProps): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const response = async (req: Request, res: Response) => {
            try {
                const original = await descriptor.value(req, res);

                res.status(200).json(original);
            } catch (e) {
                res.status(500).json({
                    message: "An error has occurred",
                    error: e.message,
                    stack: e.stack,
                });
            }
        }
        if (authMiddleware) {
            app[method](path, authMiddleware, response);
        } else {
            app[method](path, response);
        }
    }
}