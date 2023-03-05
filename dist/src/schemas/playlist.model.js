"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist1 = void 0;
const mongoose_1 = require("mongoose");
const playlist1Schema = new mongoose_1.Schema({
    name: String,
    musicList: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Item" }]
});
const Playlist1 = (0, mongoose_1.model)('Playlist1', playlist1Schema);
exports.Playlist1 = Playlist1;
//# sourceMappingURL=playlist.model.js.map