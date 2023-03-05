"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    name: String,
    singer: String,
    category: String,
    image: String,
    filename: String,
    usernameCreate: String,
    playlist1: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Playlist1" }],
});
const Item = (0, mongoose_1.model)('Item', itemSchema);
exports.Item = Item;
//# sourceMappingURL=product.model.js.map