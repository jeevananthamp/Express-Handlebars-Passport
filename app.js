const express=require("express");
const path=require('path');
var exphbs  = require('express-handlebars');
const mongoose=require("mongoose");
const bodyparser=require('body-parser');
const flash=require('connect-flash');
const session=require('express-session');
const methodOverride = require('method-override')
const passport=require('passport');

const app=express();


let port=process.env.PORT || 3000;

//load routes

const ideas=require('./routes/idea');
const  users=require('./routes/user');

//paasport
require('./config/passport')(passport);


mongoose.Promise=global.Promise;

//DB import
const db=require('./config/database')
// Connecting to the database

mongoose.connect(db.mongoURI, {useNewUrlParser: true})
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

//body parser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//static folder
app.use(express.static(path.join(__dirname,'public')));

//method-override
app.use(methodOverride('_method'))

//session
app.use(session({
    secret:'thbs',
    resave:true,
    saveUninitialized:true
}))


app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//global variables

app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error =req.flash('error');
    res.locals.user = req.user || null;
  next()
});

//index
app.get("/",function(req,res)
{
    const title="Jeeva";
    res.render('index',{
        name:title
    });
});
//about
app.get("/about",function(req,res)
{
    res.render('about');
});



//use routes
app.use("/ideas",ideas);
app.use("/users",users);

app.listen(port,() =>{
    console.log(`Server started at port ${port}`);
})
