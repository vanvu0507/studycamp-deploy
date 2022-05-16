const express = require('express')
const route = express.Router()
const bcrypt = require('bcryptjs');
const MobileUser = require('../data/mobile_user')
const Courses = require('../data/courses');
const { isMobileLoggedIn} = require('../middleware')

/// login study camp app
route.post('/loginapp', async(req,res) => {
    const username = req.body.username
    MobileUser.findOne({username: username}).populate({
        path: 'userinformation'
    })
    .then(user => {
        if(!user) {
            return res.status(404).json({message: 'user not found'})
        } else  {
            // password hash
            bcrypt.compare(req.body.password, user.password, (err, compareRes) => {
                if(err) { //error while comparing
                    res.status(502).json({message: 'error while checking user password'})
                } else if (compareRes) { //password hash
                    // const token = jwt.sign({username: req.body.username}, process.env.ACCESS_TOKEN_SECRET , { expiresIn: '1m'})
                    req.session.mobileUserId = user._id
                    res.status(200).json({message: "user logged in",user})
                } else { // password doesnt match
                    res.status(401).json({message: "invalid credentials"});
                }
            })
        }
    })
    .catch(err => {
        console.log('error', err)
    })

})

// logout app
route.post('/logoutapp', (req,res) => {
    req.session.destroy()
    res.sendStatus(200)
})

// fetch api user
route.get('/userinformation/:id',isMobileLoggedIn, async(req,res) => {
    const user = await (await MobileUser.findById(req.params.id)).populate({
        path: 'userinformation'
    })
    res.status(200).json(user)
})

// tìm kiếm khóa học trên app
route.get('/course/:text', async(req,res) => {
    const text  = req.params.text
    const txt = text.slice(0,1).toUpperCase() + text.slice(1).toLowerCase()
    const courses = await Courses.find({title: { $regex: `^${txt}` } }).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    res.status(200).json({message: 'các khóa học liên quan', courses})
})

module.exports = route