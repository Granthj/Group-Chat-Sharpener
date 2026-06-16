const db = require('../Utils/db');
const { DataTypes } = require('sequelize');

const ArchivedChat = db.define('ArchivedChat', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    senderId: {
        type:DataTypes.INTEGER,
        allowNull: false
    },
    receiverId:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    text:{
        type:DataTypes.TEXT,
        allowNull:true
    },
     mediaUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mediaType: {
        type: DataTypes.STRING,
        allowNull: true
    }

},
{
    timestamps:true
});

module.exports = ArchivedChat;