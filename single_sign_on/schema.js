const mongoose = require('mongoose');
const photoSchema = new mongoose.Schema({
  value: String, 
});
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: { type: Object, required: true },
  displayName: { type: String, required: true },
  photos: [photoSchema],
  provider: { type: String, required: true },
  isAllowed:{type:Boolean}
});

const User = mongoose.model('adminUsers', userSchema);

module.exports = User;
