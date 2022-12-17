"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const routes_1 = require("../routes/routes");
const database_1 = require("../database");
const User_entity_1 = require("../entities/User.entity");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const auth_1 = require("../middlewares/auth");
class UsersController {
    async getAllUsers(req, res) {
        const users = await database_1.mysqlDt.getRepository(User_entity_1.User).find().catch((err) => {
            console.error('get all error:', err);
            return null;
        });
        res.json({ success: !!users, data: users });
    }
    ;
    async getUser(req, res) {
        const user = await database_1.mysqlDt.getRepository(User_entity_1.User).findOne({ where: { id: +req.params.id } }).catch((err) => {
            console.error('get error:', err);
            return null;
        });
        res.json({ success: !!user, data: user });
    }
    ;
    async createUser(req, res) {
        const userData = req.body;
        const existingUser = await database_1.mysqlDt.getRepository(User_entity_1.User).findOne({
            where: {
                username: userData.username
            }
        });
        if (existingUser) {
            res.json({ success: false, message: 'A user with this username already exists.' });
            return;
        }
        const encryptedPwd = await bcrypt.hash(userData.password, 6);
        const user = await database_1.mysqlDt.getRepository(User_entity_1.User).save({ ...userData, password: encryptedPwd }).catch((err) => {
            console.error('Insert error:', err);
            return null;
        });
        if (user) {
            const token = jwt.sign({ id: user.id, username: user.username }, "uth2022www", {
                expiresIn: "1y",
            });
            res.json({ success: !!user, accessToken: token });
            return;
        }
        res.json({ success: false });
    }
    ;
    async deleteUser(req, res) {
        const user = await database_1.mysqlDt.getRepository(User_entity_1.User).delete(req.params.id).catch((err) => {
            console.error('delete error:', err);
            return null;
        });
        res.json({ success: !!user });
    }
    ;
    async updateUser(req, res) {
        const userData = req.body;
        const user = await database_1.mysqlDt.getRepository(User_entity_1.User).update(req.params.id, userData).catch((err) => {
            console.error('update error:', err);
            return null;
        });
        res.json({ success: !!user });
    }
    ;
    async loginUser(req, res) {
        const userData = req.body;
        const user = await database_1.mysqlDt.getRepository(User_entity_1.User).findOne({ where: { username: userData.username } }).catch((err) => {
            console.error('get error:', err);
            return null;
        });
        if (user && (await bcrypt.compare(userData.password, user.password))) {
            // Create token
            const token = jwt.sign({ id: user.id, username: user.username }, "uth2022www", {
                expiresIn: "1y",
            });
            // user
            res.json({
                success: true,
                accessToken: token,
            });
            return;
        }
        res.json({ success: false });
    }
    ;
}
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.GET,
        path: '/api/users/all'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.GET,
        path: '/api/users/:id'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.POST,
        path: '/api/users/new'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.DELETE,
        path: '/api/users/:id',
        authMiddleware: auth_1.authUser,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.PATCH,
        path: '/api/users/:id',
        authMiddleware: auth_1.authUser,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.POST,
        path: '/api/users/login'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "loginUser", null);
exports.UsersController = UsersController;
//# sourceMappingURL=user.js.map