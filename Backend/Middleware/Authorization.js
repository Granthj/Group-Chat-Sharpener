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
            req.user = null;
            req.auth = false;
            return;
        }
        else{
            req.user = decode.userId;
            req.auth = true;
            next();
        }
    }
    catch(err){
        return res.status(401).json({message:"Token is wrong"});
    }
}