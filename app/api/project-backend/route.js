import connectToDatabase from "../../../Databases/mongodb";
import {JWT_SECRET} from "../../../config/env";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import {cookies} from "next/headers";
import Project from "../../../models/project.model";
import User from "../../../models/user.model";

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const email = decoded.email;

        await connectToDatabase();

        const body = await req.json();
        const {
            projectName,
            projectDescription,
            projectCategory,
            projectTechnologies,
            projectWebsiteLink,
            projectGithubLink,
        } = body;

        // Create the new project
        const newProject = await Project.create({
            ProjectName: projectName,
            ProjectDescription: projectDescription,
            ProjectCategory: projectCategory,
            ProjectTechnologies: projectTechnologies,
            ProjectOwner: email,
            ProjectMembers: [],
            ProjectStatus: 'active',
            ProjectImage: '/default-image.jpg',
            ProjectWebsiteLink: projectWebsiteLink,
            ProjectGithubLink: projectGithubLink,
        });

        // Increment projectCount for the user
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $inc: { projectCount: 1 } },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Project created successfully',
            project: newProject,
            user: updatedUser
        }, { status: 201 });

    } catch (error) {
        console.error('Error in project creation:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET (){
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const email = decoded.email;

        await connectToDatabase();

        const projects = await Project.find({ProjectOwner: email}).select('-ProjectMembers');
        return NextResponse.json({projects}, { status: 200 });

    }catch (e) {
        console.error('Error in get-projects:', e);
    }
}
