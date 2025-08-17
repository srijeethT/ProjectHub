'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import Link from "next/link";
import { useCopilotAction } from "@copilotkit/react-core";
import {useRouter} from "next/navigation";

const ProjectCard = () => {
    const [projects, setProjects] = useState([]);
    const router=useRouter();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/project-backend');
                const data = await res.json();
                console.log("Fetched projects:", data.projects);
                if (!data) return;
                setProjects(data.projects || []);
            } catch (e) {
                console.log("Could not fetch projects", e);
            }
        };
        fetchProjects();
    }, []);

    useCopilotAction({
        name: "openProject",
        description: "Open the project by project name",
        parameters: [
            {
                name: "open",
                type: "string",
                description: "The name of the project to open",
                required: true,
            },
        ],
        handler: async ({ open }) => {
            const normalized = open.trim().toLowerCase();

            // Search inside projects (plural)
            const projec = projects.find(
                p => p.ProjectName.trim().toLowerCase() === normalized
            );

            console.log("Matched project:", projec);
            if (!projec) {
                alert(`Project "${open}" not found.`);
                return;
            }

            router.push(`/projects/${projec._id}`);
        },
    });



    return (
        <>
            <h1 className="text-3xl text-center font-bold ml-10 mt-6 mb-4">Your Projects</h1>

            {/* Container that fills available space (excluding navbar & sidebar) */}
            <div className="flex ml-10 justify-center items-center w-full px-4">
                {/* Content wrapper */}
                <section className="flex flex-col gap-6 max-w-3xl w-full pb-10">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition border"
                        >
                            {project.ProjectImage[0] && <Image
                                src={project.ProjectImage[0]}
                                alt={project.ProjectName}
                                width={1200}
                                height={700}
                                className="object-cover w-full h-64"
                            />}
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-semibold text-gray-800">
                                        {project.ProjectName}
                                    </h3>
                                    <Link
                                        href={`/projects/${project._id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Open
                                    </Link>
                                </div>

                                <p className="text-gray-600">{project.ProjectDescription}</p>

                                <div className="text-sm text-gray-500">
                                    <strong>Technologies:</strong>{" "}
                                    {project.ProjectTechnologies.join(", ")}
                                </div>

                                <div className="text-sm text-gray-500">
                                    <strong>Owner:</strong> {project.ProjectOwner}
                                </div>

                                <div className="flex justify-start gap-6 pt-4">
                                    <a
                                        href={project.ProjectWebsiteLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline flex items-center gap-1"
                                    >
                                        Website <FaExternalLinkAlt size={14} />
                                    </a>
                                    <a
                                        href={project.ProjectGithubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-800 hover:text-black flex items-center gap-1"
                                    >
                                        GitHub <FaGithub size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </>
    );
};

export default ProjectCard;
