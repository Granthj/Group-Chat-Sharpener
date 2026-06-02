const {Server} = require('socket.io');
const socketAuth = require('./middleware');
const socketHandlerPersonalChat = require('./handlers/personalChat');
const socketHandlerGroupChat = require('./handlers/groupChat');
module.exports = (server)=>{

    const io = new Server(server,{
        cors:{
            origin:"*"
        }
    });
    socketAuth(io);

    io.on('connection',(socket)=>{
        socket.join(`user_${socket.user.id}`);
        socketHandlerPersonalChat(socket,io);
        socketHandlerGroupChat(socket,io);
    });
}