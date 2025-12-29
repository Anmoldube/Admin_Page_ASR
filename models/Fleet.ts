import mongoose from 'mongoose';

const FleetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        range: {
            type: String,
            required: true,
        },
        speed: {
            type: String,
            required: true,
        },
        pricePerHour: {
            type: Number,
            required: true,
        },
        features: [String],
        description: String,
        image: String,
        status: {
            type: String,
            enum: ['available', 'maintenance', 'booked'],
            default: 'available',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Fleet = mongoose.models.Fleet || mongoose.model('Fleet', FleetSchema);
