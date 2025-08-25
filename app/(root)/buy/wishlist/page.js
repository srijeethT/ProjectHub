'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaTrash, FaHeart, FaEye } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const WishlistPage = () => {
    const [wishlistProjects, setWishlistProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/wishlist-works');
            const data = await res.json();

            if (res.ok) {
                setWishlistProjects(data.projects || []);
            } else {
                setError(data.message || 'Failed to fetch wishlist');
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setError('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (projectId) => {
        try {
            const res = await fetch('/api/wishlist-works', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, action: 'remove' }),
            });

            if (res.ok) {
                // Remove from local state
                setWishlistProjects(prev => prev.filter(project => project._id !== projectId));
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <div className="text-lg text-gray-500">Loading your wishlist...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">{error}</h2>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-6 mt-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                        <FaHeart className="text-red-500" />
                        My Wishlist
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {wishlistProjects.length > 0
                            ? `You have ${wishlistProjects.length} project${wishlistProjects.length > 1 ? 's' : ''} in your wishlist`
                            : 'Your wishlist is currently empty'
                        }
                    </p>
                </motion.div>

                {wishlistProjects.length === 0 ? (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-8xl mb-6">💔</div>
                        <h2 className="text-3xl font-semibold text-gray-600 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Start exploring projects and add the ones you love to your wishlist. They'll appear here for easy access!
                        </p>
                        <Link href="/buy">
                            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-700 hover:to-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
                                Browse Projects
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    // Wishlist Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistProjects.map((project, index) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                {/* Project Image */}
                                <div className="relative h-48 group">
                                    <Image
                                        src={project.ProjectImage?.[0] || '/default-image.jpg'}
                                        alt={project.ProjectName}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>

                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeFromWishlist(project._id)}
                                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                                        title="Remove from wishlist"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>

                                {/* Project Details */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                                        {project.ProjectName}
                                    </h3>

                                    <p className="text-sm text-gray-500 mb-2">
                                        by <span className="font-semibold">{project.ProjectOwner?.split('@')[0]}</span>
                                    </p>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {project.ProjectDescription}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                            {project.ProjectCategory}
                                        </span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                            {project.ProjectStatus}
                                        </span>
                                    </div>

                                    {/* Technologies */}
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-1">
                                            {project.ProjectTechnologies?.slice(0, 3).map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.ProjectTechnologies?.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                    +{project.ProjectTechnologies.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-2xl font-bold text-green-600">
                                            ₹{project.ProjectCost?.toLocaleString() || 0}
                                        </span>
                                        {project.ProjectWebsiteLink && (
                                            <a
                                                href={project.ProjectWebsiteLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title="Visit Website"
                                            >
                                                <FaExternalLinkAlt size={16} />
                                            </a>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Link href={`/buy/${project._id}`} className="flex-1">
                                            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-700 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Back to Home Button */}
                {wishlistProjects.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-12"
                    >
                        <Link href="/buy">
                            <Button variant="outline" className="px-8 py-3 text-lg font-semibold border-2 hover:bg-blue-50 transition-all duration-200">
                                Continue Browsing
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
