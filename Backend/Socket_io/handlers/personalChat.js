
const chatMessage = require('../../Controller/chatMessagePostController');
const socketMap = new Map();

module.exports = (socket, io) => {

    if (socket.user) {
        socketMap.set(String(socket.user), socket.id);
    }

    socket.on('disconnect', () => {
        socketMap.delete(String(socket.user));
    });
    // console.log('New socket connection:', socket.id, 'User ID:', socket.user);
    socket.on("join-room", async (conversationId) => {
        // console.log('Joining room:', conversationId);
        socket.join(`conversation_${conversationId}`);
    });
    socket.on("sendMessage", async (data) => {
        // console.log('message received on server', data);
        try {
            const req = {
                body: {
                    receiverId: data.receiverId || null,
                    senderId: data.senderId,
                    conversationId: data.conversationId || null,
                    text: data.text,
                    mediaUrl: data.mediaUrl || null
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

                    console.log(
                        'connected user',
                        socketObject.user,
                        'receiver',
                        data.receiverId
                    );
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
                createdAt: saveMessage.message.createdAt,
                messageId: saveMessage.message.id
            });
            // console.log('=== SIDEBAR UPDATE DEBUG ===');
            // console.log('socketMap contents:', [...socketMap]);
            // console.log('data.senderId:', data.senderId, typeof data.senderId);
            // console.log('data.receiverId:', data.receiverId, typeof data.receiverId);
            // console.log('sender lookup key:', String(data.senderId));
            // console.log('receiver lookup key:', String(data.receiverId));
            // console.log('senderSocketId found:', socketMap.get(String(data.senderId)));
            // console.log('receiverSocketId found:', socketMap.get(String(data.receiverId)));

            const receiverId = data.receiverId || saveMessage.receiverId;
            const senderSocketId = socketMap.get(String(data.senderId));
            const receiverSocketId = socketMap.get(String(receiverId));
            if (senderSocketId) {
                io.to(senderSocketId).emit('updateSidebar', {
                    conversationId: convId,
                    senderId: data.senderId,
                    text: data.text
                });
                // console.log('updateSidebar emitted to sender:', senderSocketId);
            }
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('updateSidebar', {
                    conversationId: convId,
                    senderId: data.senderId,
                    text: data.text
                });
                // console.log('updateSidebar emitted to receiver:', receiverSocketId);
            }
        }
        catch (err) {
            console.error('sendMessage error:', err);
            socket.emit('messageError', { error: 'Something went wrong' });
        }

    })
}