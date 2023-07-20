const mongoose = require('mongoose')


const tokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
})

var TokenModel = mongoose.model('tokens',tokenSchema)
module.exports = TokenModel