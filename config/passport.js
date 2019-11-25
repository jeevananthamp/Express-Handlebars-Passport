const LocalStrategy=require('passport-local').Strategy;

const mongoose=require("mongoose");
const bcrypt=require('bcryptjs');
//const passport=require('passport');

//load user model
//require("../models/User")
const User=mongoose.model('users');


module.exports=function(passport)
{
    passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
        User.findOne({ email:email})
        .then(user=>{
         if(!user)
         {
             return done(null,false,{message:'Sorry ! User does not exists!..'});
         }
      
             bcrypt.compare(password,user.password,(err,isMatch) =>{
                 if(err) throw err;
                 if(isMatch){
                     return done(null,user)
                 }
                 else{
                     return  done(null,false,{message:'Sorry ! Password does not Match!..'});
                 }
             })
         
        })
        
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}