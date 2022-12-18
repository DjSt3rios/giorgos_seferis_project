import { ControllerRoute, METHOD } from '../routes/routes';
import { Request, Response } from 'express';
import { mysqlDt } from '../database';
import { Link } from '../entities/Link.entity';
import { LinkModel } from '../models/link.model';
import { authUser } from '../middlewares/auth';
import { User } from '../entities/User.entity';

export class LinksController {
    @ControllerRoute({
        method: METHOD.GET,
        path: '/api/links/all'
    }) async getAllLinks(req: Request, res: Response): Promise<void> {
        const links = await mysqlDt.getRepository(Link).find().catch((err) => {
            console.error('get all error:', err);
            return null;
        });
        res.json({ success: !!links, data: links });
    };

    @ControllerRoute({
        method: METHOD.GET,
        path: '/api/links/:id'
    }) async getLink(req: Request, res: Response): Promise<void> {
        const link = await mysqlDt.getRepository(Link).findOne({ where: { id: +req.params.id }}).catch((err) => {
            console.error('get error:', err);
            return null;
        });
        res.json({ success: !!link, data: link });
    };

    @ControllerRoute({
        method: METHOD.POST,
        path: '/api/links/new',
        authMiddleware: authUser,
    }) async createLink(req: Request, res: Response): Promise<void> {
        const reqUser = (req as any).user;
        const user = await  mysqlDt.getRepository(User).findOne({ where: { id: reqUser?.id }});
        if (!user.isAdmin) {
            res.json({ success: false, message: 'Invalid privileges'});
            return;
        }
        const linkData: LinkModel = req.body;
        const link = await mysqlDt.getRepository(Link).insert(linkData).catch((err) => {
            console.error('Insert error:', err);
            return null;
        });
        res.json({ success: !!link });
    };

    @ControllerRoute({
        method: METHOD.DELETE,
        path: '/api/links/:id',
        authMiddleware: authUser,
    }) async deleteLink(req: Request, res: Response): Promise<void> {
        const reqUser = (req as any).user;
        const user = await  mysqlDt.getRepository(User).findOne({ where: { id: reqUser?.id }});
        if (!user.isAdmin) {
            res.json({ success: false, message: 'Invalid privileges'});
            return;
        }
        const link = await mysqlDt.getRepository(Link).delete(req.params.id).catch((err) => {
            console.error('delete error:', err);
            return null;
        });
        res.json({ success: !!link });
    };

    @ControllerRoute({
        method: METHOD.PATCH,
        path: '/api/links/:id',
        authMiddleware: authUser,
    }) async updateLink(req: Request, res: Response): Promise<void> {
        const reqUser = (req as any).user;
        const user = await  mysqlDt.getRepository(User).findOne({ where: { id: reqUser?.id }});
        if (!user.isAdmin) {
            res.json({ success: false, message: 'Invalid privileges'});
            return;
        }
        const linkData: LinkModel = req.body;
        const link = await mysqlDt.getRepository(Link).update(req.params.id, linkData).catch((err) => {
            console.error('update error:', err);
            return null;
        });
        res.json({ success: !!link });
    };

    @ControllerRoute({
        method: METHOD.POST,
        path: '/api/links/search',
    }) async searchLink(req: Request, res: Response): Promise<void> {
        const linkData: LinkModel = req.body;
        const link = await mysqlDt.getRepository(Link).find({ where: linkData }).catch((err) => {
            console.error('search error:', err);
            return null;
        });
        res.json({ success: !!link, data: link });
    };

}