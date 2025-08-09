import { NextResponse } from 'next/server';
import connectToDatabase from '../../../Databases/mongodb';
import User from '../../../models/user.model';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../config/env';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const cookie = cookieStore.get('token')?.value;
        if (!cookie) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(cookie, JWT_SECRET);
        const email = decoded.email;

        const { profileName, mobile, image } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
        }

        await connectToDatabase();

        const updateData = {};
        if (profileName) updateData.profileName = profileName;
        if (mobile) updateData.mobile = mobile;
        if (image) updateData.profilePic = image;

        const updatedUser = await User.findOneAndUpdate(
            { email },
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated', user: updatedUser });
    } catch (e) {
        console.error('Error updating profile:', e);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function GET(req) {
    try{
        const cook=await cookies();
        const cookieStore= cook.get('token')?.value;
        if(!cookieStore){
            return NextResponse.redirect('/signin');
        }
        const decoded=jwt.verify(cookieStore,JWT_SECRET);

        await connectToDatabase();

        const user=await User.findById(decoded.userId).select('-password');
        if(!user){
            NextResponse.json({message:'User not found'},{status:404});
        }

        return NextResponse.json({user});
    }catch (e) {
        console.error('Error in get-user:', e);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
