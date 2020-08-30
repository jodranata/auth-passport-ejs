const passport = require('passport');
const User = require('../models/user.model');

const capitalize = string => {
  return `${string}`.charAt(0).toUpperCase() + `${string}`.slice(1);
};

const registerController = (req, res) => {
  const errors = {};
  const {
    body: { name, email, password, confirmPassword },
  } = req;

  Object.keys(req.body).forEach(key => {
    if (!req.body[key])
      errors[key] = `${
        key === 'confirmPassword' ? 'this field' : key
      } must not empty`;
  });

  if (password.length < 6)
    errors.password = `password must have at least 6 characters`;
  if (password !== confirmPassword) errors.password = `passwords do not match`;

  if (Object.keys(errors).length > 0) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }
  User.findOne({ email }).exec((err, user) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error' });
    if (user) {
      errors.user = 'Account with that email already existed';
      req.flash('error_msg', 'Account with that email already existed');
      return res.render('register', { errors });
    }
    const newUser = new User({
      email,
      name,
    });

    newUser.generateHash(password, (hashErr, hash) => {
      if (hashErr)
        return res.status(400).json({ success: false, message: hashErr.message });
      newUser.password = hash;
      newUser
        .save()
        .then(() => {
          req.flash('success_msg', 'You have now registered');
          return res.redirect('/users/login');
        })
        .catch(saveErr =>
          res.status(400).json({
            success: false,
            message: 'Internal Server Error',
            error: saveErr,
          }),
        );
    });
  });
};
const loginController = (req, res, next) => {
  const {
    body: { password },
  } = req;
  const errors = {};
  Object.keys(req.body).forEach(key => {
    if (!req.body[key]) errors[key] = `${capitalize(key)} must not empty`;
  });
  if (!errors.password && password.length < 6)
    errors.password = `${capitalize('password')} must have at least 6 characters`;
  if (Object.keys(errors).length > 0) {
    return res.render('login', { errors });
  }

  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true, // --> need to use connect-flash, the message will be assign useing req.flash()
  })(req, res, next);
};

const logOutController = (req, res) => {
  req.logout(); // --> created by passport
  req.flash('success_msg', 'Now logged out');
  return res.redirect('/users/login');
};

module.exports = {
  loginController,
  registerController,
  logOutController,
};
