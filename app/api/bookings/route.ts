import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models/Booking';
import { Flight } from '@/models/Flight';
import { User } from '@/models/User';

function generateBookingNumber(): string {
    return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        // Mock mode
        const AUTH_MODE = process.env.AUTH_MODE;
        const IS_MOCK = AUTH_MODE === 'mock' || (process.env.NODE_ENV !== 'production' && AUTH_MODE !== 'real');
        if (IS_MOCK) {
            const now = new Date();
            const mockBookings = [
                {
                    _id: 'bk1',
                    bookingNumber: 'BK-MOCK-001',
                    user: userId || 'mock-user-id',
                    flight: {
                        _id: 'fl1',
                        flightNumber: 'ASR101',
                        departure: { airport: 'DEL', city: 'Delhi', time: new Date(now.getTime() + 86400000) },
                        arrival: { airport: 'BOM', city: 'Mumbai', time: new Date(now.getTime() + 86400000 + 7200000) },
                        price: 250000,
                        status: 'scheduled',
                    },
                    passengers: 2,
                    totalPrice: 500000,
                    status: 'confirmed',
                    paymentStatus: 'paid',
                    createdAt: now,
                },
            ];
            return NextResponse.json(mockBookings, { status: 200 });
        }

        await dbConnect();

        let query: any = {};
        if (userId) {
            query.user = userId;
        }

        const bookings = await Booking.find(query)
            .populate('user')
            .populate('flight')
            .populate('fleet')
            .exec();

        return NextResponse.json(bookings, { status: 200 });
    } catch (error) {
        console.error('Fetch bookings error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Mock mode
        const AUTH_MODE = process.env.AUTH_MODE;
        const IS_MOCK = AUTH_MODE === 'mock' || (process.env.NODE_ENV !== 'production' && AUTH_MODE !== 'real');
        if (IS_MOCK) {
            const now = new Date();
            return NextResponse.json({
                _id: 'bk-created',
                bookingNumber: 'BK-MOCK-' + Math.random().toString(36).slice(2,7).toUpperCase(),
                user: body.userId || 'mock-user-id',
                flight: body.flightId || 'fl1',
                passengers: body.passengers || 1,
                totalPrice: body.totalPrice || 100000,
                status: 'pending',
                paymentStatus: 'unpaid',
                createdAt: now,
            }, { status: 201 });
        }

        await dbConnect();

        const {
            userId,
            flightId,
            passengers,
            totalPrice,
            specialRequests,
        } = body;

        // Validate input
        if (!userId || !flightId || !passengers || !totalPrice) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if flight exists and has available seats
        const flight = await Flight.findById(flightId);
        if (!flight) {
            return NextResponse.json(
                { error: 'Flight not found' },
                { status: 404 }
            );
        }

        if (flight.availableSeats < passengers) {
            return NextResponse.json(
                { error: 'Not enough available seats' },
                { status: 409 }
            );
        }

        // Create booking
        const booking = await Booking.create({
            bookingNumber: generateBookingNumber(),
            user: userId,
            flight: flightId,
            fleet: flight.fleet,
            passengers,
            totalPrice,
            specialRequests,
        });

        // Update flight available seats
        await Flight.findByIdAndUpdate(flightId, {
            availableSeats: flight.availableSeats - passengers,
        });

        // Add booking to user
        await User.findByIdAndUpdate(userId, {
            $push: { bookings: booking._id },
        });

        // Add booking to flight
        await Flight.findByIdAndUpdate(flightId, {
            $push: { bookings: booking._id },
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate('user')
            .populate('flight')
            .populate('fleet')
            .exec();

        return NextResponse.json(populatedBooking, { status: 201 });
    } catch (error) {
        console.error('Create booking error:', error);
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}
