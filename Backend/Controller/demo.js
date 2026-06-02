const { Op } = require('sequelize');
const Message = require('../Model/messageSchema');
const Conversation = require('../Model/conversationSchema');
const ConversationParticipants = require('../Model/conversationParticipantsSchema');

const chatMessage = async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;

        let conversations = await Conversation.findAll({
            include: [
                {
                    model: ConversationParticipants,
                    where: {
                        userId:{
                            [Op.in]:[senderId,receiverId]
                        }
                    }
                }
            ]

        });
        let conversation = null;

        for(const conv of conversations){
            const participants = conv.ConversationParticipants.map(p=>p.userId);

            if(participants.includes(senderId) && participants.includes(receiverId)){
                conversation = conv;
                break;
            }
        }
        if (!conversation) {

            conversation = await Conversation.create({
                isGroup: false
            });
            console.log('conversation created', conversation.id,senderId,receiverId);
            await ConversationParticipants.bulkCreate([
                {
                    conversationId: conversation.id,
                    userId: senderId
                },
                {
                    conversationId: conversation.id,
                    userId: receiverId
                }
            ]);
        }

        const addMessage = await Message.create({
            conversationId: conversation.id,
            senderId: senderId,
            text: text
        });

        await conversation.update({
            lastMessageId: addMessage.id,
            lastMessageAt: addMessage.createdAt
        });
        res.status(200).json({message:addMessage,conversationId:conversation.id,success:true});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'Some thing went wrong'});
    }

}


module.exports = chatMessage;