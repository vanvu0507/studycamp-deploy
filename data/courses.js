const { number } = require('joi');
const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const coursesSchema = new mongoose.Schema({
    duration: {
        type: Number,
        required: true
    },
    section: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: [0, 'price must be positive'],
        required: true
    },
    images: [
        ImageSchema
    ],
    video: {
        type: String,
        // required: true
    },
    language: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    hearts : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'likes'
    }
],
    authors:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'admin_account'
        },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

const Courses = mongoose.model('Courses', coursesSchema);
module.exports = Courses;