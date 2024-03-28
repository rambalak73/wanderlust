if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}
// express setup
const express = require('express');
const app = express();
const { connection } = require('./modals/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/error.js');
const reviews = require('./routes/review.js');
const listing = require('./routes/listing.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passprtLocal= require('passport-local')
const passport= require('passport')
const User = require('./modals/User.js');
const UserRouter = require('./routes/User.js');
// connect to mongo db
// const url = "mongodb://localhost/wonderlust";
const dbUrl = process.env.AtlasDb_Url;

connection(dbUrl);


app.use(express.urlencoded({ extended: 'true' })) //get form body(data) into express
app.set("view engine", "ejs");  //template engine
app.set("views", path.join(__dirname, "views"))
app.use(methodOverride("_method"));  //convert method request of form (override method request)
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const store= MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:3600*24,
   });
   store.on('error',()=>{
    console.log("Error in mongo session");
   })

const sessioOption = {
    store,
    secret:process.env.SECRET,
    resave : false,
    saveUninitialized:true,
    cookie : {
        expires:Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}

app.use(session(sessioOption));
app.use(flash());


// Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passprtLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser=req.user;
    next();
});


app.use('/listing',listing)
app.use('/listing/:id/review',reviews);
app.use('/', UserRouter);

app.all('*', (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message } = err;
    res.render('listings/error.ejs', { message });
})
app.listen(8080);