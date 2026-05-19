const jwt = require('jsonwebtoken');

const Auth = async (req,res,next)=>{

    try{

        const header = req.header('Authorization');

        if(!header){
            return res.status(401).json({message:'No token found'});
        }
        const token = header.split(' ')[1];

        const decode = jwt.verify(token,'chat-user');

        if(!decode){
            req.userId = null;
            req.username = null;
            req.useremail = null;
            req.auth = false;
            return;
        }
        else{
            req.userId = decode.user.userId;
            req.username = decode.user.username;
            req.useremail = decode.user.useremail;
            req.auth = true;
            next();
        }
    }
    catch(err){
        return res.status(401).json({message:"Token is wrong"});
    }
}