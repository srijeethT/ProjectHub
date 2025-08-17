import { NextResponse } from 'next/server';
import connectToDatabase from '../../../Databases/mongodb';
import Project from '../../../models/project.model';

export async function GET(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
        }

        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        if (Array.isArray(project.ProjectImage)) {
            project.ProjectImage = project.ProjectImage.filter(
                (img) => typeof img === 'string' && img.trim() !== ''
            );
        }

        return NextResponse.json({project}, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();

        const url=new URL(req.url);
        const id=url.searchParams.get('id');
        if(!id){
            return NextResponse.json({message:"Project Id is required for deleting."},{status:400});
        }

        const deleteProject=await Project.findByIdAndDelete(id);

        if(!deleteProject){
            return NextResponse.json({message:"Project not found"},{status:404})
        }

        return NextResponse.json({message:"Project deleted successfully.",project:deleteProject},{status:200})

    }catch (e) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
