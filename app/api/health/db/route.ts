import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const AUTH_MODE = process.env.AUTH_MODE;
    const MONGODB_URI = process.env.MONGODB_URI ? 'set' : 'unset';

    // Attempt connection (no-op if already connected)
    await dbConnect();

    const readyState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
    let serverVersion: string | null = null;
    let result: any = null;

    if (readyState === 1 && mongoose.connection.db) {
      try {
        // buildInfo is lighter than serverStatus and allowed without admin auth in many setups
        result = await mongoose.connection.db.admin().command({ buildInfo: 1 });
        serverVersion = result?.version ?? null;
      } catch {
        // ignore if permissions do not allow
      }
    }

    return NextResponse.json({
      ok: readyState === 1,
      readyState,
      authMode: AUTH_MODE ?? 'unset',
      mongodbUri: MONGODB_URI,
      serverVersion,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error?.message ?? 'Unknown error',
      authMode: process.env.AUTH_MODE ?? 'unset',
      mongodbUri: process.env.MONGODB_URI ? 'set' : 'unset',
    }, { status: 500 });
  }
}
