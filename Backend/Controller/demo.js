// controllers/chat.js

const {
  Conversation,
  Message,
  ConversationParticipant,
} = require("../models");

const sendMessage = async (req, res) => {

  try {

    const { senderId, receiverId, text } = req.body;

    // STEP 1: find existing conversation
    let conversation = await Conversation.findOne({
      include: [
        {
          model: ConversationParticipant,
          where: {
            userId: [senderId, receiverId],
          },
        },
      ],
    });

    // STEP 2: if no conversation create one
    if (!conversation) {

      conversation = await Conversation.create({
        isGroup: false,
      });

      // add participants
      await ConversationParticipant.bulkCreate([
        {
          conversationId: conversation.id,
          userId: senderId,
        },
        {
          conversationId: conversation.id,
          userId: receiverId,
        },
      ]);
    }

    // STEP 3: create message
    const message = await Message.create({
      conversationId: conversation.id,
      senderId,
      text,
    });

    // STEP 4: update last message
    await conversation.update({
      lastMessageId: message.id,
      lastMessageAt: message.createdAt,
    });

    res.status(201).json({
      success: true,
      message,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  sendMessage,
};