"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = require("mongoose");
const playlistSchema = new mongoose_1.Schema({
    playlist: String
});
const itemSchema = new mongoose_1.Schema({
    name: String,
    singer: String,
    category: String,
    image: String,
    filename: String,
    usernameCreate: String,
    playlist: [playlistSchema],
});
const Item = (0, mongoose_1.model)('Item', itemSchema);
exports.Item = Item;
//# sourceMappingURL=product.model.js.map