"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bug = void 0;
const mongoose_1 = require("mongoose");
const bugSchema = new mongoose_1.Schema({
    title: String,
    bugreport: String,
});
const Bug = (0, mongoose_1.model)('Bug', bugSchema);
exports.Bug = Bug;
//# sourceMappingURL=bug.model.js.map