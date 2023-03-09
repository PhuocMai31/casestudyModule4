"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    name: String,
    theoretical: Number,
    practice: Number,
    average: Number,
    description: String,
    evaluate: String,
    class: String,
});
const Item = (0, mongoose_1.model)('Item', itemSchema);
exports.Item = Item;
//# sourceMappingURL=product.model.js.map