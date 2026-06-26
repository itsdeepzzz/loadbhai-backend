const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema({
  loadId:      { type: String, unique: true },   // e.g. LOD-94821
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: { type: String, default: 'Shipper' },
  mobile:      { type: String },
  
  origin:      { type: String, required: true },
  destination: { type: String, required: true },
  material:    { type: String, required: true },
  weight:      { type: String, required: true },    // "12 Tons"
  targetPrice: { type: Number, required: true },    // in INR

  status:      { type: String, enum: ['active', 'booked', 'cancelled'], default: 'active' },
  bookedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

// Auto-generate loadId before save
loadSchema.pre('save', function (next) {
  if (!this.loadId) {
    this.loadId = `LOD-${Math.floor(10000 + Math.random() * 90000)}`;
  }
  next();
});

module.exports = mongoose.model('Load', loadSchema);
