import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            return NextResponse.json(
                { message: 'Admin account already exists', admin: existingAdmin },
                { status: 200 }
            );
        }

        // Create admin account
        const hashedPassword = await hashPassword('admin@123');
        const admin = await User.create({
            email: 'admin@gmail.com',
            password: hashedPassword,
            name: 'Admin User',
            phone: '+1 (555) 123-4567',
            role: 'admin',
            isActive: true,
        });

        return NextResponse.json(
            {
                message: 'Admin account created successfully',
                admin: {
                    id: admin._id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { error: 'Failed to create admin account' },
            { status: 500 }
        );
    }
}
