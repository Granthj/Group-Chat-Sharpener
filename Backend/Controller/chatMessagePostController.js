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
            conversationId
        } = req.body;

        let conversation = null;

        // Existing conversation provided
        if (conversationId) {
            conversation = await Conversation.findByPk(conversationId);
        }

        // New personal chat
        if (!conversation) {

            if (!receiverId) {
                return res.status(400).json({
                    success: false,
                    message: 'receiverId is required'
                });
            }

            // Get all conversations of sender
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

        const addMessage = await Message.create({
            conversationId: conversation.id,
            senderId,
            text
        });

        await conversation.update({
            lastMessageId: addMessage.id,
            lastMessageAt: addMessage.createdAt
        });

        return res.status(200).json({
            success: true,
            conversationId: conversation.id,
            message: addMessage
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