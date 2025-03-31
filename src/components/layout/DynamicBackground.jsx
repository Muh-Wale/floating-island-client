import React, { useEffect, useState } from 'react';
import { imageService } from '../../services/api';

const DynamicBackground = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Fetch images for background
    useEffect(() => {
        const fetchBackgroundImages = async () => {
            try {
                // Get a larger set of images for the background
                const response = await imageService.getImages(1, 20, 'newest');
                if (response.images && response.images.length > 0) {
                    setImages(response.images);
                }
            } catch (error) {
                console.error('Error fetching background images:', error);
            }
        };

        fetchBackgroundImages();
    }, []);

    // Set up the image rotation
    useEffect(() => {
        if (images.length <= 1) return;

        const rotateBackground = () => {
            setIsTransitioning(true);

            // After the transition starts, prepare the next image
            setTimeout(() => {
                setCurrentIndex(nextIndex);
                setNextIndex((nextIndex + 1) % images.length);
                setIsTransitioning(false);
            }, 1000); // This should match the CSS transition duration
        };

        const intervalId = setInterval(rotateBackground, 8000); // Change image every 8 seconds

        return () => clearInterval(intervalId);
    }, [images, nextIndex]);

    // If no images, return null
    if (images.length === 0) return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Current image */}
            <div
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-20'
                    }`}
                style={{
                    backgroundImage: `url(${images[currentIndex]?.file_path})`,
                }}
            />

            {/* Next image (preloaded) */}
            <div
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${isTransitioning ? 'opacity-20' : 'opacity-0'
                    }`}
                style={{
                    backgroundImage: `url(${images[nextIndex]?.file_path})`,
                }}
            />

            {/* Overlay to ensure content is readable */}
            <div className="absolute inset-0 bg-gray-300/30" />
        </div>
    );
};

export default DynamicBackground;