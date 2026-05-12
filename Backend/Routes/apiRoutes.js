const express = require('express');
const Router = express.Router();
const loginController = require('../Controller/loginController');
const signUpController = require('../Controller/signUpController');

Router.post('/api/login', loginController.login);
Router.post('/api/signup', signUpController.signup);

module.exports = Router;
