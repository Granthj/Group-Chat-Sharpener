const { Op } = require('sequelize');

const User = require('../Model/signupSchema');
const Conversation = require('../Model/conversationSchema');
const ConversationParticipants = require('../Model/conversationParticipantsSchema');
const Message = require('../Model/messageSchema');

const getAllUsers = async(req,res)=>{

    try{

        const currentUserId = req.user.id;

        // all users except logged-in user
        const users = await User.findAll({
            where:{
                id:{
                    [Op.ne]: currentUserId
                }
            }
        });

        const sidebarUsers = [];

        for(const user of users){

            // find conversations of current user
            const myConversations = await ConversationParticipants.findAll({
                where:{
                    userId: currentUserId
                }
            });

            const conversationIds = myConversations.map(
                convo => convo.conversationId
            );

            // check if other user exists in same conversation
            const sharedConversation = await ConversationParticipants.findOne({
                where:{
                    userId: user.id,
                    conversationId:{
                        [Op.in]: conversationIds
                    }
                }
            });

            // no conversation yet
            if(!sharedConversation){

                sidebarUsers.push({
                    userId: user.id,
                    name: user.name,
                    lastMessage: null,
                    lastMessageAt: null
                });

                continue;
            }

            // get conversation
            const conversation = await Conversation.findByPk(
                sharedConversation.conversationId
            );

            let lastMessage = null;

            if(conversation.lastMessageId){

                lastMessage = await Message.findByPk(
                    conversation.lastMessageId
                );
            }

            sidebarUsers.push({
                userId: user.id,
                name: user.name,
                lastMessage: lastMessage ? lastMessage.text : null,
                lastMessageAt: conversation.lastMessageAt || null
            });

        }

        return res.status(200).json(sidebarUsers);

    }catch(error){

        console.log(error);

        return res.status(500).json({
            message:"Internal server error"
        });
    }
}

module.exports = {
    getAllUsers
};