const db = require('../Utils/db');
const { DataTypes } = require('sequelize');

const Message = db.define('Message', {

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
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    mediaUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mediaType: {
        type: DataTypes.STRING,
        allowNull: true
    }
    // messageType: {
    //     type: DataTypes.ENUM('text', 'image', 'video', 'file'),
    //     defaultValue: 'text',
    //     allowNull: false
    // }
}, { timestamps: true }
);

module.exports = Message;