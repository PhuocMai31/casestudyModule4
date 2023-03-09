import {Schema, model} from "mongoose";

interface IItem {
    name: string,
    singer: string,
    category: string,
    image: string,

    filename: string,
    theoretical : number,
    practice : number,
    average: number,
    description: string,
    evaluate: string,
    class: string,
    // playlist: object[],
    playlist1: object[]
}

// const playlistSchema = new Schema({
//     playlist: String
// })


const itemSchema = new Schema<IItem>({
    name: String,
    theoretical : Number,
    practice : Number,
    average: Number,
    description: String,
    evaluate: String,
    class: String,
    // @ts-ignore

})
const Item = model<IItem>('Item', itemSchema);
export {Item}