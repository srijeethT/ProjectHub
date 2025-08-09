import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../../../config/env";
import connectToDatabase from "../../../Databases/mongodb";
import User from "../../../models/user.model";
import bcrypt from "bcrypt";
import {NextResponse} from "next/server";

export async function POST(req){
    try{

        const cookieStore= await cookies();
        const cookie=cookieStore.get('token')?.value;

        if(!cookie){
            return {message:'Unauthorized'};
        }

        const decoded=jwt.verify(cookie,JWT_SECRET);
        const email=decoded.email;
        const {password,newPassword}=await req.json();

        if (!email || !password || !newPassword) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        await connectToDatabase();
        const user=await User.findOne({email});
        if(!user){
            return NextResponse.json({message:'User not found'},{status:404});
        }

        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return NextResponse.json({message:'Invalid old password'},{status:400});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(newPassword,salt);

        user.password=hashedPassword;
        await user.save();
        return NextResponse.json({message:'Password updated'});

    }catch(e){
        console.error("Error updating password:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}