"use server"
import mongoose from "mongoose";
import User from "../../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {JWT_EXPIRE, JWT_SECRET,NODE_ENV} from "../../config/env";
import connectToDatabase from "../../Databases/mongodb";
import {cookies} from "next/headers";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

export const createUser = async ({email,password}) => {
    await connectToDatabase();
   const session= await mongoose.startSession();
   session.startTransaction();

   try{
       const existingUser=await User.findOne({email});

       if(existingUser){
           throw new Error('User already exists');
       }

       const salt=await bcrypt.genSalt(10)
       const hashedPassword=await bcrypt.hash(password,salt);

       const newUser=await User.create([{email,password:hashedPassword}],{session});

       const token= jwt.sign({ userId: newUser[0]._id, email: newUser[0].email },JWT_SECRET, {expiresIn:JWT_EXPIRE} );
       await session.commitTransaction();
       session.endSession();

       // Return only necessary user data to avoid circular references
       const userData = {
           _id: newUser[0]._id.toString(),
           email: newUser[0].email
       };
        const cookiesStore = await cookies();
        cookiesStore.set('token', token, {
           httpOnly: true,
           secure: NODE_ENV==='production',
           sameSite: 'strict',
           maxAge: 60 * 60 * 24 // 1 day, adjust as needed
       });

       return { token, user: userData };
   }catch(error){
       await session.abortTransaction();
       session.endSession();
       throw error;
   }
}

export const validateUser= async ({email,password})=>{
    await connectToDatabase();

    try {
        const existingUser=await User.findOne({email});
        if(!existingUser){
            throw new Error('User does not exist');
        }

        const isMatch=await bcrypt.compare(password,existingUser.password);
        if(!isMatch){
            throw new Error('Invalid password');
        }

        const token= jwt.sign({userId: existingUser._id,email:existingUser.email},JWT_SECRET, {expiresIn:JWT_EXPIRE} );

        // Return only necessary user data to avoid circular references
        const userData = {
            _id: existingUser._id.toString(),
            email: existingUser.email
        };
        const cookiesStore = await cookies();
        cookiesStore.set('token', token, {
            httpOnly: true,
            secure: NODE_ENV==='production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 day, adjust as needed
        });

        return { token, user: userData };
    }catch (e) {
        throw e;
    }
}

export const handleLogout = async () => {
    const cookiesStore = await cookies();
    cookiesStore.set('token','',{
        httpOnly: true,
        expires: new Date(0),
        path:'/',
    })
}
