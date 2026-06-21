const { Op } = require('sequelize');
const Message = require('../Model/messageSchema');
const Conversation = require('../Model/conversationSchema');
const ConversationParticipants = require('../Model/conversationParticipantsSchema');

const chatMessage = async (req, res) => {
    try {
        const {
            senderId,
            receiverId,
            text,
            conversationId,
            mediaUrl,
            mediaType
        } = req.body;
        console.log(mediaUrl,mediaType,text,'abcddd');
        let conversation = null;

        if (conversationId) {
            conversation = await Conversation.findByPk(conversationId);
        }

        if (!conversation) {

            if (!receiverId) {
                return res.status(400).json({
                    success: false,
                    message: 'receiverId is required'
                });
            }

            const senderConversations =
                await ConversationParticipants.findAll({
                    where: {
                        userId: senderId
                    }
                });

            const senderConversationIds =
                senderConversations.map(
                    item => item.conversationId
                );

            // Find a conversation shared by receiver
            const sharedConversation =
                await ConversationParticipants.findOne({
                    where: {
                        userId: receiverId,
                        conversationId: {
                            [Op.in]: senderConversationIds
                        }
                    }
                });

            if (sharedConversation) {

                conversation = await Conversation.findByPk(
                    sharedConversation.conversationId
                );

            } else {

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
                        userId: receiverId
                    }
                ]);
            }
        }

        let resolvedReceiverId = receiverId;
        if(!resolvedReceiverId) {
            const participants = await ConversationParticipants.findAll({
                where: {
                    conversationId: conversation.id
                }
            });
            const receiverParticipant = participants.find(p=>Number(p.userId) != Number(senderId));
            resolvedReceiverId = receiverParticipant ? receiverParticipant.userId : null;
        }
        const addMessage = await Message.create({
            conversationId: conversation.id,
            senderId,
            text,
            mediaUrl,
            mediaType
        });

        await conversation.update({
            lastMessageId: addMessage.id,
            lastMessageAt: addMessage.createdAt
        });

        return res.status(200).json({
            success: true,
            conversationId: conversation.id,
            message: addMessage,
            receiverId: resolvedReceiverId
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
};

module.exports = chatMessage;