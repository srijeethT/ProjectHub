import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../Databases/mongodb';
import User from '../../../models/user.model'; // Your user model path

export async function POST(req) {
    try {
        await connectToDatabase();

        // Get user from JWT token
        const cookieStore = await cookies();
        const cookie = cookieStore.get('token')?.value;
        if (!cookie) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
        const userEmail = decoded.email;

        const { projectId, action } = await req.json(); // action: 'add' or 'remove'

        if (!projectId) {
            return NextResponse.json({ message: 'Project ID required' }, { status: 400 });
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (action === 'add') {
            // Add to wishlist if not already there
            if (!user.wishlist.includes(projectId)) {
                user.wishlist.push(projectId);
                await user.save();
            }
            return NextResponse.json({ message: 'Added to wishlist', wishlisted: true });
        } else {
            // Remove from wishlist
            user.wishlist = user.wishlist.filter(id => id.toString() !== projectId);
            await user.save();
            return NextResponse.json({ message: 'Removed from wishlist', wishlisted: false });
        }

    } catch (error) {
        console.error('Wishlist error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        const cookieStore = await cookies();
        const cookie = cookieStore.get('token')?.value;
        if (!cookie) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
        const userEmail = decoded.email;

        // Get user with populated wishlist
        const user = await User.findOne({ email: userEmail })
            .populate('wishlist')
            .select('wishlist');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ projects: user.wishlist }, { status: 200 });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}