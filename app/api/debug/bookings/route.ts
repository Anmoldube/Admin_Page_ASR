import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models/Booking';

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Disabled in production' }, { status: 403 });
  }
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const items = await Booking.find({}).sort({ createdAt: -1 }).limit(limit)
      .populate('user')
      .populate('flight')
      .populate('fleet')
      .lean();
    return NextResponse.json({ count: items.length, items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
