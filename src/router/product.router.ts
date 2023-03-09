import express, {Router} from 'express';
const productRoutes = Router();
import {Item} from "../schemas/product.model";
import {jwtauth} from "../middleware/jwtauth";
import * as bodyParser from "body-parser";
const fileupload = require('express-fileupload');
import cookieParser from 'cookie-parser';

import {Bug} from "../schemas/bug.model";
productRoutes.use(cookieParser("12345"));
productRoutes.use(fileupload({ createParentPath: true }));

productRoutes.use(bodyParser.json());


productRoutes.get('/create' ,(req: any,res)=> {
    try{
    const accountRole = req.decoded.role
        if(accountRole !== "user"){
            return  res.end("khong co quyen tao moi sp");
        } else {
            res.render('user/createProduct');
        }
    } catch(err) {
        console.log(err + 'đây là lỗi khối catch')
    }
});
productRoutes.post('/create',  async (req:any,res, next) =>{
    try {
        console.log(req.body)
        const accountUserName = req.decoded.username
        const theoretical = +req.body.theoretical;
        const practice = +req.body.practice;
        // Xử lí file ảnh và nhạc
        const average = (theoretical + practice)/2
        const itemNew = new Item({
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
    } catch (err){
        res.render(err.message)
    }
});
productRoutes.get('/', async (req: any,res) =>{
    try{

        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await Item.find();
        res.render('user/dashboard', {item: item } )
    } catch (err){
        res.render(err.message);
    }
});
productRoutes.get('/c10', async (req: any,res) =>{
    try{
        const accountUser = req.decoded.username
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await Item.find({class: 'c10'})
        const iteminPlaylistCreate = await Item.find()

        res.render('user/dashboard', {item: item, account: accountUser, iteminPlaylistCreate: iteminPlaylistCreate} )
    } catch (err){
        res.render(err.message);
    }
});
productRoutes.get('/c11', async (req: any,res) =>{
    try{
        const accountUser = req.decoded.username
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await Item.find({class: 'c11'})
        const iteminPlaylistCreate = await Item.find()

        res.render('user/dashboard', {item: item, account: accountUser, iteminPlaylistCreate: iteminPlaylistCreate } )
    } catch (err){
        res.render(err.message);
    }
});
productRoutes.get('/c12', async (req: any,res) =>{
    try{
        const accountUser = req.decoded.username
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await Item.find({class: 'c12'})
        const iteminPlaylistCreate = await Item.find()

        res.render('user/dashboard', {item: item, account: accountUser, iteminPlaylistCreate: iteminPlaylistCreate } )
    } catch (err){
        res.render(err.message);
    }
});
productRoutes.get('/listsort', async (req: any,res) =>{
    try{
        const accountUser = req.decoded.username
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await Item.find().sort({average:1});
        const iteminPlaylistCreate = await Item.find()

        res.render('user/dashboard', {item: item, account: accountUser, iteminPlaylistCreate: iteminPlaylistCreate } )
    } catch (err){
        res.render(err.message);
    }
});
productRoutes.get('/listsortt', async (req: any,res) =>{
    try{
        const accountUser = req.decoded.username
        let limit = req.query.limit || 3;
        let offset = req.query.offset || 0;
        const item = await Item.find().sort({average:-1});
        const iteminPlaylistCreate = await Item.find()

        res.render('user/dashboard', {item: item, account: accountUser, iteminPlaylistCreate: iteminPlaylistCreate} )
    } catch (err){
        res.render(err.message);
    }
});
productRoutes.get('/delete/:id', async (req, res) => {
    console.log(req.params.id)
    const idofItem = req.params.id;
    const item = await Item.deleteOne({_id : idofItem})
    res.redirect('/products/list')
})
productRoutes.get('/detail/:id', async (req, res) => {
    console.log(req.params.id)
    const idofItem = req.params.id;
    const item = await Item.findOne({_id : idofItem})
    res.render('user/dashboarddetail', {item: item})
})
productRoutes.post('/update/:id', async (req: any, res) =>{
    const idOfItemUpdate = req.params.id;
    // @ts-ignore
    const item = await Item.findOne({_id: req.params.id})
    item.name = req.body.name;
    item.theoretical = req.body.theoretical;
    item.practice = req.body.practice;
    item.evaluate = req.body.evaluate;
    item.description = req.body.description;
    item.class = req.body.class;
    await item.save()
    res.redirect('/products/list');
})


productRoutes.post('/bugreport', async (req, res) => {
    console.log(req.body)
    const itemBug = new Bug({
        title: req.body.title,
        bugreport: req.body.bugreport,
    });
    await itemBug.save()
    res.send("<script>alert(\"Gửi Báo Cáo thành công\"); window.location.href = \"/products/list\"; </script>");
})
export default productRoutes