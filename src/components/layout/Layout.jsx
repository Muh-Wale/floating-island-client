import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import DynamicBackground from './DynamicBackground';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen relative">
            <DynamicBackground />
            <Navbar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;