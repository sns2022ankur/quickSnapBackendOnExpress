const mongoose = require('mongoose')


const imageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    folder: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

var ImageModel = mongoose.model('images',imageSchema)
module.exports = ImageModel