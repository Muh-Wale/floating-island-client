import React from 'react';

const ImageCard = ({ image, onClick }) => {
    const imageUrl = image.file_path;

    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
            onClick={() => onClick(image)}
        >
            <div className="h-48 overflow-hidden">
                <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Gallery"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                {image.artist_twitter_username && (
                    <div className="flex items-center mb-2">
                        <span className="text-gray-700 font-medium">
                            @{image.artist_twitter_username}
                        </span>
                    </div>
                )}

                {image.twitter_content_link && (
                    <a
                        href={image.twitter_content_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                        onClick={(e) => e.stopPropagation()} // Prevent the card click from triggering
                    >
                        View on Twitter
                    </a>
                )}

                <p className="text-gray-500 text-xs mt-2">
                    {new Date(image.upload_date).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default ImageCard;