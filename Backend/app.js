const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http');
const {Server} = require('socket.io');
const db = require('./Utils/db');
const ConversationParticipants = require('./Model/conversationParticipantsSchema');
const Conversation = require('./Model/conversationSchema');
const Message = require('./Model/messageSchema');
const User = require('./Model/signupSchema');
const socketIO = require('../Backend/Socket_io/index.js');

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
const io = socketIO(server);
io.use(async (socket,next)=>{
    
    try{
            const token = socket.handshake.auth.token;
    
            if(!token){
                next(new Error('Token is missing in socket handshake'));
            }
    
            const decode = jwt.verify(token,'chat-userId');
    
            socket.user = decode.user;
            socket.auth = true;

            next();
        }
        catch(err){
            return next(new Error("Token is missing from socket"));
        }
})

const PORT = process.env.PORT || 5000;

db.sync().then(() => {
    app.listen(5000, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})


