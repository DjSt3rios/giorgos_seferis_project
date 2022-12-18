import { Request, Response } from 'express';
import { ControllerRoute, METHOD } from '../routes/routes';
import { mysqlDt } from '../database';
import { User } from '../entities/User.entity';
import { UserModel } from '../models/user.model';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { authUser } from '../middlewares/auth';

export class UsersController {
    @ControllerRoute({
        method: METHOD.GET,
        path: '/api/users/all'
    }) async getAllUsers(req: Request, res: Response): Promise<void> {
        const users = await mysqlDt.getRepository(User).find().catch((err) => {
            console.error('get all error:', err);
            return null;
        });
        res.json({ success: !!users, data: users });
    };

    @ControllerRoute({
        method: METHOD.GET,
        path: '/api/users/:id'
    }) async getUser(req: Request, res: Response): Promise<void> {
        const user = await mysqlDt.getRepository(User).findOne({ where: { id: +req.params.id }}).catch((err) => {
            console.error('get error:', err);
            return null;
        });
        if (!user) {
            res.json({ success: false, message: 'User could not be found.' });
            return;
        }
        res.json({ success: true, data: user });
    };

    @ControllerRoute({
        method: METHOD.POST,
        path: '/api/users/new'
    }) async createUser(req: Request, res: Response): Promise<void> {
        const userData: UserModel = req.body;
        const existingUser = await mysqlDt.getRepository(User).findOne({
            where: {
                username: userData.username
            }
        });
        if (existingUser) {
            res.json({ success: false, message: 'A user with this username already exists.' });
            return;
        }
        const encryptedPwd = await bcrypt.hash(userData.password, 6);
        const newUser = await mysqlDt.getRepository(User).save({ ...userData, password: encryptedPwd }).catch((err) => {
            console.error('Insert error:', err);
            return null;
        });
        if (newUser) {
            const token = jwt.sign(
                { id: newUser.id, username: newUser.username },
                "uth2022www",
                {
                    expiresIn: "1y",
                }
            );
            res.json({ success: !!newUser, accessToken: token });
            return;
        }
        res.json({ success: false });
    };

    @ControllerRoute({
        method: METHOD.DELETE,
        path: '/api/users/:id',
        authMiddleware: authUser,
    }) async deleteUser(req: Request, res: Response): Promise<void> {
        const reqUser = (req as any).user;
        const user = await  mysqlDt.getRepository(User).findOne({ where: { id: reqUser?.id }});
        if (!user.isAdmin) {
            res.json({ success: false, message: 'Invalid privileges'});
            return;
        }
        const deleteResult = await mysqlDt.getRepository(User).delete(req.params.id).catch((err) => {
            console.error('delete error:', err);
            return null;
        });
        res.json({ success: !!deleteResult });
    };

    @ControllerRoute({
        method: METHOD.PATCH,
        path: '/api/users/:id',
        authMiddleware: authUser,
    }) async updateUser(req: Request, res: Response): Promise<void> {
        const reqUser = (req as any).user;
        const user = await  mysqlDt.getRepository(User).findOne({ where: { id: reqUser?.id }});
        if (!user.isAdmin) {
            res.json({ success: false, message: 'Invalid privileges'});
            return;
        }
        const userData: UserModel = req.body;
        const updateResult = await mysqlDt.getRepository(User).update(req.params.id, userData).catch((err) => {
            console.error('update error:', err);
            return null;
        });
        res.json({ success: !!updateResult });
    };

    @ControllerRoute({
        method: METHOD.POST,
        path: '/api/users/login'
    }) async loginUser(req: Request, res: Response): Promise<void> {
        const userData: UserModel = req.body;
        const user = await mysqlDt.getRepository(User).findOne({ where: { username: userData.username }}).catch((err) => {
            console.error('get error:', err);
            return null;
        });
        if (!user) {
            res.json({ success: false, message: 'User could not be found.' });
            return;
        }
        if (user && (await bcrypt.compare(userData.password, user.password))) {
            // Create token
            const token = jwt.sign(
                { id: user.id, username: user.username },
                "uth2022www",
                {
                    expiresIn: "1y",
                }
            );
            // user
            res.json({
                success: true,
                accessToken: token,
            });
            return;
        }
        res.json({ success: false, message: 'Authentication failed' });
    };
}