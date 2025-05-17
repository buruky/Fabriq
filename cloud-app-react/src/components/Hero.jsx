import React, { useRef, useState } from 'react';
import {
    CloudUploadIcon,
    DatabaseIcon,
    PaperAirplaneIcon,
    ServerIcon,
} from '@heroicons/react/solid';

import bgImg from '../assets/img1.jpg';
import { useNavigate } from 'react-router-dom';
import { DocumentIcon } from '@heroicons/react/outline';

const Hero = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleGenerate = () => {
        navigate('/GeneratedOutfit');
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    return (
        <div className="w-full h-screen bg-zinc-200 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-6">
                <p className="text-xl font-semibold">Goal Outfit</p>

                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                {/* Clickable Box */}
                <button
                    onClick={handleFileClick}
                    className="w-24 h-48 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-medium bg-white overflow-hidden"
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Goal Fit"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <DocumentIcon className="w-10 h-10 text-gray-500" />
                    )}
                </button>

                {/* Textbox for user input */}
                <input
                    type="text"
                    placeholder="Describe your outfit goal..."
                    className="w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    onClick={handleGenerate}
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                >
                    Generate
                </button>
            </div>
        </div>
    );
};

export default Hero;
