const express = require('express');
const {
  logOutController,
  loginController,
  registerController,
} = require('../controllers/auth.controller');

const route = express.Router();

route.get('/login', (req, res) => {
  res.render('login');
});

route.get('/register', (req, res) => {
  res.render('register');
});

route.post('/register', registerController);

route.post('/login', loginController);

route.get('/logout', logOutController);

module.exports = route;
