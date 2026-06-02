const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http');
const {Server} = require('socket.io');
const db = require('./Utils/db');
const auth = require('./Middleware/Authorization');
const ConversationParticipants = require('./Model/conversationParticipantsSchema');
const Conversation = require('./Model/conversationSchema');
const Message = require('./Model/messageSchema');
const User = require('./Model/signupSchema');
const socketIO = require('../Backend/Socket_io/index.js');

const apiRoutes = require('./Routes/apiRoutes');


app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);
// app.use(auth);

app.use(express.static(path.join(__dirname, "../Frontend")));


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
Conversation.hasMany(ConversationParticipants,{
    foreignKey:'conversationId'
});

ConversationParticipants.belongsTo(Conversation,{
    foreignKey:'conversationId'
});

const server = http.createServer(app);
socketIO(server);
const PORT = process.env.PORT || 5000;

db.sync().then(() => {
    server.listen(5000, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})


