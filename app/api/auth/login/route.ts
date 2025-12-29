import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // Mock mode: bypass DB
        const AUTH_MODE = process.env.AUTH_MODE;
        const IS_MOCK = AUTH_MODE === 'mock' || (process.env.NODE_ENV !== 'production' && AUTH_MODE !== 'real');
        if (IS_MOCK) {
            if (!email || !password) {
                return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
            }
            const role = email.includes('admin') ? 'admin' : 'client';
            const token = generateToken('mock-user-id', role);
            return NextResponse.json({
                message: 'Login successful (mock)',
                token,
                user: { id: 'mock-user-id', email, name: 'Mock User', role },
            }, { status: 200 });
        }

        await dbConnect();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Compare password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate token
        const token = generateToken(user._id.toString(), user.role);

        return NextResponse.json(
            {
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
