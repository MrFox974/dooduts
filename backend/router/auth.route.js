const express = require('express');
const route = express.Router();
const authController = require('../controllers/auth.controller');

route.post('/auth/register', authController.register);
route.post('/auth/login', authController.login);
route.post('/auth/refresh', authController.refresh);

module.exports = route;
