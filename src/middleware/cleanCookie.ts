import * as qs from 'qs';
import {Router, Request, Response} from "express";
export const cleanCookie =  (req: Request, res: Response, next) => {
    let cookieObj = qs.parse(req.headers.cookie);
    let name = Object.keys(cookieObj)[0];
    res.clearCookie(name, { path: '/' });
    next();
}