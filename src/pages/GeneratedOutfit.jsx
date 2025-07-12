import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GeneratedOutfit = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.recommendedItems) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <p className="text-xl text-gray-600">No outfit data found. Please start from the home page.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const { inspirationImage, prompt, recommendedItems } = state;

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-center">Generated Outfit</h1>

      <p className="text-md italic text-gray-600 mb-10 max-w-xl text-center">
        Based on your prompt: “{prompt}”
      </p>

      <div className="flex flex-wrap justify-center gap-10 w-full max-w-6xl">
        {/* Generated Items */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold mb-2">Your Outfit</h2>
          {recommendedItems.map((item, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded shadow w-48 transition hover:scale-105"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-48 object-contain"
              />
              <p className="text-center text-sm mt-2 text-gray-700">{item.alt}</p>
            </div>
          ))}
        </div>

        {/* Goal Fit */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold mb-2">Inspiration Image</h2>
          <div className="bg-white p-4 rounded shadow w-80">
            <img
              src={inspirationImage}
              alt="Goal Fit"
              className="w-full h-96 object-contain"
            />
            <p className="text-center text-gray-700 mt-2">Your Goal Fit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedOutfit;
