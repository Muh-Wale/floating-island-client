import React from 'react';
import ImageSlider from '../components/gallery/ImageSlider';
import ImageGallery from '../components/gallery/ImageGallery';

const HomePage = () => {
    return (
        <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6"></h1>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Uploads</h2>
                <ImageSlider />
            </div>
            <ImageGallery />
        </div>
    );
};

export default HomePage;