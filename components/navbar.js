import MobileNavigation from "@/components/mobileNavigation";
import React from 'react';
import Link from 'next/link';
import { handleLogout } from "../lib/actions/user.actions";

const Navbar = ({ email }) => {
    return (
        <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-3 bg-blue-400 text-white shadow-md z-50">
            {/* Logo */}
            <Link href="/" className="text-xl font-semibold">
                ProJectHub
            </Link>

            {/* Right side: Logout (hidden on small) and Mobile Menu */}
            <div className="flex items-center space-x-4">
                {/* Logout button visible on large */}
                <div className=" lg:block">
                    <form
                        action={async () => {
                            'use server';
                            await handleLogout();
                        }}
                    >
                        <button
                            type="submit"
                            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition"
                        >
                            Logout
                        </button>
                    </form>
                </div>

                {/* Mobile menu button + drawer */}
                <MobileNavigation email={email} />
            </div>
        </div>
    );
};

export default Navbar;