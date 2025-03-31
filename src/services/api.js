import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Image services
export const imageService = {
    // Upload image with metadata
    uploadImage: async (formData) => {
        const response = await api.post('/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get recent images for slideshow
    getRecentImages: async () => {
        const response = await api.get('/images/recent');
        return response.data;
    },

    // Get paginated images for gallery
    getImages: async (page = 1, limit = 10, sort = 'newest') => {
        const response = await api.get('/images', {
            params: { page, limit, sort },
        });
        return response.data;
    },
};

export default api;