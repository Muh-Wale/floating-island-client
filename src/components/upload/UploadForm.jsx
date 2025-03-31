import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageService } from '../../services/api';

const UploadForm = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        artistTwitterUsername: '',
        artistTwitterProfile: '',
        twitterContentLink: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);

            // Create preview URL
            const previewUrl = URL.createObjectURL(selectedFile);
            setPreview(previewUrl);
            
            // Clear any previous file error
            setFieldErrors(prev => ({...prev, file: null}));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        // Clear field error when user types
        setFieldErrors(prev => ({...prev, [name]: null}));
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Validate file
        if (!file) {
            errors.file = 'Please select an image or GIF to upload';
            isValid = false;
        }

        // Validate Twitter username
        if (!formData.artistTwitterUsername.trim()) {
            errors.artistTwitterUsername = 'Twitter username is required';
            isValid = false;
        } else if (formData.artistTwitterUsername.includes('@')) {
            errors.artistTwitterUsername = 'Please enter username without the @ symbol';
            isValid = false;
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = new FormData();
            data.append('image', file);
            data.append('artistTwitterUsername', formData.artistTwitterUsername);
            data.append('artistTwitterProfile', formData.artistTwitterProfile);
            data.append('twitterContentLink', formData.twitterContentLink);

            await imageService.uploadImage(data);

            // Redirect to home page after successful upload
            navigate('/');
        } catch (err) {
            console.error('Error uploading image:', err);
            setError(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Image</h2>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Image or GIF <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed ${fieldErrors.file ? 'border-red-400' : 'border-gray-300'} rounded-lg p-6 text-center`}>
                        {preview ? (
                            <div className="mb-4">
                                <img
                                    src={preview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="max-h-64 mx-auto rounded-md"
                                />
                            </div>
                        ) : (
                            <div className="text-gray-500 mb-4">
                                <p>Drag and drop an image or click to select</p>
                                <p className="text-sm mt-1">Supported formats: JPEG, PNG, GIF</p>
                            </div>
                        )}

                        <input
                            type="file"
                            id="image"
                            accept="image/jpeg,image/png,image/gif"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="image"
                            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
                        >
                            {preview ? 'Change Image' : 'Select Image'}
                        </label>
                        {fieldErrors.file && (
                            <p className="mt-2 text-red-500 text-sm">{fieldErrors.file}</p>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="artistTwitterUsername" className="block text-gray-700 font-medium mb-2">
                        Artist Twitter Username <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="artistTwitterUsername"
                        name="artistTwitterUsername"
                        value={formData.artistTwitterUsername}
                        onChange={handleInputChange}
                        placeholder="e.g. artistname (without @)"
                        className={`w-full px-4 py-2 border ${fieldErrors.artistTwitterUsername ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {fieldErrors.artistTwitterUsername && (
                        <p className="mt-2 text-red-500 text-sm">{fieldErrors.artistTwitterUsername}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="artistTwitterProfile" className="block text-gray-700 font-medium mb-2">
                        Artist Twitter Profile Link
                    </label>
                    <input
                        type="url"
                        id="artistTwitterProfile"
                        name="artistTwitterProfile"
                        value={formData.artistTwitterProfile}
                        onChange={handleInputChange}
                        placeholder="e.g. https://twitter.com/artistname"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="twitterContentLink" className="block text-gray-700 font-medium mb-2">
                        Twitter Content Link
                    </label>
                    <input
                        type="url"
                        id="twitterContentLink"
                        name="twitterContentLink"
                        value={formData.twitterContentLink}
                        onChange={handleInputChange}
                        placeholder="e.g. https://twitter.com/artistname/status/123456789"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadForm;