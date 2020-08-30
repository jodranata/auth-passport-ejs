const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

userSchema.methods.authenticatePass = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

userSchema.methods.generateHash = function (password, cb) {
  bcrypt.genSalt(10, (saltErr, salt) => {
    if (saltErr) return cb(saltErr);
    bcrypt.hash(password, salt, (hashErr, hash) => {
      if (hashErr) return cb(hashErr);
      return cb(null, hash);
    });
  });
};

module.exports = mongoose.model('User', userSchema);
