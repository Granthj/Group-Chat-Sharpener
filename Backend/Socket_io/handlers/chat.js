
module.exports = (socket,io)=>{

    socket.on("chat-message",(message)=>{
        console.log("user")
        io.emit("chat-message",{})
    });
}