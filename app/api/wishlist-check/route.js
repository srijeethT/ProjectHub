import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../Databases/mongodb';
import User from '../../../models/user.model';

export async function POST(req) {
    try {
        await connectToDatabase();

        const cookieStore = await cookies();
        const cookie = cookieStore.get('token')?.value;
        if (!cookie) {
            return NextResponse.json({ wishlisted: false });
        }

        const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
        const userEmail = decoded.email;

        const { projectId } = await req.json();

        const user = await User.findOne({ email: userEmail }).select('wishlist');

        if (!user) {
            return NextResponse.json({ wishlisted: false });
        }

        const isWishlisted = user.wishlist.includes(projectId);

        return NextResponse.json({ wishlisted: isWishlisted });
    } catch (error) {
        return NextResponse.json({ wishlisted: false });
    }
}
