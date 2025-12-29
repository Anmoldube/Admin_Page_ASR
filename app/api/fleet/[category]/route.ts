import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { FleetCharter } from '@/models/FleetCharter';
import { FleetAirAmbulance } from '@/models/FleetAirAmbulance';
import { FleetTaxi } from '@/models/FleetTaxi';

function getModel(category: string) {
  switch (category) {
    case 'charter':
      return FleetCharter;
    case 'air-ambulance':
      return FleetAirAmbulance;
    case 'taxi':
      return FleetTaxi;
    default:
      return null;
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ category: string }> }) {
  try {
    const { category } = await ctx.params;
    const Model = getModel(category);
    if (!Model) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 404 });
    }
    await dbConnect();
    const items = await Model.find({ isActive: true });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Fetch fleet by category error:', error);
    return NextResponse.json({ error: 'Failed to fetch fleet' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ category: string }> }) {
  try {
    const { category } = await ctx.params;
    const Model = getModel(category);
    if (!Model) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 404 });
    }
    await dbConnect();
    const body = await req.json();
    const {
      name, model, capacity, range, speed, pricePerHour,
      features, description, image, status, isActive,
    } = body;

    if (!name || !model || !capacity || !range || !speed || !pricePerHour) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = await Model.create({
      name, model, capacity, range, speed, pricePerHour,
      features: features || [], description, image,
      status: status ?? 'available', isActive: isActive ?? true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Create fleet by category error:', error);
    return NextResponse.json({ error: 'Failed to create fleet' }, { status: 500 });
  }
}
