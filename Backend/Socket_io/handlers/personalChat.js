
module.exports = (socket,io)=>{

    socket.on("join-room",(message)=>{
        socket.join(roomName);
    });
    socket.on("new-message",({message,roomName})=>{
        console.log('User',socket.user.username,"said:", message);

        io.emit("new-message",{username:socket.user.username,message});
    })
}