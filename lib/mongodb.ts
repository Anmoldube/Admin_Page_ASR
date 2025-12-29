import mongoose from 'mongoose';

const AUTH_MODE = process.env.AUTH_MODE;
const IS_MOCK = AUTH_MODE === 'mock';
const MONGODB_URI = process.env.MONGODB_URI;

// Cache across hot reloads in dev
const globalAny = global as any;
if (!globalAny.__mongoose) {
  globalAny.__mongoose = { conn: null as any, promise: null as Promise<typeof mongoose> | null };
}
const cached = globalAny.__mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

export default async function dbConnect() {
  // In mock mode, skip connecting to MongoDB
  if (IS_MOCK) {
    return null as unknown as typeof mongoose;
  }

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false } as any;
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
