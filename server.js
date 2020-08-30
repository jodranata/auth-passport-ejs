const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const expressEjsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/passport')(passport);

const config = require('./config/config');
const connectDB = require('./config/db');

const appRoute = require('./routers/index.route');
const userRoute = require('./routers/user.route');

const app = express();

connectDB(config.MONGO_URL);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(expressEjsLayouts);

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', appRoute);
app.use('/users', userRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page Not Found',
  });
});

app.listen(config.PORT, () => {
  console.log(`App is running on port ${config.PORT}`);
});
