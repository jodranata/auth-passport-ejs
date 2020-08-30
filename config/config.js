require('dotenv').config({ path: './config/.env' });

module.exports = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGODB_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
};
