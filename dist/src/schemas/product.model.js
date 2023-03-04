"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = require("mongoose");
const keywordsSchema = new mongoose_1.Schema({
    keyword: String
});
const itemSchema = new mongoose_1.Schema({
    name: String,
    price: Number,
    producer: String,
    avatar: String,
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "Author" },
    keywords: [keywordsSchema],
});
const Item = (0, mongoose_1.model)('Item', itemSchema);
exports.Item = Item;
//# sourceMappingURL=product.model.js.map