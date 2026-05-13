const Message = require('../Model/messageSchema');
const Conversation = require('../Model/conversationSchema');
const ConversationParticipants = require('../Model/conversationParticipantsSchema');

const chatMessage = async (req, res) => {
    try {
        const { senderId, recieverId, text } = req.body;

        let conversation = await Conversation.findOne({
            include: [
                {
                    model: ConversationParticipants,
                    where: {
                        userId: [senderId, recieverId]
                    }
                }
            ]

        });

        if (!conversation) {

            conversation = await Conversation.create({
                isGroup: false
            });

            await ConversationParticipants.bulkCreate([
                {
                    conversationId: conversation.id,
                    userId: senderId
                },
                {
                    conversationId: conversation.id,
                    userId: recieverId
                }
            ]);
        }

        const addMessage = await Message.create({
            conversationId: conversation.id,
            senderId: senderId,
            text: text
        });

        const updateMessage = await conversation.update({
            lastMessageId: addMessage.id,
            lastMessageAt: addMessage.createdAt
        });
        res.status(200).json({message:addMessage,success:true});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'Some thing went wrong'});
    }

}


module.exports = chatMessage;