var mongoose = require("mongoose");
const db_url = 'mongodb://127.0.0.1:27017/dbtest';
import {Schema, model} from "mongoose";
mongoose.set('strictQuery', true)
mongoose.connect(db_url)
    .then(() => {
        console.log('db_connected')
    }).catch( error => {
    console.log('db cnnection error: ', error.message)
});

interface IAccount {
    username: String,
    password: String
}


var Account = mongoose.model('account', new Schema({ username: String, password: String}, { collection : 'account' }));   // collection name;


const newaccount = new Account({ username: "Phuoccgmail1.com",password: "Phuocmai123"});
newaccount.save();
Account.find({}, function(err, data) { console.log(err, data, data.length);});