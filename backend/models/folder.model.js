const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const folderSchema = new Schema({
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("Folder", folderSchema)
