import {Schema, model} from "mongoose";
interface IPlaylist1 {
    name: string
    musicList: object[]
}
const playlist1Schema = new Schema<IPlaylist1>({
    name: String,
    musicList: [{ type:Schema.Types.ObjectId, ref: "Item" }]
})
const Playlist1 = model<IPlaylist1>('Playlist1', playlist1Schema);



export { Playlist1 };