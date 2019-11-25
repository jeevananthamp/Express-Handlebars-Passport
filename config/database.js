if(process.env.NODE_ENV === 'production')
{
module.exports={
    mongoURI:'mongodb+srv://kitkat:thbs123@cluster0-din5z.mongodb.net/test?retryWrites=true&w=majority'
}
}
else{
    module.exports={
        mongoURI:'mongodb://localhost/myapp'
    }
}