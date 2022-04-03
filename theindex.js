if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash')
const  mongoose  = require("mongoose");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const studycampRout = require('./route/StudyCamp');
const userRout = require('./route/user');
const adminRout = require('./route/admin');
const User = require('./data/users');
const ExpressError = require('./util/ExpressError')
const MongoDBStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/WebCSKT'
const secret = process.env.SECRET || 'notagoodsecret';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
        console.log("MONGO CONNECTION SUCCESSFULLY !!");
    }).catch (error => {
        console.log("MONGO CONNECTION ERROR !!")
        console.log(error)
    });

//Serves all the request which includes /images in the url from Images folder
app.use('/uploads', express.static(__dirname + '/uploads'));
app.set('data',path.join(__dirname,'/data'))
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(session({
    store: MongoDBStore.create({
        mongoUrl: dbUrl,
        secret,
        touchAfter: 24 * 60 * 60}),
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

app.use(flash())

// cấu hình passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/',studycampRout)
app.use('/',userRout)
app.use('/',adminRout)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use(async(err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    const user = await User.find(req.user)
    res.status(statusCode).render('error', { user,err })
})

app.listen(3457, () => {
    console.log('APP IS LISTENING ON PORT 3457!')
})
