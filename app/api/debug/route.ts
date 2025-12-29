import { NextResponse } from 'next/server';

export async function GET() {
  const production = process.env.NODE_ENV === 'production';
  return NextResponse.json({
    message: 'Debug endpoints (disabled in production)',
    disabled: production,
    endpoints: production ? [] : [
      '/api/debug/deals',
      '/api/debug/flights',
      '/api/debug/bookings',
      '/api/debug/users',
    ],
    note: 'Use ?limit=50 to control size. Available only when NODE_ENV !== production.'
  });
}
