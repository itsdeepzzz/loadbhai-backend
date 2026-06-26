const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  role: { type: String, enum: ['driver', 'transporter', 'trader', 'corporate'] },
  firstName: String,
  lastName: String,
  businessName: String,
  gst: String,
  dl: String,
  dp: String,
  isVerified: { type: Boolean, default: false },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
