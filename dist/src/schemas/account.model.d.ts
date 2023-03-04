import mongoose from "mongoose";
declare var Account: mongoose.Model<{
    username?: string;
    password?: string;
    role?: string;
    google_id?: string;
    status?: string;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.ResolveSchemaOptions<{
    collection: string;
}>, {
    username?: string;
    password?: string;
    role?: string;
    google_id?: string;
    status?: string;
}>>;
export { Account };
