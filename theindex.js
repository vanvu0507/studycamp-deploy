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

const dbUrl = process.env.DB_URL || 'mongodb+srv://vanvu572:345712@cluster0.41n8n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
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

const port = process.env.PORT || 3457
app.listen(port, () => {
    console.log(`APP IS LISTENING ON PORT ${port}!`)
})

