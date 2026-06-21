const chatMessage = require('../../Controller/chatMessagePostController.js');
const socketMap = new Map();

module.exports = (socket, io) => {

    if (socket.user) {
        socketMap.set(String(socket.user), socket.id);
    }

    socket.on('disconnect', () => {
        socketMap.delete(String(socket.user));
    });
    socket.on("join-room", async (conversationId) => {
        socket.join(`conversation_${conversationId}`);
    });
    socket.on("sendMessage", async (data) => {
        try {
            const req = {
                body: {
                    receiverId: data.receiverId || null,
                    senderId: data.senderId,
                    conversationId: data.conversationId || null,
                    text: data.text,
                    mediaUrl: data.mediaUrl || null,
                    mediaType: data.mediaType || null
                }
            }
            let saveMessage = null;
            const res = {
                status: (code) => ({
                    json: (payload) => {
                        if (payload.success) saveMessage = payload
                    }
                })
            }
            await chatMessage(req, res);

            const convId = saveMessage.conversationId;
            const room = `conversation_${convId}`;

            socket.join(room);

            if (data.type === 'receiver') {

                for (const item of io.sockets.sockets) {
                    const socketId = item[0];
                    const socketObject = item[1];

                    if (socketObject.user === data.receiverId) {
                        socketObject.join(room);  // here socketObject not socket.join because by default socket.join is current user who is sending and socketObject is an iterative object have many connection match it and socketObject.join() in room simple
                        break;
                    }
                }
            }

            io.to(room).emit("receiveMessage", {
                conversationId: convId,
                senderId: data.senderId,
                receiverId: data.receiverId,
                text: data.text,
                mediaUrl:data.mediaUrl,
                mediaType:data.mediaType,
                createdAt: saveMessage.message.createdAt,
                messageId: saveMessage.message.id
            });

            const receiverId = data.receiverId || saveMessage.receiverId;
            const senderSocketId = socketMap.get(String(data.senderId));
            const receiverSocketId = socketMap.get(String(receiverId));
            if (senderSocketId) {
                io.to(senderSocketId).emit('updateSidebar', {
                    conversationId: convId,
                    senderId: data.senderId,
                    text: data.text
                });
            }
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('updateSidebar', {
                    conversationId: convId,
                    senderId: data.senderId,
                    text: data.text
                });
            }
        }
        catch (err) {
            console.error('sendMessage error:', err);
            socket.emit('messageError', { error: 'Something went wrong' });
        }

    })
}