import {Schema, model} from "mongoose";

interface IItem {
    name: string,
    singer: string,
    category: string,
    image: string,

    filename: string,
    usernameCreate: string,
    // playlist: object[],
    playlist1: object[]
}

// const playlistSchema = new Schema({
//     playlist: String
// })


const itemSchema = new Schema<IItem>({
    name: String,
    singer: String,
    category: String,
    image: String,
    filename: String,
    usernameCreate: String,
    // @ts-ignore
    playlist1: [{ type:Schema.Types.ObjectId, ref: "Playlist1" }] ,
    // playlist: [playlistSchema],
})
const Item = model<IItem>('Item', itemSchema);
export {Item}