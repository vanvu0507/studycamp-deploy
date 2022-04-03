const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:[true,'Username không được để trống'],
        unique: true
    },
    email: {
        type:String,
        required: [true,'Email không được để trống'],
        unique: true
    },
    userinformation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserInformation'
    }
})

userSchema.plugin(passportLocalMongoose)

const User =  mongoose.model('User',userSchema)
module.exports = User