const express = require('express')
const route = express.Router()
const passport = require('passport');
const catchAsync = require('../util/catchAsync');
const { reviewSchema } = require('../schemas');
const Ask = require('../data/ask');
const User = require('../data/users');
const ExpressError = require('../util/ExpressError');
const Courses = require('../data/courses');
const Review = require('../data/review');
const DiscussReview = require('../data/discuss_review')
const { isLoggedIn,validateAsk, isAuthor, isAuthorAskReview, isAuthorCourseReview } = require('../middleware');
const UserInformation = require('../data/user_information');


route.use(express.urlencoded({extended: true}))



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// hiển thị trang đăng ký
route.get('/register', (req,res) => {
    res.render('User/register')
})

route.get('/login', (req,res) => {
    res.render('User/login')
})


const categories = ['Kiến thức cơ sở','Lập trình nâng cao','Lập trình cơ sở','Giải quyết vấn đề','Kỹ năng nâng cao']


// xử lý đăng ký
route.post('/register', catchAsync( async(req,res) => {
    try {
    const {username,email,password} = req.body
    const user = new User({username,email})
    const newUser = await User.register(user,password)
    const userinfo = new UserInformation({author: newUser._id})
    await userinfo.save()
    req.login(newUser, err => {
        if(err) return next(err)
        req.flash('success','đăng ký thành công !')
        res.redirect('/home')
    })
    } catch(e) {
      req.flash('error', e.message)
      res.redirect('/register')
    }
}))

// xử lý đăng nhập
route.post('/login',passport.authenticate('local', { failureFlash: true , failureRedirect: '/login'}), async (req,res) => {
    req.flash('success','welcome back')
    res.redirect('/discuss')
})

// xử lý đăng xuất
route.post('/logout', (req,res) => {
    req.logout()
    res.redirect('/home')
})

// upload bình luận khóa học
route.post('/courses/:id',isLoggedIn,validateReview, catchAsync(async(req,res) => {
    const course = await Courses.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    review.course = course._id
    course.reviews.push(review)
    await review.save()
    await course.save()
    res.redirect(`/courses/${course._id}`)
}))

// Xóa bình luận khóa học
route.delete('/courses/:id/:reviewId',isAuthorCourseReview, catchAsync(async(req,res) => {
    const {id,reviewId} = req.params
    await Courses.findByIdAndUpdate(id, { $pull: { reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/courses/${id}`)
}))

// upload câu hỏi
route.post('/discuss',isLoggedIn,validateAsk, catchAsync(async(req,res,next) => {
    const newAsk = new Ask(req.body.ask)
    newAsk.author = req.user._id
    newAsk.save()
    console.log('đã đăng !')
    res.redirect('/discuss')
}))

// Xóa câu hỏi
route.delete('/discuss/review/:askId',isAuthor,catchAsync(async(req,res) => {
    await Ask.findByIdAndDelete(req.params.askId)
    res.redirect('/discuss')
}))

// upload bình luận câu hỏi
route.post('/discuss/review/:askId',isLoggedIn,catchAsync(async(req,res) => {
    const newDiscussRV = new DiscussReview(req.body.DiscussReview)
    newDiscussRV.author = req.user._id
    await newDiscussRV.save()
    const ask = await Ask.findById(req.params.askId)
    ask.review.push(newDiscussRV._id)
    await ask.save()
    console.log('Đã đăng !')
    res.redirect(`/discuss/review/${ask._id}`)
}))

// Xóa bình luận câu hỏi
route.delete('/discuss/review/:reviewId/:askId',isAuthorAskReview,catchAsync(async(req,res) => {
    const { reviewId , askId } = req.params
    await Ask.findByIdAndUpdate(askId, { $pull: { review: reviewId}})
    await DiscussReview.findByIdAndDelete(reviewId)
    res.redirect(`/discuss/review/${askId}`)
}))

// Upload thông tin người dùng
route.put('/manage_account/:author',catchAsync(async(req,res) => {
    const userinfor = await UserInformation.findOneAndUpdate(req.params,req.body)
    const user = await User.findById(req.user._id)
    user.userinformation = userinfor._id
    user.save()
    res.redirect('/manage_account')
}))

module.exports = route