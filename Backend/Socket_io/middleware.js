const jwt = require('jsonwebtoken');
module.exports = (io)=>{

    io.use(async (socket,next)=>{
    
    try{
            const token = socket.handshake.auth.token;
    
            if(!token){
                next(new Error('Token is missing in socket handshake'));
            }
    
            const decode = jwt.verify(token,'chat-userId');
    
            socket.user = decode.user;
            socket.auth = true;

            next();
        }
        catch(err){
            return next(new Error("Token is missing from socket"));
        }
    });

    return io;
}