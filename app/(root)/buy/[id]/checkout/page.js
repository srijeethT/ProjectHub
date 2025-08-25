'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FaLock, FaCreditCard, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const CheckoutPage = () => {
    const { id } = useParams();
    const router = useRouter();

    // Project and User Data
    const [project, setProject] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        profileName: '',
        email: '',
        mobile: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });

    // Validation Errors
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch project details
            const projectRes = await fetch(`/api/specific-project?id=${id}`);
            const projectData = await projectRes.json();

            if (projectRes.ok) {
                setProject(projectData.project);
            }

            // Fetch user details
            const userRes = await fetch('/api/upload-profile');
            const userData = await userRes.json();

            if (userRes.ok) {
                setUser(userData.user);
                // Pre-fill form with user data
                setFormData(prev => ({
                    ...prev,
                    profileName: userData.user.profileName || '',
                    email: userData.user.email || '',
                    mobile: userData.user.mobile || '',
                    address: userData.user.address || '',
                    city: userData.user.city || '',
                    state: userData.user.state || '',
                    pincode: userData.user.pincode || '',
                    country: userData.user.country || 'India'
                }));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.profileName.trim()) newErrors.profileName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
        if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Please enter valid 10-digit mobile number';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Please enter valid 6-digit pincode';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async () => {
        if (!validateForm()) return;

        try {
            setProcessing(true);

            // Update user profile with form data
            await fetch('/api/update-user-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            // Process payment (integrate with payment gateway)
            const paymentData = {
                projectId: id,
                amount: project.ProjectCost,
                userDetails: formData,
                projectDetails: {
                    name: project.ProjectName,
                    owner: project.ProjectOwner
                }
            };

            const paymentRes = await fetch('/api/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });

            const paymentResult = await paymentRes.json();

            if (paymentRes.ok) {
                // Redirect to success page
                router.push(`/payment-success?orderId=${paymentResult.orderId}`);
            } else {
                alert('Payment failed: ' + paymentResult.message);
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <div className="text-lg text-gray-500">Loading checkout...</div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">Project not found</h2>
                    <Button onClick={() => router.push('/')}>Go Back Home</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-6 mt-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                        <FaLock className="text-green-500" />
                        Secure Checkout
                    </h1>
                    <p className="text-gray-600">Complete your purchase securely</p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - User Details Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <FaUser className="text-blue-500" />
                            Billing Details
                        </h2>

                        <div className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="profileName"
                                    value={formData.profileName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.profileName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your full name"
                                />
                                {errors.profileName && <p className="text-red-500 text-sm mt-1">{errors.profileName}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!!user?.email}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    } ${user?.email ? 'bg-gray-100' : ''}`}
                                    placeholder="Enter your email"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            {/* Mobile */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FaPhone className="inline mr-1" />
                                    Mobile Number *
                                </label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.mobile ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter 10-digit mobile number"
                                />
                                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FaMapMarkerAlt className="inline mr-1" />
                                    Address *
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.address ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your complete address"
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>

                            {/* City, State, Pincode */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.city ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="City"
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.state ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="State"
                                    />
                                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.pincode ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="123456"
                                    />
                                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>

                        {/* Project Details */}
                        <div className="border border-gray-200 rounded-lg p-4 mb-6">
                            <div className="flex gap-4">
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                    <Image
                                        src={project.ProjectImage?.[0] || '/default-image.jpg'}
                                        alt={project.ProjectName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 line-clamp-2">
                                        {project.ProjectName}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        by {project.ProjectOwner?.split('@')[0]}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {project.ProjectCategory}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Project Cost</span>
                                <span className="font-semibold">₹{project.ProjectCost?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Platform Fee</span>
                                <span className="font-semibold">₹0</span>
                            </div>
                            <div className="flex justify-between border-t pt-3">
                                <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                                <span className="text-2xl font-bold text-green-600">₹{project.ProjectCost?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payment Button */}
                        <div className="mt-8">
                            <Button
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 rounded-lg text-lg font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaCreditCard />
                                        Pay Now ₹{project.ProjectCost?.toLocaleString()}
                                    </>
                                )}
                            </Button>

                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                    <FaLock className="text-green-500" />
                                    Your payment information is secure and encrypted
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
