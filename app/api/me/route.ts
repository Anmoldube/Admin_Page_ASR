import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Booking } from '@/models/Booking';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    // Decide mock mode
    const AUTH_MODE = process.env.AUTH_MODE;
    const IS_MOCK = AUTH_MODE === 'mock' || (process.env.NODE_ENV !== 'production' && AUTH_MODE !== 'real');

    if (IS_MOCK) {
      const now = new Date();
      return NextResponse.json({
        user: { id: 'mock-user-id', email: 'admin@test.com', name: 'Mock Admin', role: 'admin' },
        bookings: [
          {
            _id: 'bk1',
            bookingNumber: 'BK-MOCK-001',
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
          }
        ]
      }, { status: 200 });
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(payload.userId).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const bookings = await Booking.find({ user: user._id })
      .populate({ path: 'flight', populate: { path: 'fleet' } })
      .lean();

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      bookings,
    }, { status: 200 });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
