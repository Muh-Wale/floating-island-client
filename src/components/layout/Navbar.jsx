import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white/80 backdrop-blur-sm shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-indigo-600">Floating Island Hub</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link
                            to="/upload"
                            className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Upload Image
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
