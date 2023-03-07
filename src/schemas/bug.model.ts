import {Schema, model} from "mongoose";

interface IBug {
    title: string,
    bugreport: string,
}
const bugSchema = new Schema<IBug>({
    title: String,
    bugreport: String,
})
const Bug = model<IBug>('Bug', bugSchema)
export {Bug}