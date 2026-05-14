const db = require('../Utils/db');
const { DataTypes } = require('sequelize');

const ConversationParticipants = db.define('ConversationParticipants',{

    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    conversationId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    timestamps:true,

    indexes:[
        {
            unique:true,
            fields:['conversationId','userId']
        }
    ]

  }

);

module.exports = ConversationParticipants;