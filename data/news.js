const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    },
    description: {
        type: String,
        required: true
    },
    time: {
        type: Date,
    }
})

const  News = mongoose.model('News', newsSchema);
module.exports = News;