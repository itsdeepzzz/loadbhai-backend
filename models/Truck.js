const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  truckId:      { type: String, unique: true },  // e.g. TRK-3920
  postedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driverName:   { type: String },
  mobile:       { type: String },

  origin:       { type: String, required: true },
  destination:  { type: String, required: true },
  vehicleNumber:{ type: String, default: '' },
  truckType:    { type: String, enum: ['Container', 'Open Body', 'Trailer', 'Tanker', 'Flatbed'], default: 'Open Body' },
  capacity:     { type: String, required: true },  // "20 Tons"
  charges:      { type: Number, required: true },  // in INR

  truckImg:     { type: String, default: '' },
  status:       { type: String, enum: ['available', 'booked', 'in_transit'], default: 'available' },
  bookedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

truckSchema.pre('save', function (next) {
  if (!this.truckId) {
    this.truckId = `TRK-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

module.exports = mongoose.model('Truck', truckSchema);
