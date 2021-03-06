const mongoose = require('mongoose')

const discussRVSchema = new mongoose.Schema({
    body: String,
    date: Date,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MobileUser'
    }
})

const DiscussReview = mongoose.model('DiscussReview',discussRVSchema)

module.exports = DiscussReview