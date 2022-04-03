const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const adminSchema = new mongoose.Schema({
    username: {
        type:String,
        required: [true,'Tài khoản không được để trống']
    },
    password: {
        type:String,
        required: [true,'Mật khẩu không được để trống']
    }
})

adminSchema.plugin(passportLocalMongoose)

const Admin =  mongoose.model('admin_account',adminSchema)
module.exports = Admin