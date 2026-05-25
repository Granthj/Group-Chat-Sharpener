
module.exports = (socket,io)=>{

    socket.on("sendGroup-message",(message)=>{
        
        
        io.emit("chat-message",{})
    });
}