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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
// Routes
const database_1 = require("./database");
database_1.mysqlDt.initialize().then(() => {
    console.log("Database connection established.");
}).catch((error) => console.log("Could not connect to database!", error));
exports.app = (0, express_1.default)();
exports.app.use(body_parser_1.default.json());
exports.app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization, access-token");
    next();
});
const books_1 = require("./controllers/books");
const links_1 = require("./controllers/links");
const user_1 = require("./controllers/user");
const error_1 = require("./middlewares/error");
// Express configuration
exports.app.set("port", process.env.PORT || 3000);
exports.app.use(express_1.default.static(path.join(__dirname, "../public")));
new books_1.BooksController();
new links_1.LinksController();
new user_1.UsersController();
exports.app.use(error_1.notFoundHandler);
//# sourceMappingURL=app.js.map