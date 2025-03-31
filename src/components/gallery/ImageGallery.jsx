import React, { useEffect, useState } from 'react';
import { imageService } from '../../services/api';
import ImageCard from './ImageCard';
import Lightbox from './Lightbox';
import LoadingDots from './LoadingDots';

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sort, setSort] = useState('newest');
    const [limit, setLimit] = useState(10);

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchImages();
    }, [page, sort, limit]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await imageService.getImages(page, limit, sort);
            setImages(response.images);
            setTotalPages(response.totalPages);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching images:', err);
            setError('Failed to load images');
            setLoading(false);
        }
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPage(1); // Reset to first page when changing sort
    };

    const handleViewMore = () => {
        setLimit(30);
        setPage(1); // Reset to first page when viewing more
    };

    const handlePrevPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Lightbox handlers
    const openLightbox = (image) => {
        const index = images.findIndex(img => img.id === image.id);
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const goToPrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    // New function to go directly to a specific image
    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className="mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Image Gallery</h2>
                <div className="flex items-center space-x-4">
                    <label htmlFor="sort" className="text-sm md:text-base text-gray-700">Sort by:</label>
                    <select
                        id="sort"
                        value={sort}
                        onChange={handleSortChange}
                        className="border rounded-md px-3 py-1.5 bg-white"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>

                    {limit === 10 && (
                        <button
                            onClick={handleViewMore}
                            className="px-4 py-1 md:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex gap-1"
                        >
                            <span className='hidden md:block'>View</span> More
                        </button>
                    )}
                </div>
            </div>

            {loading && images.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(limit)].map((_, index) => (
                        <div key={index} className="bg-gray-200 animate-pulse h-64 rounded-lg"></div>
                    ))}
                </div>
            ) : error ? (
                <div className='flex gap-1 items-center flex-wrap bg-red-100 p-4 rounded-md justify-center'>
                    <div className="">
                        <p className="text-red-500">{error}</p>
                    </div>
                    <LoadingDots/>
                </div>
            ) : images.length === 0 ? (
                <div className="bg-gray-100 p-8 rounded-md text-center">
                    <p className="text-gray-500">No images found. Upload some!</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((image) => (
                            <ImageCard
                                key={image.id}
                                image={image}
                                onClick={openLightbox}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={page === 1}
                                    className={`px-3 py-1 rounded-md ${page === 1
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    Previous
                                </button>
                                <span className="text-gray-700">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page === totalPages}
                                    className={`px-3 py-1 rounded-md ${page === totalPages
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <Lightbox
                    images={images}
                    currentIndex={currentImageIndex}
                    onClose={closeLightbox}
                    onPrev={goToPrevImage}
                    onNext={goToNextImage}
                    onGoToImage={goToImage}
                />
            )}
        </div>
    );
};

export default ImageGallery;