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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      const one = await Model.findById(id);
      if (!one) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(one, { status: 200 });
    }
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
      features, description, image, images, status, isActive,
    } = body;

    if (!name || !model || !capacity || !range || !speed || !pricePerHour) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = await Model.create({
      name, model, capacity, range, speed, pricePerHour,
      features: features || [], description,
      image: image || images?.outside || images?.inside || images?.seats || images?.extra,
      images,
      status: status ?? 'available', isActive: isActive ?? true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Create fleet by category error:', error);
    return NextResponse.json({ error: 'Failed to create fleet' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ category: string }> }) {
  try {
    const { category } = await ctx.params;
    const Model = getModel(category);
    if (!Model) return NextResponse.json({ error: 'Invalid category' }, { status: 404 });
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();
    const update: any = { ...body };
    if (!update.image && update.images) {
      update.image = update.images.outside || update.images.inside || update.images.seats || update.images.extra;
    }
    const updated = await Model.findByIdAndUpdate(id || body._id, update, { new: true });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Update fleet error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ category: string }> }) {
  try {
    const { category } = await ctx.params;
    const Model = getModel(category);
    if (!Model) return NextResponse.json({ error: 'Invalid category' }, { status: 404 });
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const res = await Model.deleteOne({ _id: id });
    if (res.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete fleet error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
