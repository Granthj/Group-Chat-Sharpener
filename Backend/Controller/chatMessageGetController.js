const Message = require('../Model/messageSchema');
const Conversation = require('../Model/conversationSchema');
const ConversationParticipants = require('../Model/conversationParticipantsSchema');

const getChat = async (req,res)=>{

    try{
        const conversationId = req.params.conversationId;

        const message = await Message.findAll({
            where:{
                conversationId:conversationId
            },
            order:[['createdAt','ASC']]
        });

        return res.status(200).json({
            success:true,
            message:message
        });
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
}   

module.exports = getChat;