import React from 'react';
import UploadForm from '../components/upload/UploadForm';

const UploadPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Image</h1>
            <UploadForm />
        </div>
    );
};

export default UploadPage;