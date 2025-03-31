import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white/80 backdrop-blur-sm py-6 shadow-inner mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray text-sm">
                    &copy; {new Date().getFullYear()} Wale_da_Xpert. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
