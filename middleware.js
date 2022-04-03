const ExpressError = require('./util/ExpressError')
const { askSchema,reviewSchema } = require('./schemas');
const Ask = require('./data/ask');
const Courses = require('./data/courses')
const Review = require('./data/review')
const DiscussReview = require('./data/discuss_review');
const Like = require('./data/likes');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateAsk = (req, res, next) => {
    const { error } = askSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req,res,next) => {
    const ask = await Ask.findById(req.params.askId)
    if(!ask.author.equals(req.user._id)) {
        req.flash('error','Bạn không có quyền xóa bài đăng này')
        res.redirect(`/discuss/review/${ask._id}`)
    } else {
        next()
    }
}

module.exports.isAuthorAskReview = async (req,res,next) => {
    const ask = await Ask.findById(req.params.askId)
    const rvId = await DiscussReview.findById(req.params.reviewId)
    if(!req.user) {
        req.flash('error','Bạn cần đăng nhập để thực hiện hành động này')
        res.redirect(`/discuss/review/${ask._id}`)
    }
    if(!rvId.author.equals(req.user._id)) {
        req.flash('error','Bạn không có quyền xóa bình luận này')
        res.redirect(`/discuss/review/${ask._id}`)
    } else {
        next()
    }
}

module.exports.isAuthorCourseReview = async(req,res,next) => {
    const course = await Courses.findById(req.params.id)
    const courseRV = await Review.findById(req.params.reviewId)
    if(!req.user) {
        req.flash('error','Bạn cần đăng nhập để thực hiện hành động này')
        res.redirect(`/courses/${course._id}`)
    }
    if(!courseRV.author.equals(req.user._id)) {
        req.flash('error','Bạn không có quyền xóa bình luận này')
        res.redirect(`/courses/${course._id}`)
    } else {
        next()
    }
}

module.exports.like = async(req,res,next) => {
    const course = await Courses.findById(req.params.courseId).populate('hearts')
    for(let heart of course.hearts) {
        console.log(heart.author,req.user._id)
        if(heart.author.equals(req.user._id)) {
            await Courses.findByIdAndUpdate(course._id, { $pull : { hearts: heart}})
            await Like.findOneAndDelete({author: heart.author})
        }
    }
    next()
}
