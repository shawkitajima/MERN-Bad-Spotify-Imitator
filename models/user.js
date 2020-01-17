const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 6;

const userSchema = new mongoose.Schema({
  name: String,
  email: {type: String, required: true, lowercase: true, unique: true},
  password: String
}, {
  timestamps: true
});

userSchema.set('toJSON', {
  transform: function(doc, ret) {
    // remove the password property when serializing doc to JSON
    delete ret.password;
    return ret;
  }
});

// This is how we hash our passwords
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return
  // password has changed! - salt and hash
  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(tryPassword, cb) {
  bcrypt.compare(tryPassword, this.password, cb);
}


module.exports = mongoose.model('User', userSchema);