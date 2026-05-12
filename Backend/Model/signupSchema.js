const db = require('../Utils/db');
const { DataTypes } = require('sequelize');

const Signup = db.define('Signup',{

    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            len:[10,13]
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

module.exports = Signup;