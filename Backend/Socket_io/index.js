const {Server} = require('socket.io');
const socketAuth = require('./middleware');
const socketHandler = require('./handlers/')
module.exports = (server)=>{

    const io = new Server(server,{
        cors:{
            origin:"*"
        }
    });
    socketAuth(io);

    io.on('connection',(socket)=>{
        socket.join(`user_${socket.user.id}`);
    });
}