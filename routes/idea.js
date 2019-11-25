const express=require('express');
const router=express.Router();
const mongoose=require("mongoose");
const {ensureAuthenticated}=require('../helpers/auth');

//load isea model
require("../models/idea")
const Idea=mongoose.model('ideas');

//show ideas 
router.get("/",ensureAuthenticated,function(req,res)
{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        
        res.render('ideas/index',{
           ideas:ideas
        });
        
    })
    .catch(err=>
        {
    res.status(500).send({
    message:err.message || "some error occures while retriving data."
     });
    }); 
   
});

//Add new ideas
router.get("/add",ensureAuthenticated,function(req,res)
{
    res.render('ideas/add');
});
//edit new ideas
router.get("/edit/:id",function(req,res)
{
    Idea.findOne({_id:req.params.id})
    .then(idea => {
      if(idea.user !=req.user.id)
      {
        req.flash('error_msg','Not Authorised');
        res.redirect('/ideas');
      }
      else
      {
        res.render('ideas/edit',{
            idea:idea
        });
      }
    })
  
});


router.post("/",ensureAuthenticated,function(req,res)
{
  let errors=[]
  if(!req.body.title)
  {
    errors.push({text:"Please add a title"})
  }
  if(!req.body.details)
  {
    errors.push({text:"Please add some details"})
  }
  if(errors.length >0)
  {
      res.render('ideas/add',{
        errors:errors,
        title:req.body.title,
        details:req.body.details
       
      })
  }
  else{
      
    const user={
        title:req.body.title,
        details:req.body.details,
        user:req.user.id
        }
        new Idea(user)
        .save()
        .then(user=>{
            req.flash('success_msg','video idea has been added');
           res.redirect('/ideas');
        });
  }
});

//edit idea form
router.put("/:id",ensureAuthenticated,(req,res)=>
{
    Idea.findOne({_id:req.params.id})
    .then(idea => {
       idea.title = req.body.title,
        idea.details = req.body.details
      idea.save()
      .then(idea => {
        req.flash('success_msg','video idea has been updated');
          res.redirect("/ideas");
      })
    })
     
});

 //delete
 router.delete("/:id",ensureAuthenticated,(req,res)=>{
     console.log("Idea")
    Idea.remove({_id:req.params.id})
    .then(idea => {
        req.flash('success_msg','video idea has been deleted');
        res.redirect("/ideas");
    })
})

module.exports=router;
