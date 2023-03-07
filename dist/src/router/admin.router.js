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
const express_1 = require("express");
const adminRoutes = (0, express_1.Router)();
const jwtauth_1 = require("../middleware/jwtauth");
const bodyParser = __importStar(require("body-parser"));
const fileupload = require('express-fileupload');
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const account_model_1 = require("../schemas/account.model");
const bug_model_1 = require("../schemas/bug.model");
adminRoutes.use((0, cookie_parser_1.default)("12345"));
adminRoutes.use(fileupload({ createParentPath: true }));
adminRoutes.use(bodyParser.json());
adminRoutes.use('/', jwtauth_1.jwtauth);
adminRoutes.get('/list', async (req, res) => {
    try {
        const accountAdmin = req.decoded.username;
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const account = await account_model_1.Account.find();
        const bugs = await bug_model_1.Bug.find();
        res.render('admin/adminDashboard', { account: account, accountAdmin: accountAdmin, bugs: bugs });
    }
    catch (_a) {
        res.render('user/error');
    }
});
adminRoutes.get('/delete/:id', async (req, res) => {
    console.log(req.params.id);
    const idofUser = req.params.id;
    console.log('is id user', idofUser);
    const item = await account_model_1.Account.deleteOne({ _id: idofUser });
    res.redirect('/admin/list');
});
adminRoutes.get('/deletebug/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const item = await bug_model_1.Bug.deleteOne({ _id: req.params.id });
        res.redirect('/admin/list');
    }
    catch (_a) {
        res.render('user/error');
    }
});
exports.default = adminRoutes;
//# sourceMappingURL=admin.router.js.map