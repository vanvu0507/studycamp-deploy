const express = require('express')
const route = express.Router()
const bcrypt = require('bcryptjs');
const multer  = require('multer');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });
const Admin = require('../data/admin');
const Courses = require('../data/courses');
const News = require('../data/news')
const User = require('../data/users');
const Review = require('../data/review');

route.use(express.urlencoded({extended: true}))

const categories = ['Kiến thức cơ sở','Lập trình nâng cao','Lập trình cơ sở','Giải quyết vấn đề','Kỹ năng nâng cao']
const pagesize = 3;

// test
route.get('/admin/users',async(req,res) => {
    const page = req.query.page
    if(page){
        page = parseInt(page)
        var skip = (page-1)*pagesize
    }
    const users = await User.find().skip(skip).limit(pagesize)
    res.json(users)
})

// hiển thị trang login admin
route.get('/admin/login', (req,res) => {
    res.render('admin/admin_login')
})

// hiển thị trang admin
route.get('/admin', async (req,res) => {
    if(req.session.admin_id){
       const id = req.session.admin_id
       const admin = await Admin.findById(id)
       res.render('admin/admin_index', {admin,categories});
    }
    else {
        res.redirect('/admin/login')
    }
})

// hiển thị trang quản lý
route.get('/admin/manage', async(req,res) => {
    if(req.session.admin_id) {
       const id = req.session.admin_id
       const admin = await Admin.findById(id)
       const courses = await Courses.find({})
       res.render('admin/admin_manage', {courses,admin});
    } else {
        res.redirect('/admin/login')
    }
})

// hiển thị trang edit
route.get('/admin/manage/:id/edit', async (req,res) => {
    if(req.session.admin_id) {
       const adminId = req.session.admin_id
       const admin = await Admin.findById(adminId)
       const course = await Courses.findById(req.params.id)
       res.render('admin/admin_edit', {course,admin,categories})
    } else {
        res.redirect('/admin/login')
    }
})

// hiển thị trang quản lý người dùng
route.get('/admin/manage/users', async(req,res) => {
    if(req.session.admin_id) {
        var page = req.query.page
        var userId = req.query.userId
        const adminId = req.session.admin_id
        const admin = await Admin.findById(adminId)
    if(page){
        page = parseInt(page)
        var skip = (page-1)*pagesize
    }
    if(userId) {
        var userReview = await Review.find({ author: userId}).populate('author').populate('course')
    }
        const users = await User.find().populate('userinformation').skip(skip).limit(pagesize)
        res.render('admin/admin_manage_users', {admin,users,userReview})
     } else {
         res.redirect('/admin/login')
     }
})

// hiển thị trang quản lý tin tức
route.get('/admin/news',async(req,res) => {
    if(req.session.admin_id) {
        const adminId = req.session.admin_id
        const admin = await Admin.findById(adminId)
        // const news = await News.findById(id)
        res.render('admin/admin_news', {admin})
     } else {
         res.redirect('/admin/login')
     }})

// xóa khóa học
route.delete('/courses/:id', async(req,res) => {
    const {id} = req.params
    await Courses.findByIdAndDelete(id)
    res.redirect('/admin/manage')
})

// cập nhật khóa học
route.put('/courses/:id',upload.array('image'), async (req,res) => {
    const {id} = req.params
    const course = await Courses.findByIdAndUpdate(id, req.body, {runValidators: true , new: true})
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    course.images.push(...images)
    await course.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await course.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    res.redirect(`/admin/manage`)
})

//upload tin tức
route.post('/admin/news',upload.single('image'),async(req,res) => {
    const news = new News(req.body)
    news.image.filename = req.file.filename
    news.image.url = req.file.path
    news.time = new Date()
    news.save()
    console.log(news.time)
    res.redirect('/admin/news')
    // console.log(req.file)
    // res.send('ok')
})

// upload khóa học
route.post('/courses',upload.array('image'), async(req,res) => {
    const newCourse = new Courses(req.body)
    newCourse.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCourse.authors = req.session.admin_id
    await newCourse.save()
    res.redirect('/admin/manage')
})

// xóa bình luận khóa học
route.post('/admin/manage/users/:userid/:userrv', async(req,res) => {
    const userid = req.params.userid
    await Review.findByIdAndDelete(req.params.userrv)
    await Courses.findByIdAndUpdate(req.params.userrv, {$pull : {reviews: req.params.userrv}})
    res.redirect(`/admin/manage/users?userId=${userid}`)
})

// xử lý đăng nhập
route.post('/admin', async(req,res) => {
    const {username,password} = req.body
    const admin = await Admin.findOne({username})
    if(admin) {
        const validPassword = await bcrypt.compare(password,admin.password)
        if(validPassword) {
            req.session.admin_id = admin._id;
            res.redirect('/admin')
        } else {
            req.flash('error','Sai tên đăng nhập hoặc mật khẩu')
            res.redirect('/admin/login')
        }
    } else {
        req.flash('error','Sai tên đăng nhập hoặc mật khẩu')
        res.redirect('/admin/login')
    }
})

// xử lý đăng xuất
route.post('/logout_admin', async(req,res) => {
    req.session.admin_id = null
    res.redirect('/admin/login')
})

module.exports = route