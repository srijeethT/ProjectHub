'use client';
import {redirect, useParams} from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import {toast} from "react-toastify";
import EditProject from "@/components/EditProject";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const Page = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // ===== Fetch project details on mount =====
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



    // ===== Handle file selection with preview =====
    const handleFileChange = (e) => {
        console.log('File input triggered');
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            console.log('Selected file:', selectedFile);
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log('Preview ready');
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            console.warn('Invalid file type or no file');
            setFile(null);
            setPreviewUrl(null);
        }
    };

    // ===== Upload + Update project =====
    const uploadAndUpdateProject = async () => {
        if (!file) return;
        setUploading(true);
        try {
            // STEP 1: Upload file
            const formData = new FormData();
            formData.append('image', file);
            const uploadRes = await fetch('/api/upload-project', {
                method: 'POST',
                body: formData,
            });
            if (!uploadRes.ok) throw new Error('Image upload failed');
            const uploadData = await uploadRes.json();
            const uploadedImageUrl = uploadData.url;

            // STEP 2: Update DB with new image URL
            const updatedImages = [...(project.ProjectImage || []), uploadedImageUrl];
            console.log('Updated images:', updatedImages);
            const updateRes = await fetch(`/api/update-project?id=${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ProjectImage: updatedImages }),
            });
            if (!updateRes.ok) toast.error('Project update failed');
            const updatedProjectData = await updateRes.json();

            // STEP 3: Update UI state
            toast.success('Project updated successfully');
            setProject(updatedProjectData.project);
            setFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error('Upload and update error:', error);
            alert('Failed to upload and update images. Please try again.');
        }
        setUploading(false);
    };

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


    const handleDelete = async () => {
        const res = await fetch(`/api/specific-project?id=${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        if (!res.ok) {
            toast.error('Error deleting project: ' + data.message);
            setShowDeleteConfirm(false);
            return;
        }
        toast.success("Project Deleted Successfully");
        setShowDeleteConfirm(false);
        setTimeout(() => {
            window.location.href = "/projects";
        }, 1500); // give user time to see toast before redirect
    };

    return (
        <div className="min-h-screen m-2 p-0 md:mt-35 md:ml-30 dark:bg-zinc-900">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* === IMAGE SLIDER === */}
                {project.ProjectImage?.length > 0 && (
                    <div className="md:w-7/8 w-[350px] h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3500, disableOnInteraction: false }}
                            loop
                            className="w-full h-full"
                        >
                            {project.ProjectImage
                                ?.filter(img => typeof img === 'string' && img.trim() !== '')
                                .map((img, idx) => (
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

                {/* === UPLOAD IMAGE SECTION === */}
                <div className="flex justify-end items-center w-3/4 gap-4">
                    {/* Hidden file input */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                    />

                    {/* Trigger file dialog programmatically */}
                    <section className='flex justify-centre items-center gap-4 w-full md:w-auto'>
                    <Button
                        type="button"
                        className="px-4 py-1 bg-blue-500 text-white rounded"
                        onClick={() => document.getElementById('image-upload').click()}
                    >
                        Add Images
                    </Button>
                        <EditProject/>
                    </section>

                    {/* PREVIEW + UPLOAD BUTTONS */}
                    {previewUrl && (
                        <div className="flex items-center gap-4">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-16 h-16 object-cover rounded-lg border"
                            />
                            <Button
                                onClick={uploadAndUpdateProject}
                                disabled={uploading}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow transition"
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setFile(null);
                                    setPreviewUrl(null);
                                }}
                                className="bg-gray-400 hover:bg-gray-500 text-white rounded-full font-semibold shadow transition"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>

                {/* === PROJECT HEADER === */}
                <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
                    <div className="space-y-1 md:w-1/2">
                        <h1 className="text-4xl font-extrabold text-blue-600">{project.ProjectName}</h1>
                        <p className="text-gray-500">
                            by <span className="font-medium text-zinc-700">{project.ProjectOwner}</span>
                        </p>
                    </div>
                    <section className="flex flex-wrap gap-2  justify-start items-center md:justify-end md:items-center w-full md:w-auto">
                        <a
                            href={project.ProjectWebsiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold shadow transition flex items-center gap-2"
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

                {/* === DESCRIPTION === */}
                <section>
                    <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Description</h2>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {project.ProjectDescription}
                    </p>
                </section>
                <section className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow">
                    <h3 className="text-zinc-500 uppercase font-medium text-xs"> Project Cost</h3>
                    <p className="text-zinc-900 dark:text-zinc-200 font-semibold mt-1">
                       {project.ProjectCost} rupees
                    </p>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow">
                    <h3 className="text-zinc-500 uppercase font-medium text-xs">Status</h3>
                    <p className="text-zinc-900 dark:text-zinc-200 font-semibold mt-1">
                        {project.ProjectStatus}
                    </p>
                </div>
                </section>

                {/* === INFO CARDS === */}
                <section className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow">
                        <h3 className="text-zinc-500 uppercase font-medium text-xs">Category</h3>
                        <p className="text-zinc-900 dark:text-zinc-200 font-semibold mt-1">
                            {project.ProjectCategory}
                        </p>
                    </div>
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow">
                        <h3 className="text-zinc-500 uppercase font-medium text-xs">Technologies</h3>

                        <section className="flex flex-wrap gap-2 text-zinc-900 dark:text-zinc-200 font-semibold mt-2">
                            {project.ProjectTechnologies?.map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-green-400 text-white text-sm rounded-full shadow  transition"
                                >
        {tech}
      </span>
                            ))}
                        </section>
                    </div>

                </section>
                <section className="flex justify-center items-center w-full gap-4">
                    <Button className='bg-red-500 hover:bg-red-600 text-white  rounded-full font-semibold shadow transition' onClick={() => setShowDeleteConfirm(true)}>
                        Delete Project
                    </Button>
                </section>
                <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Confirmation</DialogTitle>
                        </DialogHeader>
                        <div className="text-center py-2">
                            <h1 className="mb-4 text-lg text-gray-800 dark:text-gray-100">
                                Are you sure you want to delete this project?
                            </h1>
                            <div className="flex justify-center gap-4">
                                <Button
                                    className="bg-gray-400 hover:bg-gray-500 text-white rounded-full font-semibold shadow"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold shadow"
                                    onClick={handleDelete}
                                >
                                    Delete Project
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Page;
