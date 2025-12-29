import mongoose from 'mongoose';

const DealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String },
    aircraft: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Deal = mongoose.models.Deal || mongoose.model('Deal', DealSchema);
