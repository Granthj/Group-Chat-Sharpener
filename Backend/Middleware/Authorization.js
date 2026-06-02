const jwt = require('jsonwebtoken');

const Auth = async (req,res,next)=>{
    // console.log("auth middleware called");
    try{

        const header = req.header('Authorization');

        if(!header){
            return res.status(401).json({message:'No token found'});
        }
        const token = header.split(' ')[1];
        // console.log(token,'token middleware');
        const decode = jwt.verify(token,'chat-user');
        // console.log(decode,'decode middleware');
        if(!decode){
            req.userId = null;
            req.username = null;
            req.useremail = null;
            req.auth = false;
            return;
        }
        else{
            req.userId = decode.data.userId;
            // console.log(req.userId,"auth middleware");
            req.username = decode.data.username;
            req.useremail = decode.data.useremail;
            req.auth = true;
            next();
        }
    }
    catch(err){
        return res.status(401).json({message:"Token is wrong"});
    }
}

module.exports = Auth;