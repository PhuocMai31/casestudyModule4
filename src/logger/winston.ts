import winston from "winston";
import { join } from 'path';

export const logger = winston.createLogger({
    format: winston.format.combine(
        //??
        winston.format.splat(),
        // Địng dạng time cho log
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
    //     Thêm màu sắc
        winston.format.colorize(),
    //    ĐỊng dạng của log
        winston.format.printf(
            log=>{
            //    nếu log là ERORR thì hiển thị dạng stack trace còn không thì hiển thị mesage của log
                if(log.stack) {return `[${log.timestamp}] [${log.level}] ${log.stack}`}
                else {return `[${log.timestamp}] [${log.level}] ${log.message}`}
            }
        ),
    ), transports: [
        // hiển thị log thông qua console
        new winston.transports.Console(),
    //    thiết lập ghi log vào file
        new winston.transports.File({
            dirname: join(__dirname, '../../../var/log/'),
            filename: 'error.log',
            level: 'error',
        })
    ]
})