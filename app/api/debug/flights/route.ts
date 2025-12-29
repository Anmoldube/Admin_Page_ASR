import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Flight } from '@/models/Flight';

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Disabled in production' }, { status: 403 });
  }
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const items = await Flight.find({}).sort({ createdAt: -1 }).limit(limit).lean();
    return NextResponse.json({ count: items.length, items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
