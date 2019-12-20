if(process.env.NODE_ENV === 'production')
{
module.exports={
    mongoURI:"mongodb+srv://anshuman_chaurasia:test123@cluster0-9nuyr.mongodb.net/todolistDB"
}
    console.log("Connected to databases");
}
else{
    module.exports={
        mongoURI:'mongodb://localhost/myapp'
    }
}
