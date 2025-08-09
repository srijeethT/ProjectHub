import React from 'react';
import Link from 'next/link';
import MobileNavigation from './mobileNavigation';
import { handleLogout } from "../lib/actions/user.actions";

const Navbar = ({email}) => {
    return (
        <div className="flex fixed-top justify-between items-center px-4 py-3 bg-blue-400 text-white shadow-md">
            {/* Mobile layout */}
            <div className="lg:hidden w-full flex justify-between items-center">
                <Link href="/" className="text-xl font-semibold">
                    ProJectHub
                </Link>
                <MobileNavigation email={email} />
            </div>

            {/* Desktop logout button */}
            <div className="hidden lg:flex justify-end w-full">
                <form action={async () => {
                    'use server';
                    await handleLogout();
                }}>
                    <button
                        type="submit"
                        className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition"
                    >
                        Logout
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Navbar;
