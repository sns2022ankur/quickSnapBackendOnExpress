const mongoose = require('mongoose')


const folderSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    folderName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

var FolderModel = mongoose.model('folders',folderSchema)
module.exports = FolderModel