import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phone: String,
        role: {
            type: String,
            enum: ['client', 'admin'],
            default: 'client',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Booking',
            },
        ],
    },
    { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
