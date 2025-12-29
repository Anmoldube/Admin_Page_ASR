import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Flight } from '@/models/Flight';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Mock mode
        const AUTH_MODE = process.env.AUTH_MODE;
        const IS_MOCK = AUTH_MODE === 'mock' || (process.env.NODE_ENV !== 'production' && AUTH_MODE !== 'real');
        if (IS_MOCK) {
            const from = searchParams.get('from') || 'DEL';
            const to = searchParams.get('to') || 'BOM';
            const date = searchParams.get('date');
            const base = new Date(date || Date.now() + 86400000);
            const mock = [
                {
                    _id: 'fl1',
                    flightNumber: 'ASR101',
                    departure: { airport: from, city: 'City A', time: base },
                    arrival: { airport: to, city: 'City B', time: new Date(base.getTime() + 2*60*60*1000) },
                    price: 250000,
                    availableSeats: 5,
                    totalSeats: 8,
                    status: 'scheduled',
                },
            ];
            return NextResponse.json(mock, { status: 200 });
        }

        await dbConnect();
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const date = searchParams.get('date');

        // Build query
        let query: any = { isActive: true, status: 'scheduled' };

        if (from) {
            query['departure.airport'] = { $regex: from, $options: 'i' };
        }
        if (to) {
            query['arrival.airport'] = { $regex: to, $options: 'i' };
        }
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query['departure.time'] = { $gte: startDate, $lt: endDate };
        }

        const flights = await Flight.find(query).populate('fleet').exec();

        return NextResponse.json(flights, { status: 200 });
    } catch (error) {
        console.error('Fetch flights error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch flights' },
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
            return NextResponse.json({
                _id: 'fl-created',
                ...body,
                availableSeats: body.availableSeats ?? body.totalSeats,
                status: 'scheduled',
            }, { status: 201 });
        }

        await dbConnect();

        const {
            flightNumber,
            departure,
            arrival,
            fleet,
            price,
            availableSeats,
            totalSeats,
        } = body;

        // Validate input
        if (!flightNumber || !departure || !arrival || !fleet || !price || !totalSeats) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if flight already exists
        const existingFlight = await Flight.findOne({ flightNumber });
        if (existingFlight) {
            return NextResponse.json(
                { error: 'Flight already exists' },
                { status: 409 }
            );
        }

        const flight = await Flight.create({
            flightNumber,
            departure,
            arrival,
            fleet,
            price,
            availableSeats: availableSeats || totalSeats,
            totalSeats,
        });

        return NextResponse.json(flight, { status: 201 });
    } catch (error) {
        console.error('Create flight error:', error);
        return NextResponse.json(
            { error: 'Failed to create flight' },
            { status: 500 }
        );
    }
}
