import express, {Router} from 'express';
const productRoutes = Router();
import {Item} from "../schemas/product.model";
import multer from 'multer';
const upload = multer();
import {jwtauth} from "../middleware/jwtauth";
import * as bodyParser from "body-parser";
import {Author} from "../schemas/author.model";
const fileupload = require('express-fileupload');
import session from 'express-session';
import cookieParser from 'cookie-parser';
productRoutes.use(cookieParser("12345"));
productRoutes.use(fileupload({ createParentPath: true }));
productRoutes.use(express.static('public'))
productRoutes.use(bodyParser.json());

productRoutes.use('/create', jwtauth)
productRoutes.get('/create' ,(req: any,res)=> {
    try{
    const accountRole = req.decoded.role
        console.log('accountRole' , req.decoded.role);
        if(accountRole !== "admin"){
            return  res.end("khong co quyen tao moi sp");

        } else {
            res.render('createProduct');
        }
    //     // const account = req.decode;
    //     console.log(req.decode)
    //     // if (account.role !== "admin"){
    //     //      res.render('createProduct');
    //     // } else {
    //     //     res.end('khong co quyen tao san pham')
        // }
    } catch(err) {
        console.log(err + 'đây là lỗi khối catch')
    }
    // try {
    //     console.log('is decode' , req.decoded.role)
    //     res.render('createProduct');
    // } catch (err){}

});
productRoutes.post('/create',  async (req:any,res, next) =>{
    try {
        // Xử lí file ảnh
        let {avatar} = req.files;
        let avatarname = avatar.name;
        avatar.mv('./public/' + avatarname)
        // Xử lí dữ liệu trong body
        const authorNew = new Author({name: req.body.author})
        const itemNew = new Item({
            name: req.body.name,
            price: req.body.price,
            producer: req.body.producer,
            author: authorNew,
            keyword : req.body.keyword,
            avatar: avatar.name
        });
        itemNew.keywords.push({keyword: req.body.keyword});
        const author = await authorNew.save();
        const item = await itemNew.save();
        if(item){
            res.redirect('/item/list');
        }else {
            res.render('success')
        }
    } catch (err){
        res.render(err.message)
    }
});
productRoutes.get('/list', async (req,res) =>{
    try{
        if(req.query.keyword || req.query.author){
            let authorFind = await Author.findOne({name: {$regex: req.query.author}})
            let query = {
                "keywords.keyword": {
                    $regex: req.query.keyword
                },
                author: authorFind
            };
            console.log(query)
            const itemSearch = await Item.find(query).populate({path: 'author', select: 'name'});
            // @ts-ignore
            res.render('listProduct', {item: itemSearch})
        }
        let limit = req.query.limit || 2;
        let offset = req.query.offset || 0;
        // @ts-ignore
        const item = await Item.find().limit(limit).skip(limit*offset).populate({path: 'author', select: 'name'});
        // @ts-ignore
        console.log(item[0].keywords[0].keyword)
        res.render('listProduct', {item: item})
    } catch {
        res.render('error');
    }
});
productRoutes.get('/delete/:id', async (req, res) => {
    const idofItem = req.params.id;
    const item = await Item.remove({_id : idofItem})
    res.redirect('/products/list')
})
productRoutes.get('/update/:id', async (req,res) => {
    const idOfItemUpdate = req.params.id;
    const itemUpdate = await Item.findById(idOfItemUpdate);
    // @ts-ignore
    res.render('update', {data: itemUpdate})
})
productRoutes.post('/update/:id',upload.none(), async (req, res) =>{
    const idOfItemUpdate = req.params.id;
    // @ts-ignore
    const item = await Item.findOne({_id: req.params.id})
    item.name = req.body.name;
    item.price = req.body.price;
    item.producer = req.body.producer;
    item.avatar = req.body.avatar;
    await item.save()
    res.redirect('/products/list');
})
export default productRoutes