import mongoose from 'mongoose';

const FlightSchema = new mongoose.Schema(
    {
        flightNumber: {
            type: String,
            required: true,
            unique: true,
        },
        departure: {
            airport: { type: String, required: true },
            city: { type: String, required: true },
            time: { type: Date, required: true },
        },
        arrival: {
            airport: { type: String, required: true },
            city: { type: String, required: true },
            time: { type: Date, required: true },
        },
        fleet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Fleet',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        availableSeats: {
            type: Number,
            required: true,
        },
        totalSeats: {
            type: Number,
            required: true,
        },
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Booking',
            },
        ],
        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled', 'delayed'],
            default: 'scheduled',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Flight = mongoose.models.Flight || mongoose.model('Flight', FlightSchema);
