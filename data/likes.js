const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MobileUser'
    }
})

const Like = mongoose.model('likes',likeSchema)

module.exports = Like