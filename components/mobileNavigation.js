'use client';
import React, { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { avatarPlaceholderUrl, navItems } from '../constants';

const MobileNavigation = ({ email }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            {/* Menu Button always visible */}
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                <Image src="/menu2.svg" alt="menu" width={24} height={24} />
            </div>

            {/* Sidebar drawer sliding in from the right */}
            <div
                className={`fixed top-0 right-[-15] z-50 h-full w-64 bg-blue-400 text-white shadow-lg transform transition-transform duration-300 ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Close Icon */}
                <div className="flex justify-end p-3">
                    <Image
                        onClick={() => setOpen(false)}
                        className="cursor-pointer"
                        width={24}
                        height={24}
                        src="/cancel.svg"
                        alt="cancel"
                    />
                </div>

                {/* Navigation Items */}
                <nav className="px-4 py-2">
                    <ul className="flex flex-col gap-4">
                        {navItems.map(({ url, name, icon }) => (
                            <li key={name}>
                                <Link
                                    href={url}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-500 transition duration-200"
                                    onClick={() => setOpen(false)} // close on navigation
                                >
                                    <Image src={icon} alt={name} width={24} height={24} />
                                    <span className="text-sm font-medium">{name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-3 border-t border-blue-300 bg-blue-500 absolute bottom-0 left-0 right-0">
                    <Link href="/profile">
                        <Image
                            src={avatarPlaceholderUrl}
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                    </Link>
                    <p className="text-sm font-light truncate">{email}</p>
                </div>
            </div>

            {/* Overlay to cover rest of the page */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0  z-40"
                />
            )}
        </>
    );
};



export default MobileNavigation;
