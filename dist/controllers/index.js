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
exports.IndexController = void 0;
const routes_1 = require("../routes/routes");
/**
 * GET /
 * Home page.
 */
class IndexController {
    async getAllBooks(req, res) {
        res.sendFile('index.html', {
            root: './public'
        });
    }
    ;
}
__decorate([
    (0, routes_1.ControllerRoute)({
        method: routes_1.METHOD.GET,
        path: '/'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IndexController.prototype, "getAllBooks", null);
exports.IndexController = IndexController;
//# sourceMappingURL=index.js.map