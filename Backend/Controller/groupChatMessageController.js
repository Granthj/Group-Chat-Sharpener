
const Message = require('../Model/messageSchema');
const Conversation = require('../Model/conversationSchema');

const saveGroupMessages = async({text,conversationId,senderId})=>{

    try{

        const message = await Message.create({
            text,
            conversationId,
            senderId,
        });
        const conversation = await Conversation.update({
            lastMessageId:message.id,
            lastMessageAt:message.createdAt
        },{
            where:{
                id:conversationId
            }
        });

        return message;

    }
    catch(err){
        console.log(err);
    }
}

module.exports = saveGroupMessages;