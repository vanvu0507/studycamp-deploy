const express = require('express')
const route = express.Router()
const passport = require('passport');
const bcrypt = require('bcryptjs');
const catchAsync = require('../util/catchAsync');
const { reviewSchema } = require('../schemas');
const Ask = require('../data/ask');
const User = require('../data/users');
const MobileUser = require('../data/mobile_user')
const ExpressError = require('../util/ExpressError');
const Courses = require('../data/courses');
const Review = require('../data/review');
const DiscussReview = require('../data/discuss_review')
const { isLoggedIn,validateAsk, isAuthor, isAuthorAskReview, isAuthorCourseReview, isMobileLoggedIn,} = require('../middleware');
const UserInformation = require('../data/user_information');
const jwt = require('jsonwebtoken')



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
    const user = req.body
    const validEmail = await MobileUser.findOne({email: user.email})
    const validUsername = await MobileUser.findOne({username: user.username})
    console.log(validEmail,validUsername)
    if(validEmail == null && validUsername == null) {
    const hashedPw = await bcrypt.hash(user.password,12)
    user.password = hashedPw
    const newUser = new MobileUser(user)
    await newUser.save()
    const userinfo = new UserInformation({author: newUser._id})
    await userinfo.save()
    req.session.userId = newUser._id
    res.status(200).redirect('/discuss')
} else {
        req.flash('error', 'tên email hoặc tên tài khoản đã được đăng ký')
        res.redirect('/register')
}
}))

// xử lý đăng nhập
route.post('/login',async (req,res) => {
    const {username,password} = req.body
    const user = await MobileUser.findOne({username})
    if(user) {
        const validPassword = await bcrypt.compare(password,user.password)
        if(validPassword) {
            req.session.userId = user._id;
            res.redirect('/home')
        } else {
            req.flash('error','Sai tên đăng nhập hoặc mật khẩu')
            res.redirect('/login')
        }
    } else {
        req.flash('error','Sai tên đăng nhập hoặc mật khẩu')
        res.redirect('/login')
    }
})

// xử lý đăng xuất
route.post('/logout', (req,res) => {
    req.session.destroy()
    res.redirect('/home')
})

// upload bình luận khóa học
route.post('/courses/:id',isLoggedIn,validateReview, catchAsync(async(req,res) => {
    const course = await Courses.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.session.userId
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
    newAsk.author = req.session.userId
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
    console.log(req.body)
    const newDiscussRV = new DiscussReview(req.body.DiscussReview)
    newDiscussRV.author = req.session.userId
    const ask = await Ask.findById(req.params.askId)
    ask.review.push(newDiscussRV._id)
    await ask.save()
    await newDiscussRV.save()
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
    const user = await MobileUser.findById(req.session.userId)
    user.userinformation = userinfor._id
    user.save()
    res.redirect('/manage_account')
}))

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

// // logout app
// route.post('/logoutapp', (req,res) => {
//     req.session.destroy()
//     res.sendStatus(200)
// })

// // fetch api user
// route.get('/userinformation/:id',isMobileLoggedIn, async(req,res) => {
//     const user = await (await MobileUser.findById(req.params.id)).populate({
//         path: 'userinformation'
//     })
//     res.status(200).json(user)
// })

// // tìm kiếm khóa học trên app
// route.get('/course/:text', async(req,res) => {
//     const text  = req.params.text
//     const txt = text.slice(0,1).toUpperCase() + text.slice(1).toLowerCase()
//     const courses = await Courses.find({title: { $regex: `^${txt}` } }).populate({
//         path: 'reviews',
//         populate: {
//             path: 'author'
//         }
//     })
//     res.status(200).json({message: 'các khóa học liên quan', courses})
// })

// function authenToken (req, res, next) {
//     // 'Beaer [token]'
//     const token = req.headers.authorization.split(' ')[1]
//     if (!token) res.sendStatus(401);
  
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
//       console.log(err, data);
//       if (err) res.sendStatus(403);
//       next();
//     });
//   }

module.exports = route