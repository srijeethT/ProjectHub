"use client";
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {toast, ToastContainer} from "react-toastify";
import {projectCategories} from "../constants";

const AddProject = () => {

    const [open, setOpen] = useState(false)
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectCategory, setProjectCategory] = useState("");
    const [projectTechnologies, setProjectTechnologies] = useState("");
    const [projectWebsiteLink, setProjectWebsiteLink] = useState("");
    const [projectGithubLink, setProjectGithubLink] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/project-backend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectName,
                projectDescription,
                projectCategory,
                projectTechnologies: projectTechnologies.split(',').map(t => t.trim()),
                projectWebsiteLink,
                projectGithubLink,
            }),
        });

        const data = await res.json();
        setOpen(false);
        if (res.ok) {
            toast.success("Project added successfully!");
            setProjectName('');
            setProjectDescription('');
            setProjectCategory('');
            setProjectTechnologies('');
            setProjectWebsiteLink('');
            setProjectGithubLink('')
        } else {
            toast.error( "Failed to add project");
        }
    };

    return (
        <main className="flex flex-col items-center justify-center  p-6">
            <ToastContainer position="top-center" autoClose={3000} />
            <Dialog open={open} onOpenChange={setOpen} className="w-[500px] max-w-[90vw] bg-background">
                <DialogTrigger className="px-4 py-2 bg-blue-500 text-white rounded">
                    Add Your Project
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            Enter Project Details
                        </DialogTitle>
                        <DialogDescription>
                            Enter the details of your project below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                    <input type="text" placeholder="Project Name" required value={projectName} onChange={(e) => setProjectName(e.target.value)} className="border border-blue-400 rounded px-3 py-2" />
                    <input type="text" placeholder="Project Description" required value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} className="border border-blue-400 rounded px-3 py-2" />
                        <select className="border border-blue-400 rounded px-3 py-2" value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)} >
                            <option value="">Select a Category</option>
                            {projectCategories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                                ))}
                        </select>
                    <input type="text" placeholder="Technologies (comma separated)" required value={projectTechnologies} onChange={(e) => setProjectTechnologies(e.target.value)} className="border border-blue-400 rounded px-3 py-2" />
                    <input type="url" placeholder="Website Link" required value={projectWebsiteLink} onChange={(e) => setProjectWebsiteLink(e.target.value)} className="border border-blue-400 rounded px-3 py-2" />
                    <input type="url" placeholder="GitHub Link" required value={projectGithubLink} onChange={(e) => setProjectGithubLink(e.target.value)} className="border border-blue-400 rounded px-3 py-2" />
                    <button type="submit"  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Submit</button>
                </form>
                </DialogContent>
            </Dialog>
        </main>
    );
};

export default AddProject;
