import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  numberOfTickets: {
    type: Number,
    required: true,
    min: [1, 'At least one ticket is required'],
    max: [10, 'Maximum 10 tickets per booking'],
  },
  showDate: {
    type: Date,
    required: true,
  },
  showTime: {
    type: String,
    required: true,
    enum: ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'],
  },
  theater: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed',
  },
  bookingReference: {
    type: String,
    unique: true,
  }
}, {
  timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;