
// Import package
// @ts-ignore
import express from 'express';
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import loginRoutes from "./src/router/auth.router";
import productRouter from "./src/router/product.router";
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import {jwtauth} from "./src/middleware/jwtauth";
import mailer from 'express-mailer';
import * as dotenv from 'dotenv';
import path from "path";
import {Item} from "./src/schemas/product.model";

import adminRouter from "./src/router/admin.router";
dotenv.config();


// Connect Database
const port = 3000;
const app = express();
app.set('view engine', 'ejs');
app.set('views','./src/views');
app.use(cookieParser("12345"));
app.use(express.static('public'))
const db_url = 'mongodb://127.0.0.1:27017/dbtest1';
mongoose.set('strictQuery', true)
mongoose.connect(db_url)
    .then(() => {
        console.log('db_connected2')
    }).catch( error => {
    console.log('db cnnection error: ', error.message)
});
var connection = mongoose.connection;

// Set và use chức năng đã import
app.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

app.use('/', productRouter);

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

app.listen(port, () => {
    console.log('app running on port '+ port)
})
