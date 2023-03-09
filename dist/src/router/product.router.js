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
const productRoutes = (0, express_1.Router)();
const product_model_1 = require("../schemas/product.model");
const bodyParser = __importStar(require("body-parser"));
const fileupload = require('express-fileupload');
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bug_model_1 = require("../schemas/bug.model");
productRoutes.use((0, cookie_parser_1.default)("12345"));
productRoutes.use(fileupload({ createParentPath: true }));
productRoutes.use(bodyParser.json());
productRoutes.get('/create', (req, res) => {
    try {
        const accountRole = req.decoded.role;
        if (accountRole !== "user") {
            return res.end("khong co quyen tao moi sp");
        }
        else {
            res.render('user/createProduct');
        }
    }
    catch (err) {
        console.log(err + 'đây là lỗi khối catch');
    }
});
productRoutes.post('/create', async (req, res, next) => {
    try {
        console.log(req.body);
        const accountUserName = req.decoded.username;
        const theoretical = +req.body.theoretical;
        const practice = +req.body.practice;
        const average = (theoretical + practice) / 2;
        const itemNew = new product_model_1.Item({
            name: req.body.name,
            theoretical: req.body.theoretical,
            practice: req.body.practice,
            average: average,
            description: req.body.description,
            evaluate: req.body.evaluate,
            class: req.body.class,
            usernameCreate: accountUserName,
        });
        const item = await itemNew.save();
        res.redirect('/products/list');
    }
    catch (err) {
        res.render(err.message);
    }
});
productRoutes.get('/', async (req, res) => {
    try {
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await product_model_1.Item.find();
        res.render('user/dashboard', { item: item });
    }
    catch (err) {
        res.render(err.message);
    }
});
productRoutes.get('/c10', async (req, res) => {
    try {
        const accountUser = req.decoded.username;
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await product_model_1.Item.find({ class: 'c10' });
        const iteminPlaylistCreate = await product_model_1.Item.find();
        res.render('user/dashboard', { item: item, account: accountUser, iteminPlaylistCreate: iteminPlaylistCreate });
    }
    catch (err) {
        res.render(err.message);
    }
});
productRoutes.get('/c11', async (req, res) => {
    try {
        const accountUser = req.decoded.username;
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await product_model_1.Item.find({ class: 'c11' });
        const iteminPlaylistCreate = await product_model_1.Item.find();
        res.render('user/dashboard', { item: item, account: accountUser, iteminPlaylistCreate: iteminPlaylistCreate });
    }
    catch (err) {
        res.render(err.message);
    }
});
productRoutes.get('/c12', async (req, res) => {
    try {
        const accountUser = req.decoded.username;
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await product_model_1.Item.find({ class: 'c12' });
        const iteminPlaylistCreate = await product_model_1.Item.find();
        res.render('user/dashboard', { item: item, account: accountUser, iteminPlaylistCreate: iteminPlaylistCreate });
    }
    catch (err) {
        res.render(err.message);
    }
});
productRoutes.get('/listsort', async (req, res) => {
    try {
        const accountUser = req.decoded.username;
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await product_model_1.Item.find().sort({ average: 1 });
        const iteminPlaylistCreate = await product_model_1.Item.find();
        res.render('user/dashboard', { item: item, account: accountUser, iteminPlaylistCreate: iteminPlaylistCreate });
    }
    catch (err) {
        res.render(err.message);
    }
});
productRoutes.get('/listsortt', async (req, res) => {
    try {
        const accountUser = req.decoded.username;
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await product_model_1.Item.find().sort({ average: -1 });
        const iteminPlaylistCreate = await product_model_1.Item.find();
        res.render('user/dashboard', { item: item, account: accountUser, iteminPlaylistCreate: iteminPlaylistCreate });
    }
    catch (err) {
        res.render(err.message);
    }
});
productRoutes.get('/delete/:id', async (req, res) => {
    console.log(req.params.id);
    const idofItem = req.params.id;
    const item = await product_model_1.Item.deleteOne({ _id: idofItem });
    res.redirect('/products/list');
});
productRoutes.get('/detail/:id', async (req, res) => {
    console.log(req.params.id);
    const idofItem = req.params.id;
    const item = await product_model_1.Item.findOne({ _id: idofItem });
    res.render('user/dashboarddetail', { item: item });
});
productRoutes.post('/update/:id', async (req, res) => {
    const idOfItemUpdate = req.params.id;
    const item = await product_model_1.Item.findOne({ _id: req.params.id });
    item.name = req.body.name;
    item.theoretical = req.body.theoretical;
    item.practice = req.body.practice;
    item.evaluate = req.body.evaluate;
    item.description = req.body.description;
    item.class = req.body.class;
    await item.save();
    res.redirect('/products/list');
});
productRoutes.post('/bugreport', async (req, res) => {
    console.log(req.body);
    const itemBug = new bug_model_1.Bug({
        title: req.body.title,
        bugreport: req.body.bugreport,
    });
    await itemBug.save();
    res.send("<script>alert(\"Gửi Báo Cáo thành công\"); window.location.href = \"/products/list\"; </script>");
});
exports.default = productRoutes;
//# sourceMappingURL=product.router.js.map