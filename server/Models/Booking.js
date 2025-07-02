const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tripCategory: String,
  destination: { type: String, required: true },
  startDate: String,
  endDate: String,
  travelers: Number,
  packageType: String,
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  state: String,
  specialRequest: String,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
