'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {redirect} from "next/navigation";

const Page = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/All-Projects'); // 🔹 Your API route
                const data = await res.json();
                setProjects(data.projects || []);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    return (
        <>
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen mt-5 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-row items-center justify-around gap-10">
                <h1 className="text-5xl font-extrabold text-center text-blue-700 mb-12 drop-shadow-md">
                    🚀 Project Marketplace
                </h1>
                <button onClick={()=>redirect('/buy/wishlist')} className='flex items-center  px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    WishList
                </button>

            </div>


            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {projects.map((project) => (
                    <motion.div
                        key={project._id}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="relative bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all flex flex-col group"
                    >
                        {/* Category Badge */}
                        <span className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              {project.ProjectCategory}
            </span>

                        {/* Price Badge */}
                        <span className="absolute top-4 right-4 bg-green-500 text-white font-bold px-3 py-1 rounded-full shadow-md">
              ₹{project.ProjectCost.toLocaleString()}
            </span>

                        {/* Project Image */}
                        <div className="relative w-full h-56 overflow-hidden">
                            <Image
                                src={project.ProjectImage?.[0] || '/default-image.jpg'}
                                alt={project.ProjectName}
                                fill
                                className="object-cover transform group-hover:scale-110 transition duration-500"
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center transition duration-300">
                                <Link
                                    href={`/buy/${project._id}`}
                                    className="bg-white text-gray-800 px-5 py-2 rounded-full font-semibold shadow hover:bg-blue-600 hover:text-white transition"
                                >
                                    Quick View 🔍
                                </Link>
                            </div>
                        </div>

                        {/* Project Details */}
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                                {project.ProjectName}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                {project.ProjectDescription}
                            </p>

                            <div className="text-sm text-gray-500 mb-1">
                                <span className="font-medium">Status:</span> {project.ProjectStatus}
                            </div>
                            <div className="text-sm text-gray-500 mb-4">
                                <span className="font-medium">Owner:</span> {project.ProjectOwner.split('@')[0]}
                            </div>

                            {/* CTA */}
                            <Link
                                href={`/buy/${project._id}`}
                                className="mt-auto block text-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white py-2 rounded-lg font-semibold shadow-md transition"
                            >
                                View Project 🚀
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
        </>
    );
};

export default Page;
