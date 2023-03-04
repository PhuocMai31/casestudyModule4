import mongoose, {Schema, model} from "mongoose";

interface IAccount {
    username: String,
    password: String,
    role: "user",
    google_id: String,
    status: String
}


var Account = mongoose.model('account', new Schema({ username: String, password: String, role: String, google_id: String, status: String
}, { collection : 'account' }));   // collection name;

export {Account}

