import React, { useEffect, useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';

const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext, onGoToImage }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);
    const [slideshowActive, setSlideshowActive] = useState(false);
    const slideshowTimerRef = useRef(null);
    const currentImage = images[currentIndex];

    // Preload the current image
    useEffect(() => {
        if (!currentImage) return;

        setIsLoading(true);
        setIsZoomed(false); // Reset zoom when changing images
        const img = new Image();
        img.src = currentImage.file_path;
        img.onload = () => {
            setIsLoading(false);
        };
    }, [currentImage]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (isZoomed) {
                    setIsZoomed(false);
                } else {
                    onClose();
                }
            }
            if (!isZoomed) {
                if (e.key === 'ArrowLeft') onPrev();
                if (e.key === 'ArrowRight') onNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        // Prevent scrolling when lightbox is open
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [onClose, onPrev, onNext, isZoomed]);

    // Slideshow functionality
    useEffect(() => {
        if (slideshowActive) {
            slideshowTimerRef.current = setInterval(() => {
                onNext();
            }, 3000); // Change image every 3 seconds
        } else if (slideshowTimerRef.current) {
            clearInterval(slideshowTimerRef.current);
        }

        return () => {
            if (slideshowTimerRef.current) {
                clearInterval(slideshowTimerRef.current);
            }
        };
    }, [slideshowActive, onNext]);

    // Set up swipe handlers
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => !isZoomed && onNext(),
        onSwipedRight: () => !isZoomed && onPrev(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
        if (slideshowActive) {
            setSlideshowActive(false);
        }
    };

    const toggleSlideshow = () => {
        setSlideshowActive(!slideshowActive);
        if (isZoomed) {
            setIsZoomed(false);
        }
    };

    // const handleDownload = () => {
    //     if (!currentImage) return;

    //     // Create a temporary anchor element
    //     const link = document.createElement('a');
    //     link.href = currentImage.file_path;

    //     // Extract filename from URL
    //     const filename = currentImage.file_path.split('/').pop();
    //     link.download = filename || 'image';

    //     // Append to body, click, and remove
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    if (!currentImage) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fadeIn"
            style={{ animation: 'fadeIn 0.3s ease-in-out' }}
        >
            {/* Control buttons */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
                {/* Download button */}
                {/* <button
                    onClick={handleDownload}
                    className="text-white hover:text-gray-300 bg-black/50 p-2 rounded-full"
                    aria-label="Download image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button> */}

                {/* Slideshow button */}
                <button
                    onClick={toggleSlideshow}
                    className={`text-white hover:text-gray-300 p-2 rounded-full ${slideshowActive ? 'bg-indigo-600' : 'bg-black/50'
                        }`}
                    aria-label={slideshowActive ? "Pause slideshow" : "Start slideshow"}
                >
                    {slideshowActive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </button>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300 bg-black/50 p-2 rounded-full"
                    aria-label="Close lightbox"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Zoom button */}
            <button
                onClick={toggleZoom}
                className="absolute top-4 left-4 text-white hover:text-gray-300 z-10 bg-black/50 p-2 rounded-full"
                aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
                {isZoomed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                )}
            </button>

            {/* Navigation buttons - only show when not zoomed */}
            {!isZoomed && (
                <>
                    <button
                        onClick={onPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                        aria-label="Previous image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={onNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                        aria-label="Next image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Image container with swipe handlers */}
            <div
                {...swipeHandlers}
                className={`relative ${isZoomed ? 'cursor-zoom-out overflow-auto' : 'cursor-zoom-in max-w-[90vw] max-h-[90vh]'}`}
                style={isZoomed ? { width: '100vw', height: '100vh' } : {}}
            >
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                )}

                <img
                    src={currentImage.file_path || "/placeholder.svg"}
                    alt="Enlarged view"
                    onClick={toggleZoom}
                    className={`transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                        } ${isZoomed
                            ? 'max-w-none max-h-none w-auto h-auto'
                            : 'max-w-full max-h-[90vh] object-contain'
                        }`}
                />

                {/* Image info - only show when not zoomed */}
                {!isZoomed && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                        {currentImage.artist_twitter_username && (
                            <p className="text-lg">
                                @{currentImage.artist_twitter_username}
                            </p>
                        )}

                        {currentImage.twitter_content_link && (
                            <a
                                href={currentImage.twitter_content_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-300 hover:text-indigo-100 text-sm"
                                onClick={(e) => e.stopPropagation()}
                            >
                                View on Twitter
                            </a>
                        )}

                        <p className="text-gray-300 text-xs mt-1">
                            {new Date(currentImage.upload_date).toLocaleDateString()}
                        </p>

                        <p className="text-gray-300 text-sm mt-2">
                            Image {currentIndex + 1} of {images.length}
                        </p>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {!isZoomed && (
                <div className="absolute bottom-24 left-0 right-0 flex justify-center">
                    <div className="bg-black/70 rounded-lg p-2 overflow-x-auto max-w-[90vw]">
                        <div className="flex space-x-2">
                            {images.map((image, index) => (
                                <div
                                    key={image.id}
                                    onClick={() => {
                                        if (slideshowActive) setSlideshowActive(false);
                                        onGoToImage(index);
                                    }}
                                    className={`w-16 h-16 flex-shrink-0 cursor-pointer transition-all duration-200 ${index === currentIndex
                                        ? 'border-2 border-indigo-500 scale-110'
                                        : 'border border-gray-600 opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={image.file_path || "/placeholder.svg"}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lightbox;