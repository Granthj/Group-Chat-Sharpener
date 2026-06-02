const saveGroupMessages = require('../../Controller/groupChatMessageController');

module.exports = (socket,io)=>{

    socket.on("join-group-room", (conversationId)=>{
        socket.join(`group-room_${conversationId}`);
    });
    socket.on("sendGroup-message",async (data)=>{
        try{
            // console.log('group message received on server',data);
            const savedMessage = await saveGroupMessages({
                text:data.text,
                conversationId:data.conversationId,
                senderId:data.senderId
            });
            const room = `group-room_${data.conversationId}`

            io.to(room).emit("receiveGroup-message",{
                id:savedMessage.id,
                conversationId:data.conversationId,
                senderId:savedMessage.senderId,
                senderName:data.senderName,
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