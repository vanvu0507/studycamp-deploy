const mongoose = require('mongoose')

const userInforSchema = new mongoose.Schema({
    image: String,
    ten : String,
    dob : {
        type: mongoose.Schema.Types.Date
    },
    tel : Number,
    city: String,
    author: {
        type: mongoose.Schema.Types.ObjectId
    }
})

const UserInformation = mongoose.model('UserInformation',userInforSchema)

module.exports = UserInformation