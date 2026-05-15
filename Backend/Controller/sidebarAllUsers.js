const { Op } = require('sequelize');
const User = require('../Model/signupSchema');
const ConversationParticipants = require('../Model/conversationParticipantsSchema');
const Conversation = require('../Model/conversationSchema');
const Message = require('../Model/messageSchema');

const getAllUsers = async(req,res)=>{

    try{
        let currentUserId = req.user.id;
        const users = await User.findAll({
            where:{
                id:{
                    [Op.ne]:currentUserId
                }
            }
        });

        if(!users){
            return res.status(404).json({message:"No user found"});
        }
        const myConversation = await ConversationParticipants.findAll({
            where:{
                userId:currentUserId
            }
        });
        const conversationIds = myConversation.map(con=>{
            return con = con.coversationId
        });
        const sidebarUsers = [];
        for(const user in users){


            const sharedConversation = await ConversationParticipants.findOne({  //lookup table comparing userID and conversationID both together
                where:{
                    userId:user.id,
                    conversationId:{
                        [Op.in]:conversationIds
                    }
                }
            });

            if(!sharedConversation){
                sidebarUsers.push({
                    id:user.id,
                    name:user.name,
                    lastMessage:null,
                    lastMessageAt:null
                });

                continue;
            }
            const conversation = await Conversation.findByPk(sharedConversation.conversationId);
            let lastMessage = null;
            if(conversation.lastMessageId){   //this line is just extra security bcoz in our architecture we dont have delete so if conversation exist it remain there so means if it in the sharedConversation it means that there must be any last message.
                lastMessage = await Message.findByPk(
                    conversation.lastMessageId  // this is nothing just message table id is pk dont be confused 
                );
            }
            sidebarUsers.push({
                id:user.id,
                name:user.name,
                lastMessage:lastMessage ? lastMessage.text : null,  // othere fields are there as well so we need to filter by .text
                lastMessageAt:conversation.lastMessageAt
            });

        }
        return res.status(200).json(sidebarUsers);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'Internal server error'});
    }
}

module.exports = getAllUsers;