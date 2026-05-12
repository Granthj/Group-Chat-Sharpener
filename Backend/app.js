const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http');
const wss = require('sockjs');
const db = require('./Utils/db');
const ConversationParticipants = require('./Model/conversationParticipantsSchema');
const Conversation = require('./Model/conversationSchema');
const Message = require('./Model/messageSchema');
const User = require('./Model/signupSchema');

const apiRoutes = require('./Routes/apiRoutes');


app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../Frontend")));

app.use('/api', apiRoutes);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/index.html'));
    // res.sendFile(path.join(__dirname,'Frontend','index.html'));
});

// associations

Conversation.hasMany(Message, { foreignKey: 'conversationId' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

User.hasMany(Message, { foreignKey: 'senderId' });
Message.belongsTo(User, { foreignKey: 'senderId' });

Conversation.belongsToMany(User, {
    through: ConversationParticipants,
    foreignKey: 'conversationId'
});
User.belongsToMany(Conversation, {
    through: ConversationParticipants,
    foreignKey: 'userId'
});

const server = http.createServer(app);
const socketServer = wss.createServer();
const client = {};

socketServer.on('connection', (conn) => {
    console.log('Websocket connected');

    const connectionId = conn.id;

    clients[connectionId] = conn;


    conn.on('data', async (message) => {

        /*
        Example incoming message:
    
        {
          senderId:1,
          receiverId:2,
          text:"hello"
        }
        */

        const parsedMessage = JSON.parse(message);

        console.log(parsedMessage);

        const savedMessage =
            await Message.create({
    
                conversationId:
                    parsedMessage.conversationId,
    
                senderId:
                    parsedMessage.senderId,
    
                text:
                    parsedMessage.text
    
            });

    Object.values(clients).forEach(client => {

        client.write(
          JSON.stringify(savedMessage)
        );

      });

  });
    conn.on('close', () => {

    console.log('WebSocket Disconnected');

    delete clients[connectionId];

  });

});
sockServer.installHandlers(server, {
  prefix: '/chat'
});
const PORT = process.env.PORT || 5000;

db.sync().then(() => {
    app.listen(5000, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})


