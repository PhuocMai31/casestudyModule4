import {Schema, model} from "mongoose";

interface IAuthor {
    name: string
}
const authorSchema = new Schema<IAuthor>({
    name: String
})
const Author = model<IAuthor>('Author', authorSchema)
export {Author}