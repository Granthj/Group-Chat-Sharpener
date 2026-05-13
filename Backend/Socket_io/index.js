const {Server} = require('socket.io');
const socketAuth = require('./middleware');
module.exports = (server)=>{

    const io = new Server(server,{
        cors:{
            origin:"*"
        }
    });
    socketAuth(io);

    io.on('connection',(socket)=>{

    });
}