const express=require('express');
const router=express.Router();
const mongoose=require("mongoose");
const bcrypt=require('bcryptjs');
const passport=require('passport');

//load user model
require("../models/User")
const User=mongoose.model('users');


//user login route
router.get("/login",(req,res)=>
{
    res.render('users/login');
});
//user register route
router.get("/register",(req,res)=>
{
    res.render('users/register');
});
//login form post
router.post("/login",(req,res,next)=>
{
  passport.authenticate('local',{
    successRedirect:'/ideas',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);
});
//register form post
router.post("/register",(req,res)=>
{
    
  let errors=[]
  if(req.body.password != req.body.password2)
  {
    errors.push({text:"Password does not match with ConfirmPassword"})
  }
  if(req.body.password.length <4)
  {
    errors.push({text:"Password must be minimum 5 chars"})
  }
  if(errors.length >0)
  {
      res.render('users/register',{
        errors:errors,
        name:req.body.name,
        email:req.body.email
      })
  }
  else{
      User.findOne({email:req.body.email})
      .then(user=>{
          if(user)
          {
            req.flash('error_msg','Email already exists !.... Try another one');
            res.redirect("/users/login");
          }
          else{

            const user=new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
                })
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(user.password,salt,(err,hash)=>
                    {
                       if(err) throw err;
                       user.password = hash;
                       console.log(hash);
                       user.save()
                       .then(user=>{
                           req.flash('success_msg','Registred successfully and now you can login');
                          res.redirect('/users/login');
                       })
                       .catch(err=>{
                           console.log(err)
                           return;
                       })
                       
                    })
                })
          }
      })
   
       // console.log(user)
     // res.send("pass");
  }
})

router.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success_msg','You are logged out Successfully');
  res.redirect('/users/login');

})
module.exports=router;
