'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { avatarPlaceholderUrl, navItems } from '../constants';

const Sidebar = ({ email }) => {
    return (
        <aside className="hidden fixed lg:flex h-screen w-64 bg-blue-400 text-white flex-col shadow-lg transition-all duration-300">
            <div className="flex-1 overflow-y-auto px-2 py-4 custom-scrollbar">
                <div className="mb-8 px-2">
                    <Link href="/" className="text-2xl font-extrabold tracking-wide block lg:text-3xl">
                        ProJectHub
                    </Link>
                </div>
                <nav>
                    <ul className="flex flex-col gap-4">
                        {navItems.map(({ url, name, icon }) => (
                            <li key={name}>
                                <Link
                                    href={url}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-500 transition duration-200"
                                >
                                    <Image src={icon} alt={name} width={24} height={24} />
                                    <span className="hidden lg:inline text-sm font-medium">{name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 border-t border-blue-300 bg-blue-500">
                <Link href="/profile">
                    <Image
                        src={avatarPlaceholderUrl}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    />
                </Link>

                <div className="hidden lg:block">
                    <p className="text-sm font-light truncate">{email}</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
