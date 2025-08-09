'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';

const Page = () => {
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState('/profile.jpg');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingMobile, setIsEditingMobile] = useState(false);
    const [password, setPassword] = useState('');
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/upload-profile');
                const data = await res.json();
                if (data.user) {
                    if (data.user.profilePic) setPreviewUrl(data.user.profilePic);
                    if (data.user.profileName) setName(data.user.profileName);
                    if (data.user.mobile) setMobile(data.user.mobile);
                }
            } catch (e) {
                console.log("Could not fetch profile", e);
            }
        };

        fetchProfile();
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result;
                setPreviewUrl(base64);

                const res = await fetch('/api/upload-profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: base64,
                    }),
                });

                const data = await res.json();
                if (!res.ok) {
                    toast.error('Error uploading image: ' + data.message);
                } else {
                    toast.success('Profile picture updated successfully!');
                }
            };
            reader.readAsDataURL(file);
        }
    };


    const handleProfileUpdate = async () => {
        const res = await fetch('/api/upload-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileName: name, mobile }),
        });

        const data = await res.json();
        if (!res.ok) {
            toast.error('Error updating profile: ');
        } else {
            toast.success('Profile updated:');
            setIsEditingName(false);
            setIsEditingMobile(false);
        }
    };

    const handlePasswordChange = async () => {

            const res=await fetch('/api/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, newPassword }),
            })

            const data=await res.json()
            if(!res.ok){
                toast.error('Error updating password: ' + data.message);
                return
            }
            setIsEditingPassword(false);
            toast.success("Password Updated Successfully")

    }


    return (
        <div className='flex flex-col items-center'>
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="flex flex-col items-center pt-10">
                {/* Profile Image */}
                <div className="pb-4">
                    <Image
                        src={previewUrl}
                        alt="profile"
                        className="rounded-full object-contain bg-gray-200"
                        width={154}
                        height={154}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="inline-flex items-center border-2 border-blue-400 rounded-full px-3 py-1 text-sm hover:bg-blue-100 transition"
                >
                    <span className="mr-2">Upload Profile Pic</span>
                    <Image src="/upload.svg" alt="upload" width={20} height={20} />
                </button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                />
            </div>

            {/* Name Section */}
            <div className="pt-5 w-full max-w-md px-4">
                <label className="block text-gray-700">Profile Name</label>
                <div className="flex items-center gap-3">
                    {isEditingName ? (
                        <>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border-1 border-blue-400 rounded p-2 w-full"
                            />
                            <button onClick={() => handleProfileUpdate()} className="text-blue-600 font-medium">Save</button>
                        </>
                    ) : (
                        <>
                            <span className="text-lg">{name}</span>
                            <button onClick={() => setIsEditingName(true)} className="text-blue-600 font-medium">Edit</button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Number Section */}
            <div className="pt-5 w-full max-w-md px-4">
                <label className="block text-gray-700">Mobile Number</label>
                <div className="flex items-center gap-3">
                    {isEditingMobile ? (
                        <>
                            <input
                                type="text"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="border-1 border-blue-400 rounded p-2 w-full"
                            />
                            <button onClick={() => handleProfileUpdate()} className="text-blue-600 font-medium">Save</button>
                        </>
                    ) : (
                        <>
                            <span className="text-lg">{mobile}</span>
                            <button onClick={() => setIsEditingMobile(true)} className="text-blue-600 font-medium">Edit</button>
                        </>
                    )}
                </div>
            </div>

            {/* Change Password */}
            <div className="pt-5 w-full max-w-md px-4">
                <div className='flex flex-col items-center gap-3'>
                    <span onClick={()=>setIsEditingPassword(!isEditingPassword)} className="cursor-pointer rounded text-center p-2 w-1/2  bg-blue-400 border-1 border-white text-white">Change Password</span>

                </div>
                {isEditingPassword &&
                    <div className="flex flex-col items-center p-2 gap-3">
                        <input
                        type="password"
                        placeholder="Old Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-1 border-blue-400 rounded p-2 w-full"/>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border-1 border-blue-400 rounded p-2 w-full"/>
                        <button onClick={() => handlePasswordChange()}
                    className="text-white p-1 border-1 border-white bg-blue-400 font-medium">Update
                </button>
                </div> }
            </div>
        </div>
    );
};

export default Page;
