import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { email, password, name, role, phone } = body;

        // Validate input
        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            role,
            phone,
        });

        // Generate token
        const token = generateToken(user._id.toString(), user.role);

        return NextResponse.json(
            {
                message: 'User registered successfully',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}
