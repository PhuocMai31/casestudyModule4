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
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const mongoose = __importStar(require("mongoose"));
const auth_router_1 = __importDefault(require("./src/router/auth.router"));
const product_router_1 = __importDefault(require("./src/router/product.router"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jwtauth_1 = require("./src/middleware/jwtauth");
const dotenv = __importStar(require("dotenv"));
const product_model_1 = require("./src/schemas/product.model");
const admin_router_1 = __importDefault(require("./src/router/admin.router"));
dotenv.config();
const port = 3000;
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use((0, cookie_parser_1.default)("12345"));
app.use(express_1.default.static('public'));
const db_url = 'mongodb://127.0.0.1:27017/dbtest';
mongoose.set('strictQuery', true);
mongoose.connect(db_url)
    .then(() => {
    console.log('db_connected2');
}).catch(error => {
    console.log('db cnnection error: ', error.message);
});
var connection = mongoose.connection;
app.use((0, express_session_1.default)({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(bodyParser.json());
app.use('/auth', auth_router_1.default);
app.use('/products', product_router_1.default);
app.use('/admin', admin_router_1.default);
app.get('/home', jwtauth_1.jwtauth, async (req, res) => {
    const item = await product_model_1.Item.find();
    res.render('home', { item: item });
});
app.listen(port, () => {
    console.log('app running on port ' + port);
});
//# sourceMappingURL=index.js.map