const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  dest: { type: String, required: true },
  material: { type: String, required: true },
  weight: { type: String, required: true },
  price: { type: String, required: true },
  status: { type: String, default: 'active' },
  postedAt: { type: String, default: 'Just now' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Load', loadSchema);
