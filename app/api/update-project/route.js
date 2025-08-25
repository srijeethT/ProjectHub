import { NextResponse } from "next/server";
import connectToDatabase from "../../../Databases/mongodb";
import Project from "../../../models/project.model";

export async function POST(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "Project ID is required" }, { status: 400 });
        }

        const updateData = await req.json();

        if (updateData.ProjectName) {
            const existing = await Project.findOne({
                ProjectName: { $regex: `^${updateData.ProjectName.trim()}$`, $options: 'i' }, // case-insensitive match
                _id: { $ne: id } //
            });

            if (existing) {
                return NextResponse.json(
                    { message: "Project name already exists" },
                    { status: 400 }
                );
            }
        }
        // Validate ProjectImage if it's included
        if ("ProjectImage" in updateData) {
            if (!Array.isArray(updateData.ProjectImage)) {
                return NextResponse.json({ message: "ProjectImage must be an array" }, { status: 400 });
            }
            const defaultImage = "/default-image.jpg";
            // Filter out the default image if present
            updateData.ProjectImage = updateData.ProjectImage.filter(img => img !== defaultImage);
        }

        // Update the project document with the provided fields only

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedProject) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Project updated successfully",
            project: updatedProject,
        });
    } catch (e) {
        console.error("Error in update-project:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
