import React, { useEffect, useState } from 'react';
import { imageService } from '../../services/api';
import LoadingDots from './LoadingDots';

const ImageSlider = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentImages = async () => {
            try {
                setLoading(true);
                const response = await imageService.getRecentImages();
                setImages(response.images);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recent images:', err);
                setError('Failed to load recent images');
                setLoading(false);
            }
        };

        fetchRecentImages();
    }, []);

    useEffect(() => {
        // Auto-advance the slider every 5 seconds
        if (images.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [images.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Loading recent images...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-96 bg-red-100 rounded-lg flex items-center justify-center">
                <div className='flex items-center flex-wrap'>
                    <div className="bg-red-100 p-4 rounded-md">
                        <p className="text-red-500">{error}</p>
                    </div>
                    <LoadingDots/>
                </div>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No images available. Upload some!</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
            {/* Slider */}
            <div className="relative h-full">
                {images.map((image, index) => {
                    const imageUrl = image.file_path;
                    return (
                        <div
                            key={image.id}
                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                }`}
                        >
                            <img
                                src={imageUrl || "/placeholder.svg"}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                {image.artist_twitter_username && (
                                    <p className="text-white text-lg">
                                        @{image.artist_twitter_username}
                                    </p>
                                )}
                                {image.twitter_content_link && (
                                    <a
                                        href={image.twitter_content_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-300 hover:text-indigo-100 text-sm"
                                    >
                                        View on Twitter
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Arrow navigation */}
            {images.length > 1 && (
                <>
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                        onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)}
                    >
                        &#10094;
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                        onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)}
                    >
                        &#10095;
                    </button>
                </>
            )}
        </div>
    );
};

export default ImageSlider;