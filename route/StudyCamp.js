const express = require('express')
const route = express.Router()
const Courses = require('../data/courses');
const News = require('../data/news');
const User = require('../data/users');
const MobileUser = require('../data/mobile_user')
const Review = require('../data/review');
const catchAsync = require('../util/catchAsync');
const methodOverride = require('method-override');
const { isLoggedIn, like } = require('../middleware');
const Ask = require('../data/ask');
const UserInformation = require('../data/user_information');
const Like = require('../data/likes');

route.use(methodOverride('_method'))

const categories = ['Kiến thức cơ sở','Lập trình nâng cao','Lập trình cơ sở','Giải quyết vấn đề','Kỹ năng nâng cao']


// hiển thị trang home
route.get('/home', async (req, res) => {
    if(req.session.userId) {
        const id = req.session.userId
        var user = await MobileUser.findById(id)  
    }
    const courses = await Courses.find({})
    const news = await News.find({})
    res.render('Studycamp/home',{courses,news,categories,user})
})

// hiển thị trang liên hệ
route.get('/contact', async(req,res) => {
    if(req.session.userId) {
        const id = req.session.userId
        var user = await MobileUser.findById(id)  
    }
    res.render('Studycamp/contact',{user})
})

// yêu thích
route.post('/home/:courseId',isLoggedIn,like, async(req,res) => {
    const id = req.session.userId
    const like = new Like({author : id})
    await like.save()
    const course = await Courses.findById(req.params.courseId)
    course.hearts.push(like._id)
    await course.save()
    res.redirect('/home')
})

// hiển thị trang thảo luận
route.get('/discuss',async(req,res) => {
    if(req.session.userId) {
        var user = await MobileUser.findById(req.session.userId)
    }
    console.log(req.query)
    if(req.query.tags){
        const asks = await Ask.find(req.query).populate({
            path : 'author',
            populate: {
                path: 'userinformation'
            }
        })
        res.render('Studycamp/discuss',{asks,user})
    }else{
        const asks = await Ask.find().populate({
            path : 'author',
            populate: {
                path: 'userinformation'
            }
        })
        res.render('Studycamp/discuss',{user,asks})
    }
})

// hiển thị trang up câu hỏi
route.get('/discuss/ask', async(req,res) => {
    if(req.session.userId) {
        var user = await MobileUser.findById(req.session.userId)
    }
    res.render('Studycamp/ask',{user}) 
})

// hiển thị trang chi tiết câu hỏi
route.get('/discuss/review/:reviewId', catchAsync(async(req,res) => {
    if(req.session.userId) {
        const id = req.session.userId
        var user = await MobileUser.findById(id)
    }
    const ask = await Ask.findById(req.params.reviewId).populate('author').populate({
        path : 'review',
        populate : {
            path: 'author',
            populate: {
                path: 'userinformation'
            }
        }
    })
    res.render('Studycamp/user_discuss',{ask,user})
}))

// hiển thị trang tìm kiếm
route.get('/search', async (req,res) => {
    if(req.session.userId) {
        const id = req.session.userId
        var user = await MobileUser.findById(id)  
    }                                                           
    const language = req.query
    console.log(language)
    const searchLanguage = await Courses.find(language)
    res.render('Studycamp/search', {searchLanguage,user})          
})

// hiển thị kết quả tìm kiếm câu hỏi
route.get('/discuss/searchResult',catchAsync(async(req,res) => {
    if(req.session.userId) {
        const id = req.session.userId
        var user = await MobileUser.findById(id)  
    }
    const convertToLower = '#' + req.query.tags.toLowerCase()
    const asks = await Ask.find({tags: convertToLower}).populate({
        path : 'author',
        populate: {
            path: 'userinformation'
        }
    })
    console.log(req.query)
    res.render('Studycamp/discuss',{asks,user})
}))

// hiển thị trang sản phẩm khóa học
route.get('/courses', async (req,res) => {
    if(req.session.userId) {
        const id = req.session.userId
        var user = await MobileUser.findById(id)  
    }
    const courses = await Courses.find({})
    res.render('Studycamp/course_show',{courses,user})
})

// hiển thị trang chi tiết khóa học
route.get('/courses/:id', async(req,res) => {
    if(req.session.userId) {
        const id = req.session.userId
        var user = await MobileUser.findById(id)  
    }
    const {id} = req.params;
    const detailcourse = await Courses.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
            populate: {
                path: 'userinformation'
            }
        }
    }).populate('authors')
    console.log(detailcourse)
    res.render('Studycamp/course_detail',{detailcourse,user})
})

// hiển thị trang quản lý tài khoản
route.get('/manage_account',catchAsync(async(req,res) => {
    if(req.session.userId) {
        const user = await MobileUser.findById(req.session.userId).populate('userinformation')
        // const userinfor = await UserInformation.findOne({author:user._id})
        res.render('Studycamp/manage_account',{user})
    } else {
        res.redirect('/home')
    }
}))

module.exports = route

