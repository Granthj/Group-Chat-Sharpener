
const chatMessage = require('../../Controller/chatMessagePostController');
module.exports = (socket,io)=>{

    socket.on("join-room",async (conversationId)=>{
        socket.join(`conversation_${conversationId}`);
    });
    socket.on("sendMessage",async (data)=>{
        
        try{
            const req = {
                body:{
                    receiverId:data.receiverId || null,
                    senderId:data.senderId,
                    conversationId:data.conversationId || null,
                    text:data.text
                }
            }
            let saveMessage = null;
            const res = {
                status:(code)=>({
                    json:(payload)=>{
                        if(payload.success) saveMessage = payload
                    }
                })
            }
            await chatMessage(req,res);

            const convId = saveMessage.conversationId;
            const room = `conversation_${convId}`;

            socket.join(room);

            if(data.type === 'receiver'){

                for(const item of io.sockets.sockets){
                    const socketId = item[0];
                    const socketObject = item[1];
    
                    if(socketObject.user.id === data.receiverId){
                        socketObject.join(room);  // here socketObject not socket.join because by default socket.join is current user who is sending and socketObject is an iterative object have many connection match it and socketObject.join() in room simple
                        break;
                    }
                }
            }

            io.to(room).emit("receiveMessage",{
                conversationId:convId,
                senderId:data.senderId,
                receiverId:data.receiverId,
                text:data.text,
                createdAt:saveMessage.message.createAt,
                messageId:saveMessage.message.id
            });
        }
        catch(err){
            console.error('sendMessage error:', err);
            socket.emit('messageError', { error: 'Something went wrong' });
        }

    })
}