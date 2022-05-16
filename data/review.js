const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
       type: Schema.Types.ObjectId,
       ref: 'MobileUser'
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Courses'
    } 
});

module.exports = mongoose.model("Review", reviewSchema);