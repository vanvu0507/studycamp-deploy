const Admin = require('./data/admin');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/WebCSKT', { useNewUrlParser: true, useUnifiedTopology: true })

const admin1 = {
        username: 'VanVu0705',
        password: '123123'
}

const admin2 = {
        username: 'Admin',
        password: '123456'
}

const hashPw = async (pw,admin) => { 
    const hashed = await bcrypt.hash(pw,12)
    admin.password = hashed
    Admin.insertMany(admin).then(account => {
        console.log(account)
  }).catch(e => {
      console.log(e)
  })
}

hashPw(admin1.password,admin1)
hashPw(admin2.password,admin2)




