import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Deal } from '@/models/Deal';

// GET /api/deals?from=&to=&active=&limit=&page=
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const active = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const query: any = {};
    if (from) query.from = { $regex: from, $options: 'i' };
    if (to) query.to = { $regex: to, $options: 'i' };
    if (active !== null) query.isActive = active === 'true';

    const cursor = Deal.find(query).sort({ date: 1, createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    const [items, total] = await Promise.all([cursor.lean(), Deal.countDocuments(query)]);

    return NextResponse.json({ items, total, page, limit }, { status: 200 });
  } catch (error) {
    console.error('Deals GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

// POST /api/deals
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { title, from, to, date, time, aircraft, price, description, image, tags, isActive } = body;

    if (!title || !from || !to || !date || !aircraft || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const deal = await Deal.create({
      title,
      from,
      to,
      date: new Date(date),
      time,
      aircraft,
      price,
      description,
      image,
      tags,
      isActive: isActive !== undefined ? !!isActive : true,
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error('Deals POST error:', error);
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
  }
}
