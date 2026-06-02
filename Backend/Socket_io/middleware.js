const jwt = require('jsonwebtoken');
module.exports = (io)=>{

    io.use(async (socket,next)=>{
    
    try{
            // console.log('socket middleware called');
            const token = socket.handshake.auth.token;
            // console.log(socket.handshake.auth);
            if(!token){
                return next(new Error('Token is missing in socket handshake'));
            }
    
            const decode = jwt.verify(token,'chat-user');
    
            socket.user = decode.data.userId;
            socket.auth = true;

            next();
        }
        catch(err){
            return next(new Error("Token is missing from socket"));
        }
    });

    return io;
}