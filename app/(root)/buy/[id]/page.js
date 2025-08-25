'use client';

import {redirect, useParams} from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FaExternalLinkAlt } from 'react-icons/fa';

const BuyPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState('');
    const [red,setRed]=useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/specific-project?id=${id}`);
                const data = await res.json();
                setProject(data.project);
            } catch (err) {
                console.error('Error fetching project:', err);
            }
        };
        if (id) fetchProject();
    }, [id]);

    if (!project) {
        return (
            <div className="p-10 text-center text-gray-500">Loading project...</div>
        );
    }

    const handleClick=()=>{
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-6 mt-12 lg:px-24">
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">

                {/* ==== IMAGE CAROUSEL ==== */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-2xl shadow-lg overflow-hidden"
                >
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        loop
                        className="w-full h-[400px] lg:h-[500px]"
                    >
                        {project.ProjectImage?.map((img,idx) => (
                            <SwiperSlide key={idx}>
                                <div className="relative w-full h-[400px] lg:h-[500px]">
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
                </motion.div>

                {/* ==== PROJECT DETAILS ==== */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col gap-6"
                >
                    {/* Title + Price */}
                    <div className='flex flex-row justify-between items-center gap-4'>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-extrabold text-gray-800">
                            {project.ProjectName}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            by <span className="font-semibold">{project.ProjectOwner.split('@')[0]}</span>
                        </p>
                        <span className="text-3xl font-bold text-green-600 mt-2">
              ₹{project.ProjectCost?.toLocaleString()}
            </span>
                    </div>
                    <div>
                        <div>Add to Wishlist</div>
                        <Image
                            src={red ? '/redHeart.png' : '/heart.jpg'}
                            alt='heart'
                            width={40}
                            height={40}
                            onClick={() => setRed(!red)}
                        />

                    </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Description</h2>
                        <p className="text-gray-600 mt-2 leading-relaxed">
                            {project.ProjectDescription}
                        </p>
                    </div>

                    {/* Info Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/80 p-4 rounded-lg shadow">
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="font-semibold text-gray-800">
                                {project.ProjectCategory}
                            </p>
                        </div>
                        <div className="bg-white/80 p-4 rounded-lg shadow">
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="font-semibold text-gray-800">
                                {project.ProjectStatus}
                            </p>
                        </div>
                        <div className="bg-white/80 p-4 rounded-lg shadow col-span-2">
                            <p className="text-xs text-gray-500 mb-1">Technologies</p>
                            <div className="flex flex-wrap gap-2">
                                {project.ProjectTechnologies?.map((tech, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                    >
                    {tech}
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Website Link */}
                    {project.ProjectWebsiteLink && (
                        <a
                            href={project.ProjectWebsiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                        >
                            Visit Website <FaExternalLinkAlt size={14} />
                        </a>
                    )}

                    <div className="bg-white/80 p-4 rounded-lg shadow">
                        <p className="text-xs text-gray-500">Project Added Date</p>
                        <p className="font-semibold text-gray-800">
                            {project.ProjectDate.split('T')[0]}
                        </p>
                    </div>

                    {/* Buy Now Button */}
                    <div className="sticky bottom-0 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-lg mt-6">
                        <Button onClick={()=>handleClick()} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-700 hover:to-blue-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md transition">
                            🛒 Buy Now
                        </Button>
                    </div>
                </motion.div>
            </div>
            <div>

            </div>
        </div>
    );
};

export default BuyPage;
