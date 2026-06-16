const express = require('express');
const Router = express.Router();
const loginController = require('../Controller/loginController');
const signUpController = require('../Controller/signUpController');
const getChat = require('../Controller/chatMessageGetController');
const sidebarAllUsers = require('../Controller/sidebarAllUsers');
const groupChatController = require('../Controller/groupChartController');
const auth = require('../Middleware/Authorization');
const upload = require('../Controller/uploadController');
const multer = require('../Utils/multer');

Router.post('/signup', signUpController.signup);
Router.post('/login', loginController.login);

// For chats
// console.log(auth,'routes');
Router.get('/message/:conversationId',getChat);
Router.get('/get-all-users',auth,sidebarAllUsers);
Router.post('/post-group',groupChatController.postGroupChat);

Router.post('/upload', multer.single('file'),upload.uploadMedia);


module.exports = Router;
