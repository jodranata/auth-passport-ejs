const express = require('express');
const { ensureAuthenticated } = require('../config/auth');

const route = express.Router();

route.get('/', (req, res) => {
  res.render('welcome');
});

route.get('/register', (req, res) => {
  res.render('register');
});

route.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

module.exports = route;
