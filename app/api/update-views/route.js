import {NextResponse} from "next/server";
import Project from "../../../models/project.model";
import connectToDatabase from "../../../Databases/mongodb";

export async function POST(req) {
    try{
        await connectToDatabase()
        const {id}=await req.json();

        if(!id){
            return NextResponse.json({message:"Project Id is required for updating."});
        }

        const updated = await Project.findByIdAndUpdate(
            id,
            { $inc: { ProjectViews: 1 } },
            { new: true }
        );

        console.log("updating the views of the projects of the users.",updated.ProjectViews);

        if (!updated) return NextResponse.json({ message: 'Project not found' }, { status: 404 });

        return NextResponse.json({ ProjectViews: updated.ProjectViews });
    } catch (e) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}