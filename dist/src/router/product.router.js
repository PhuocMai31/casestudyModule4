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
const jwtauth_1 = require("../middleware/jwtauth");
const bodyParser = __importStar(require("body-parser"));
const fileupload = require('express-fileupload');
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const playlist_model_1 = require("../schemas/playlist.model");
const bug_model_1 = require("../schemas/bug.model");
productRoutes.use((0, cookie_parser_1.default)("12345"));
productRoutes.use(fileupload({ createParentPath: true }));
productRoutes.use(bodyParser.json());
productRoutes.use('/', jwtauth_1.jwtauth);
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
        const accountUserName = req.decoded.username;
        let { avatar, music } = req.files;
        let avatarname = avatar.name;
        let musicname = music.name;
        avatar.mv('./public/' + avatarname);
        music.mv('./public/' + musicname);
        const itemNew = new product_model_1.Item({
            name: req.body.name,
            singer: req.body.singer,
            category: req.body.category,
            image: avatarname,
            filename: musicname,
            usernameCreate: accountUserName,
        });
        const item = await itemNew.save();
        res.redirect('/products/list');
    }
    catch (err) {
        res.render(err.message);
    }
});
productRoutes.get('/list', async (req, res) => {
    try {
        const accountUser = req.decoded.username;
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await product_model_1.Item.find({ usernameCreate: `${accountUser}` }).limit(limit).skip(limit * offset);
        const iteminPlaylistCreate = await product_model_1.Item.find({ usernameCreate: `${accountUser}` });
        const playlist = await playlist_model_1.Playlist1.find().populate({
            path: "musicList", select: "filename name usernameCreate", match: { usernameCreate: accountUser }
        });
        res.render('user/dashboard', { item: item, account: accountUser, iteminPlaylistCreate: iteminPlaylistCreate, playlist: playlist });
    }
    catch (_a) {
        res.render('user/error');
    }
});
productRoutes.get('/delete/:id', async (req, res) => {
    console.log(req.params.id);
    const idofItem = req.params.id;
    const item = await product_model_1.Item.deleteOne({ _id: idofItem });
    res.redirect('/products/list');
});
productRoutes.post('/update/:id', async (req, res) => {
    const idOfItemUpdate = req.params.id;
    const item = await product_model_1.Item.findOne({ _id: req.params.id });
    let { avatar } = req.files;
    let avatarname = avatar.name;
    avatar.mv('./public/' + avatarname);
    item.name = req.body.name;
    item.singer = req.body.singer;
    item.category = req.body.category;
    item.image = avatarname;
    await item.save();
    res.redirect('/products/list');
});
productRoutes.post('/newplaylist', async (req, res) => {
    const newPlaylist = new playlist_model_1.Playlist1({
        name: req.body.playlist
    });
    const plsSuccess = await newPlaylist.save();
    for (const id of req.body.id) {
        const item = await product_model_1.Item.findOne({ _id: id });
        item.playlist1.push(newPlaylist);
        const playlistInitem = await item.save();
        const playlist = await playlist_model_1.Playlist1.findOne({ name: req.body.playlist });
        playlist.musicList.push(item);
        const playlistPushitem = await playlist.save();
        console.log('day la playlist', playlistPushitem);
    }
    res.send("<script>alert(\"Tạo playlist mới thành công\"); window.location.href = \"/products/list\"; </script>");
});
productRoutes.get('/deleteplaylist/:id', async (req, res) => {
    console.log(req.params.id);
    const idofPlaylist = req.params.id;
    const item = await playlist_model_1.Playlist1.deleteOne({ _id: idofPlaylist });
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