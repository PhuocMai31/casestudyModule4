import {Router, Request, Response} from "express";
const loginRoutes = Router();
import multer from 'multer';
const upload = multer();
import * as bodyParser from "body-parser";
import passport from "../middleware/passport";
import {Account} from "../schemas/account.model";
const fileupload = require('express-fileupload');
import jwt from 'jsonwebtoken';
import {cleanCookie} from "../middleware/cleanCookie";
const mailer = require('../../utils/mailer');
import bcrypt from 'bcrypt';
import * as process from "process";


loginRoutes.use(bodyParser.json());
loginRoutes.use(fileupload({ createParentPath: true }));

loginRoutes.get('/logout',cleanCookie,(req: Request, res: Response) => {
    res.redirect('/auth/login')
})

loginRoutes.get('/login', (req: Request,res: Response) => {
    res.render('login/newlogin-signin')
})
loginRoutes.post('/login', async (req: any,res: Response, next) =>{
    try{
        const account = await Account.findOne({username: req.body.username});
        if(account){
            if(account.status == "unverify"){
                return res.send("<script>alert(\"Vui Lòng Kiểm Tra Email Xác Thực Tài Khoản\"); window.location.href = \"/auth/login\"; </script>");
            } else if (account.status == "verify"){
                let payload = {
                    user_id: account["id"],
                    username: account["username"],
                    role: account["role"]
                }
                const token = jwt.sign(payload, '123456789', {
                    expiresIn: 36000,
                });
                res.cookie("name", token )
                res.redirect('/products/list')
            }
        } else {
            return res.send("<script>alert(\"Wrong Email or Password\"); window.location.href = \"/auth/login\"; </script>");
        }
    }
    catch (error){
        return res.send("<script>alert(\"Lỗi Phía Server\"); window.location.href = \"/auth/login\"; </script>");
    }
    // passport.authenticate('local', (err, user) =>{
    //     if(err){
    //         return next(err)
    //     }
    //     if(!user){
    //         return res.send("<script>alert(\"Wrong Email or Password\"); window.location.href = \"/auth/login\"; </script>");
    //     }
    //     // @ts-ignore
    //     req.login(user, () => {
    //         res.send('you are authenticated')
    //     })
    // }) (req, res , next)
    }
);
loginRoutes.get('/register', (req: Request,res: Response) => {
    res.render('login/newlogin-signin')
})
loginRoutes.post('/register', async (req: Request, res: Response) => {
    try{
        const user = await Account.findOne({username: req.body.username});
        if (!user) {
        const newAccount = new Account({
            username: req.body.username,
            password: req.body.password,
            role: "user",
            status: "unverify"
        })
            await newAccount.save((err,newAccount) => {
            if(!err){
                bcrypt.hash(newAccount.username, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedEmail) => {
                    mailer.sendMail(newAccount.username, "Xin Chào,Hãy xác thực tài khoản web nghe nhạc Online cùng Phước đẹp trai và Hoàng Nhật Bản", `<h4>Hãy Nhấn Vào Link Dưới Đây Để Xác Thực Email</h4>><br><a href="${process.env.APP_URL}/auth/verify?email=${newAccount.username}&token=${hashedEmail}"> Verify </a>`)
                });
            } else {
               return res.send("<script>alert(\"Sai định dạng tên tài khoản hoặc mật khẩu vui lòng nhập lại \"); window.location.href = \"/auth/login\"; </script>");
            }
            res.setHeader("Content-Type", "text/html");
            res.send("<script>alert(\"Đăng kí thành công. Vui lòng truy cập Email xác thực tài khoản\"); window.location.href = \"/auth/login\"; </script>");
        });
        }
        else {res.send("<script>alert(\"This email already exists\"); window.location.href = \"/auth/register\"; </script>");}
    } catch (err){
        res.send("<script>alert(\"Sai định dạng tên tài khoản hoặc mật khẩu vui lòng nhập lại \"); window.location.href = \"/auth/register\"; </script>");
    }
})
loginRoutes.get('/verify', async  (req, res) => {
     bcrypt.compare(req.query.email, req.query.token, (err, result) => {
         if (result){
             console.log(result)
         }
     })
    Account.updateOne({username: req.query.email}, { $set: { status: "verify" }}, (err, result) => {
        res.send("<script>alert(\"Xác thực email thành công\"); window.location.href = \"/auth/login\"; </script>");

    })
})


loginRoutes.get('/password/reset', (req, res) => {
    res.render('login/forgotPassword')
})
loginRoutes.post('/password/email', async (req, res ) => {
    if (!req.body.email) {
        res.redirect('/auth/password/reset')
    } else {
        const accResetPass = await Account.findOne({username: req.body.email})
        if (accResetPass == null){
            res.send("<script>alert(\"Email không tồn tại\"); window.location.href = \"/auth/password/reset\"; </script>");
        } else {
            bcrypt.hash(accResetPass.username, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedEmail) => {
                mailer.sendMail(accResetPass.username, "Đổi mật khẩu Web Chơi Nhạc Email", `<h4>Nhấn Vào Link Dưới Đây Để Chuyển Tiếp Tới Trang Đổi Mật Khẩu</h4>><br><a href="${process.env.APP_URL}/auth/password/reset/${accResetPass.username}?token=${hashedEmail}"> Reset Password </a>`)
                console.log(`${process.env.APP_URL}/password/reset/${accResetPass.username}?token=${hashedEmail}`);
            })
            res.send("<script>alert(\"Vui Lòng Kiểm Tra Email Để Lấy Lại Mật Khẩu\"); window.location.href = \"/auth/login\"; </script>");
        }
    }
});
loginRoutes.get('/password/reset/:email', (req, res ) => {
    if (!req.params.email || !req.query.token) {
        res.redirect('/password/reset')
    } else {
        res.render('login/newPasswordForm', { email: req.params.email, token: req.query.token})
    }
})
loginRoutes.post('/password/reset', (req,res) => {
    const { email, token, password } = req.body;
    console.log(email, token, password);
    if (!email || !token || !password) {
        res.redirect('/password/reset');
    } else {
        bcrypt.compare(email, token, (err, result) => {
            console.log('compare', result);
            if (result == true) {
                    Account.updateOne({username: email}, { $set: { password: password }}, (err, result) => {
                        if (!err) {
                            res.send("<script>alert(\"Đổi mật khẩu thành công\"); window.location.href = \"/auth/login\"; </script>");
                        } else {
                            res.send("/500/ERORR");
                        }
                    })
            } else {
                res.redirect('/password/reset');
            }
        })
    }
})


loginRoutes.get('/login/google', passport.authenticate('google', {scope: ['profile','email']}));
loginRoutes.get('/google/callback', passport.authenticate('google'), (req,res) => {
    res.send('you are authenticated')
})

export default loginRoutes