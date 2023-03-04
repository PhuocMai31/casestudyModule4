import {Schema, model} from "mongoose";

interface IItem {
    name: string,
    price: number,
    producer: string,
    avatar: string,
    author: string,
    keywords: object[]
}

const keywordsSchema = new Schema({
    keyword: String
})

const itemSchema = new Schema<IItem>({
    name: String,
    price: Number,
    producer: String,
    avatar: String,
// @ts-ignore
    author: { type:Schema.Types.ObjectId, ref: "Author" },
    keywords: [keywordsSchema],
})
const Item = model<IItem>('Item', itemSchema);
export {Item}