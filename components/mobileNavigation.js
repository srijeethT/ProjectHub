'use client';
import React, { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { handleLogout } from "../lib/actions/user.actions";
import { avatarPlaceholderUrl, navItems } from '../constants';

const MobileNavigation = ({email}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Menu Button */}
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                <Image src="/menu2.svg" alt="menu" width={24} height={24} />
            </div>

            {/* Right Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-64 bg-blue-400 text-white shadow-lg transform transition-transform duration-300 ${
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

                {/* Logo */}
                <div className="text-2xl font-bold px-4 mb-6">
                    <Link href="/" onClick={() => setOpen(false)}>
                        ProJectHub
                    </Link>
                </div>

                {/* Nav Links */}
                <div className="flex-1 px-4 overflow-y-auto">
                    {navItems.map(({ url, name }) => (
                        <Link key={name} href={url} onClick={() => setOpen(false)}>
                            <p className="block py-3 rounded hover:bg-blue-300 transition">{name}</p>
                        </Link>
                    ))}
                </div>

                {/* User Info + Logout */}
                <div className="flex flex-col items-center gap-3 p-4 border-t border-blue-300">
                    <div className='flex '>
                        <Image
                            src={avatarPlaceholderUrl}
                            alt="User Avatar"
                            width={36}
                            height={36}
                            className="rounded-full object-cover m-2"
                        />
                        <p className='py-3'>{email}</p>
                    </div>

                    <form action={async () => { await handleLogout(); }}>
                        <button
                            type="submit"
                            className="ml-3 bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
                        >
                            Logout
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default MobileNavigation;
