const express = require('express');
const Router = express.Router();
const loginController = require('../Controller/loginController');
const signUpController = require('../Controller/signUpController');
const getChat = require('../Controller/chatMessageGetController');

Router.post('/api/login', loginController.login);
Router.post('/api/signup', signUpController.signup);

// For chats

Router.get('/api/message/:conversationId',getChat);

module.exports = Router;
