"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinksController = void 0;
const routes_1 = require("../routes/routes");
const database_1 = require("../database");
const Link_entity_1 = require("../entities/Link.entity");
const auth_1 = require("../middlewares/auth");
const User_entity_1 = require("../entities/User.entity");
class LinksController {
    async getAllLinks(req, res) {
        const links = await database_1.mysqlDt.getRepository(Link_entity_1.Link).find().catch((err) => {
            console.error('get all error:', err);
            return null;
        });
        res.json({ success: !!links, data: links });
    }
    ;
    async getLink(req, res) {
        const link = await database_1.mysqlDt.getRepository(Link_entity_1.Link).findOne({ where: { id: +req.params.id } }).catch((err) => {
            console.error('get error:', err);
            return null;
        });
        res.json({ success: !!link, data: link });
    }
    ;
    async createLink(req, res) {
        const reqUser = req.user;
        const user = await database_1.mysqlDt.getRepository(User_entity_1.User).findOne({ where: { id: reqUser?.id } });
        if (!user.isAdmin) {
            res.json({ success: false, message: 'Invalid privileges' });
            return;
        }
        const linkData = req.body;
        const link = await database_1.mysqlDt.getRepository(Link_entity_1.Link).insert(linkData).catch((err) => {
            console.error('Insert error:', err);
            return null;
        });
        res.json({ success: !!link });
    }
    ;
    async deleteLink(req, res) {
        const reqUser = req.user;
        const user = await database_1.mysqlDt.getRepository(User_entity_1.User).findOne({ where: { id: reqUser?.id } });
        if (!user.isAdmin) {
            res.json({ success: false, message: 'Invalid privileges' });
            return;
        }
        const link = await database_1.mysqlDt.getRepository(Link_entity_1.Link).delete(req.params.id).catch((err) => {
            console.error('delete error:', err);
            return null;
        });
        res.json({ success: !!link });
    }
    ;
    async updateLink(req, res) {
        const reqUser = req.user;
        const user = await database_1.mysqlDt.getRepository(User_entity_1.User).findOne({ where: { id: reqUser?.id } });
        if (!user.isAdmin) {
            res.json({ success: false, message: 'Invalid privileges' });
            return;
        }
        const linkData = req.body;
        const link = await database_1.mysqlDt.getRepository(Link_entity_1.Link).update(req.params.id, linkData).catch((err) => {
            console.error('update error:', err);
            return null;
        });
        res.json({ success: !!link });
    }
    ;
    async searchLink(req, res) {
        const linkData = req.body;
        const link = await database_1.mysqlDt.getRepository(Link_entity_1.Link).find({ where: linkData }).catch((err) => {
            console.error('search error:', err);
            return null;
        });
        res.json({ success: !!link, data: link });
    }
    ;
}
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.GET,
        path: '/api/links/all'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getAllLinks", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.GET,
        path: '/api/links/:id'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "getLink", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.POST,
        path: '/api/links/new',
        authMiddleware: auth_1.authUser,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "createLink", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.DELETE,
        path: '/api/links/:id',
        authMiddleware: auth_1.authUser,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "deleteLink", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.PATCH,
        path: '/api/links/:id',
        authMiddleware: auth_1.authUser,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "updateLink", null);
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.POST,
        path: '/api/links/search',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LinksController.prototype, "searchLink", null);
exports.LinksController = LinksController;
//# sourceMappingURL=links.js.map