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
const express_1 = __importStar(require("express"));
const productRoutes = (0, express_1.Router)();
const product_model_1 = require("../schemas/product.model");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const jwtauth_1 = require("../middleware/jwtauth");
const bodyParser = __importStar(require("body-parser"));
const author_model_1 = require("../schemas/author.model");
const fileupload = require('express-fileupload');
const cookie_parser_1 = __importDefault(require("cookie-parser"));
productRoutes.use((0, cookie_parser_1.default)("12345"));
productRoutes.use(fileupload({ createParentPath: true }));
productRoutes.use(express_1.default.static('public'));
productRoutes.use(bodyParser.json());
productRoutes.use('/create', jwtauth_1.jwtauth);
productRoutes.get('/create', (req, res) => {
    try {
        const accountRole = req.decoded.role;
        console.log('accountRole', req.decoded.role);
        if (accountRole !== "admin") {
            return res.end("khong co quyen tao moi sp");
        }
        else {
            res.render('createProduct');
        }
    }
    catch (err) {
        console.log(err + 'đây là lỗi khối catch');
    }
});
productRoutes.post('/create', async (req, res, next) => {
    try {
        let { avatar } = req.files;
        let avatarname = avatar.name;
        avatar.mv('./public/' + avatarname);
        const authorNew = new author_model_1.Author({ name: req.body.author });
        const itemNew = new product_model_1.Item({
            name: req.body.name,
            price: req.body.price,
            producer: req.body.producer,
            author: authorNew,
            keyword: req.body.keyword,
            avatar: avatar.name
        });
        itemNew.keywords.push({ keyword: req.body.keyword });
        const author = await authorNew.save();
        const item = await itemNew.save();
        if (item) {
            res.redirect('/item/list');
        }
        else {
            res.render('success');
        }
    }
    catch (err) {
        res.render(err.message);
    }
});
productRoutes.get('/list', async (req, res) => {
    try {
        if (req.query.keyword || req.query.author) {
            let authorFind = await author_model_1.Author.findOne({ name: { $regex: req.query.author } });
            let query = {
                "keywords.keyword": {
                    $regex: req.query.keyword
                },
                author: authorFind
            };
            console.log(query);
            const itemSearch = await product_model_1.Item.find(query).populate({ path: 'author', select: 'name' });
            res.render('listProduct', { item: itemSearch });
        }
        let limit = req.query.limit || 2;
        let offset = req.query.offset || 0;
        const item = await product_model_1.Item.find().limit(limit).skip(limit * offset).populate({ path: 'author', select: 'name' });
        console.log(item[0].keywords[0].keyword);
        res.render('listProduct', { item: item });
    }
    catch (_a) {
        res.render('error');
    }
});
productRoutes.get('/delete/:id', async (req, res) => {
    const idofItem = req.params.id;
    const item = await product_model_1.Item.remove({ _id: idofItem });
    res.redirect('/products/list');
});
productRoutes.get('/update/:id', async (req, res) => {
    const idOfItemUpdate = req.params.id;
    const itemUpdate = await product_model_1.Item.findById(idOfItemUpdate);
    res.render('update', { data: itemUpdate });
});
productRoutes.post('/update/:id', upload.none(), async (req, res) => {
    const idOfItemUpdate = req.params.id;
    const item = await product_model_1.Item.findOne({ _id: req.params.id });
    item.name = req.body.name;
    item.price = req.body.price;
    item.producer = req.body.producer;
    item.avatar = req.body.avatar;
    await item.save();
    res.redirect('/products/list');
});
exports.default = productRoutes;
//# sourceMappingURL=product.router.js.map