const saveGroupMessages = require('../../Controller/groupChatMessageController');

module.exports = (socket,io)=>{

    socket.on("sendGroup-message",(data)=>{
        
        try{
            const savedMessage = await saveGroupMessages({
                text:data.text,
                conversationId:data.conversationId,
                senderId:data.senderId
            });
            const room = `group-room_${data.conversationId}`

            io.to(room).emit("receiveGroup-message",{
                id:savedMessage.id,
                conversationId:savedMessage.id,
                senderId:savedMessage.senderId,
                text:savedMessage.text,
                createdAt:savedMessage.createdAt
            });
        }
        catch(err){
            console.log(err);
            socket.emit('error',{
                error:'Somthing went wrong'
            })
        }

    });
}