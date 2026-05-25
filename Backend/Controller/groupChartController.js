
const Conversation = require('../Model/conversationSchema');
const ConversationParticipants = require('../Model/conversationParticipantsSchema');

const postGroupChat = async(req,res)=>{

    try{

        const {groupName,users} = req.body;

        if(!groupName){
            return res.status(400).send('Group name is required');
        }
        if(users.length < 2){
            return res.status(400).send('Group member atleast two');
        }

        const conversation = await Conversation.create({
            isGroup:true,
            groupName:groupName
        });

        const participants = users.map(user=>({
            conversationId:conversation.id,
            isAdmin:user.isAdmin,
            userId:user.userId
        }));

        await ConversationParticipants.bulkCreate(participants);

        res.status(201).json({success:true,conversationId:conversation.id,groupName:groupName});
    }
    catch(err){
        console.log(err);
    }
}
module.exports = {
    postGroupChat
} 