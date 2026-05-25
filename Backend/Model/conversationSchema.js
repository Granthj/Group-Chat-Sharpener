const db = require('../Utils/db');
const { DataTypes } = require('sequelize');

const Conversation = db.define('Conversation',{

    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    isGroup:{
        type:DataTypes.BOOLEAN,
        default:false,
    },
    groupName:{
        type:DataTypes.STRING,
        allowNull:true
    },
    lastMessageId:{
        type:DataTypes.INTEGER

    },
    lastMessageAt:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }
},
{timestamps:true}
);

module.exports = Conversation;