const mongoose = require('mongoose')
const review = require('./review')

const askSchema = mongoose.Schema({
     topic: String,
     tags: String,
     content: String,
     author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MobileUser'
     },
     review: [
          {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'DiscussReview'
     }
]
})

const Ask = mongoose.model('asks', askSchema)
module.exports = Ask