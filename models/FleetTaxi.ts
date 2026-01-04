import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const FleetSchema = new Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    capacity: { type: Number, required: true },
    range: { type: String, required: true },
    speed: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    features: [String],
    description: String,
    image: String,
    images: {
      outside: { type: String },
      inside: { type: String },
      seats: { type: String },
      extra: { type: String },
    },
    status: { type: String, enum: ['available', 'maintenance', 'booked'], default: 'available' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FleetTaxi = mongoose.models.FleetTaxi || mongoose.model('FleetTaxi', FleetSchema, 'fleets_taxi');
