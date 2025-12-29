import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
    {
        bookingNumber: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        flight: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Flight',
            required: true,
        },
        fleet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Fleet',
        },
        passengers: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'paid', 'refunded'],
            default: 'unpaid',
        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
        specialRequests: String,
    },
    { timestamps: true }
);

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
