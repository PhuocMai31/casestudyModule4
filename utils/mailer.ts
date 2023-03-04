import * as nodeMailer from 'nodemailer';
import * as mailConfig1 from 'config/mail.config';
import * as dotenv from 'dotenv';
import * as process from "process";
dotenv.config();
// @ts-ignore
const mailConfig = require('../config/mail.config')

exports.sendMail = (to, subject, htmlContent) => {
    const transport = nodeMailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: mailConfig.USERNAME, // generated ethereal user
            pass: mailConfig.PASSWORD, // generated ethereal password
        },
    })
    const options = {
        from: mailConfig.FROM_ADDRESS,
        to: to,
        subject: subject,
        html: htmlContent
    }
    return transport.sendMail(options);
}
