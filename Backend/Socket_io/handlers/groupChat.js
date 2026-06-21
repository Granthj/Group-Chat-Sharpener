const saveGroupMessages = require('../../Controller/groupChatMessageController');

module.exports = (socket,io)=>{

    socket.on("join-group-room", (conversationId)=>{

        socket.join(`group-room_${conversationId}`);
    });
    socket.on("sendGroup-message",async (data)=>{
        try{

            const savedMessage = await saveGroupMessages({
                text:data.text,
                mediaUrl:data.mediaUrl || null,
                mediaType:data.mediaType || null,
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
                mediaUrl:savedMessage.mediaUrl,
                mediaType:savedMessage.mediaType,
                createdAt:savedMessage.createdAt
            });
            io.to(room).emit("updateGroupSidebar",{
                conversationId:data.conversationId,
                text:data.text
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