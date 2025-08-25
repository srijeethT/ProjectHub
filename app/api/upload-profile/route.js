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

        const requestData = await req.json();

        // Extract all possible fields
        const {
            profileName,
            mobile,
            image,
            address,
            city,
            state,
            pincode,
            country
        } = requestData;

        if (!email) {
            return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
        }

        await connectToDatabase();

        // Build update object dynamically - only include fields that are provided
        const updateData = {};
        if (profileName !== undefined) updateData.profileName = profileName;
        if (mobile !== undefined) updateData.mobile = mobile;
        if (image !== undefined) updateData.profilePic = image;

        // Add new fields for checkout
        if (address !== undefined) updateData.address = address;
        if (city !== undefined) updateData.city = city;
        if (state !== undefined) updateData.state = state;
        if (pincode !== undefined) updateData.pincode = pincode;
        if (country !== undefined) updateData.country = country;

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


export async function GET() {
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
