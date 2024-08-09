const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    userId: { type: String, required: true },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder' },
    codeSnippet: { type: String, default: '' },
    selectedLanguage: { type: String, default: 'python' },
    isPinned: { type: Boolean, default: false },
    createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("Note", noteSchema)