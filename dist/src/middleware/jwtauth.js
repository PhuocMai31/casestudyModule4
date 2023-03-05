"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtauth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const jwtauth = async (req, res, next) => {
    try {
        var cookies = cookie_1.default.parse(req.headers.cookie || '');
        let accessToken = cookies.name;
        if (accessToken) {
            jsonwebtoken_1.default.verify(accessToken, "123456789", (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        message: err.message,
                        status: 401
                    });
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else {
            return res.status(401).json({
                message: 'No token provided',
                status: 401
            });
        }
    }
    catch (err) {
        return res.status(401).json({
            message: err.message,
            status: 401
        });
    }
};
exports.jwtauth = jwtauth;
//# sourceMappingURL=jwtauth.js.map