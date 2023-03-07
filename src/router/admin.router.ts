import express, {Router} from 'express';
const adminRoutes = Router();
import {Item} from "../schemas/product.model";
import {jwtauth} from "../middleware/jwtauth";
import * as bodyParser from "body-parser";
const fileupload = require('express-fileupload');
import cookieParser from 'cookie-parser';
import {Playlist1} from "../schemas/playlist.model";
import productRoutes from "./product.router";
import {Account} from "../schemas/account.model";
import {Bug} from "../schemas/bug.model";
adminRoutes.use(cookieParser("12345"));
adminRoutes.use(fileupload({ createParentPath: true }));
// productRoutes.use(express.static('public'))
adminRoutes.use(bodyParser.json());

adminRoutes.use('/', jwtauth);

adminRoutes.get('/list', async (req: any,res) =>{
    try{
        const accountAdmin = req.decoded.username
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const account = await Account.find();
        const bugs = await Bug.find();
        res.render('admin/adminDashboard', {account: account, accountAdmin: accountAdmin, bugs: bugs} )
    } catch {
        res.render('user/error');
    }
});
adminRoutes.get('/delete/:id', async (req, res) => {
    console.log(req.params.id)
    const idofUser = req.params.id;
    console.log('is id user', idofUser)
    const item = await Account.deleteOne({_id : idofUser})
    res.redirect('/admin/list')
});
adminRoutes.get('/deletebug/:id', async (req: any,res) =>{
    try{
        console.log(req.params.id);
        const item = await Bug.deleteOne({_id : req.params.id})
        res.redirect('/admin/list')
    } catch {
        res.render('user/error');
    }
});
export default adminRoutes