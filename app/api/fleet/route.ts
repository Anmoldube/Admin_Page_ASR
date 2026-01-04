import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Fleet } from '@/models/Fleet';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const fleets = await Fleet.find({ isActive: true });
    return NextResponse.json(fleets, { status: 200 });
  } catch (error) {
    console.error('Fetch fleet error:', error);
    return NextResponse.json({ error: 'Failed to fetch fleet' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      name,
      model,
      capacity,
      range,
      speed,
      pricePerHour,
      features,
      description,
      image,
      images,
      status,
      isActive,
    } = body;

    // Validate input
    if (!name || !model || !capacity || !range || !speed || !pricePerHour) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const fleet = await Fleet.create({
      name,
      model,
      capacity,
      range,
      speed,
      pricePerHour,
      features: features || [],
      description,
      image: image || images?.outside || images?.inside || images?.seats || images?.extra,
      images,
      status: status ?? 'available',
      isActive: isActive ?? true,
    });

    return NextResponse.json(fleet, { status: 201 });
  } catch (error) {
    console.error('Create fleet error:', error);
    return NextResponse.json({ error: 'Failed to create fleet' }, { status: 500 });
  }
}
