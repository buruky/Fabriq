// src/pages/Home.jsx
import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentIcon } from '@heroicons/react/outline';

import { getWardrobe } from '../util/storage';
import { generateOutfit } from '../ai/generateOutfit';
import { UserContext } from '../context/UserContext';

const Home = () => {
  const { currentUser = 'guest' } = useContext(UserContext);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prompt, setPrompt] = useState('');

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !prompt.trim()) {
      alert('Please upload an image and enter a description.');
      return;
    }

    const wardrobe = await getWardrobe(currentUser);

    // 👉 Use this line when you're ready to enable AI
    const outfit = await generateOutfit(selectedFile, prompt, wardrobe);

    // 👉 Or use this fallback while developing
    // const outfit = {
    //   inspirationImage: previewUrl,
    //   prompt,
    //   recommendedItems: wardrobe.slice(0, 3),
    // };

    navigate('/GeneratedOutfit', { state: outfit });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800">Goal Outfit</h1>

        {/* Upload Area */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          onClick={handleFileClick}
          className="w-full h-48 border-2 border-dashed border-gray-400 flex items-center justify-center bg-white rounded hover:bg-gray-50"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Inspo Preview"
              className="h-full object-contain"
            />
          ) : (
            <DocumentIcon className="w-10 h-10 text-gray-500" />
          )}
        </button>

        {/* Prompt Input */}
        <input
          type="text"
          placeholder="Describe your outfit goal..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200"
        />

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Generate Outfit
        </button>
      </div>
    </div>
  );
};

export default Home;
