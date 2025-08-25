import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../../../config/env";
import Project from "../../../models/project.model";
import {NextResponse} from "next/server";
import {error} from "next/dist/build/output/log";

export async function GET(req) {
    
    try{
        const cookieStore= await cookies();
        const cookie=cookieStore.get('token')?.value;

        if(!cookie){
            return {message:'Unauthorized'};
        }

        const decoded=jwt.verify(cookie,JWT_SECRET);
        const email=decoded.email;

        const projects = await Project.find({ ProjectOwner: { $ne: email } });

        if(!projects){
            return NextResponse.json({message:"Couldn't find any project"},{status:400});
        }

        return NextResponse.json({projects},{status:200});
    }catch (e) {
        console.log(e);
        return NextResponse.json({message:"internal error"}, { status: 500});
    }
}