'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import {Button} from "@/components/ui/button";

const Page = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            const res = await fetch(`/api/specific-project?id=${id}`);
            const data = await res.json();
            setProject(data.project);
        };
        if (id) fetchProject();
    }, [id]);

    if (!project) {
        return (
            <div
                className="p-10 text-center text-gray-500"
                style={{ marginLeft: '250px', marginTop: '64px' }}
            >
                Loading project...
            </div>
        );
    }

    return (
        <div
            className="min-h-screen m-2 p-0 md:mt-15 md:ml-100 dark:bg-zinc-900"
        >
            <div className="max-w-6xl mx-auto space-y-8">

                {/* === Top Full-Width Image Slider === */}
                {project.ProjectImage?.length > 0 && (
                    <div className="md:w-7/8 w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3500, disableOnInteraction: false }}
                            loop
                            className="w-full h-full"
                        >
                            {project.ProjectImage.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="relative w-full h-[400px] md:h-[500px]">
                                        <Image
                                            src={img}
                                            alt={`Project Image ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
                <div className="flex justify-end  items-center w-3/4 gap-4">
                    <Button
                        className='bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold shadow transition flex items-center gap-2'
                        onClick={()=>console.log("clicked")}
                    >Add Images</Button>
                </div>

                {/* === Project Heading === */}
                <div className="flex w-full gap-4">
                <div className=" space-y-1 md:w-1/2">
                    <h1 className="text-4xl font-extrabold text-blue-600">{project.ProjectName}</h1>
                    <p className="text-gray-500">
                        by <span className="font-medium text-zinc-700">{project.ProjectOwner}</span>
                    </p>
                </div>
                <section className="flex flex-wrap gap-2">
                    <a
                        href={project.ProjectWebsiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3  bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold shadow transition flex items-center gap-2"
                    >
                        🔗 Visit Website <FaExternalLinkAlt size={14} />
                    </a>
                    <a
                        href={project.ProjectGithubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 bg-gray-800 hover:bg-gray-900 text-white rounded-full font-semibold shadow transition flex items-center gap-2"
                    >
                        🛠️ View GitHub <FaGithub size={16} />
                    </a>
                </section>
                </div>
                {/* === Description Section === */}
                <section>
                    <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Description</h2>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {project.ProjectDescription}
                    </p>
                </section>

                {/* === Info Section === */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow">
                        <h3 className="text-zinc-500 uppercase font-medium text-xs">Category</h3>
                        <p className="text-zinc-900 dark:text-zinc-200 font-semibold mt-1">
                            {project.ProjectCategory}
                        </p>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow">
                        <h3 className="text-zinc-500 uppercase font-medium text-xs">Status</h3>
                        <p className="text-zinc-900 dark:text-zinc-200 font-semibold mt-1">
                            {project.ProjectStatus}
                        </p>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow">
                        <h3 className="text-zinc-500 uppercase font-medium text-xs">Technologies</h3>
                        <p className="text-zinc-900 dark:text-zinc-200 font-semibold mt-1">
                            {project.ProjectTechnologies?.join(', ')}
                        </p>
                    </div>
                </section>

                {/* === External Links === */}


            </div>
        </div>
    );
};

export default Page;
