const Message = require('../Model/messageSchema');
const Conversation = require('../Model/conversationSchema');
const ConversationParticipants = require('../Model/conversationParticipantsSchema');
const Signup = require('../Model/signUpSchema');
const ArchivedChat = require('../Model/archiveChatSchema');

const getChat = async (req, res) => {

    try {
        const conversationId = req.params.conversationId;

        const message = await Message.findAll({
            where: {
                conversationId: conversationId
            },
            include: [
                {
                    model: Signup,
                    attributes: ['name', 'id']
                }
            ],
            order: [['createdAt', 'ASC']]
        });

        const archivedMessage = await ArchivedChat.findAll({

            where: {
                conversationId: conversationId
            },

            include: [
                {
                    model: Signup,
                    attributes: ['name', 'id']
                }
            ],

            order: [
                ['createdAt', 'ASC']
            ]

        });

        const allMessages = [
            ...archivedMessage,
            ...message
        ];

        allMessages.sort((a,b)=>new Date(a.createdAt) - new Date(b.createdAt));
        // const username = await Signup.findOne({
        //     where:{
        //         id:userId
        //     }
        // });
        // console.log(username.name,'name of sender')
        return res.status(200).json({
            success: true,
            message: allMessages
        });
    }
    catch (err) {
        console.log(err,"getmessage")
        res.status(500).send("Something went wrong");
    }
}

module.exports = getChat;