import React from 'react';

import redShirt from './HackThon/closet/redShirt.jpg';
import blackJorts from './HackThon/closet/blackJorts.jpg';
import blackBoots from './HackThon/closet/blackBoots.jpg';
import goalFit from './HackThon/goal fit/goalFit.jpg'; 

const GeneratedOutfit = () => {
  const outfit = [
    { src: redShirt, alt: 'Red Shirt' },
    { src: blackJorts, alt: 'Black Jorts' },
    { src: blackBoots, alt: 'Black Boots' },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10">Generated Outfit</h1>

      {/* Two-column layout: Outfit (left) + Goal Fit (right) */}
      <div className="flex flex-row gap-10">
        {/* Outfit stack */}
        <div className="flex flex-col items-center space-y-4">
          {outfit.map((item, index) => (
            <div key={index} className="bg-white p-2 rounded shadow w-48">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-auto object-contain"
              />
              <p className="mt-2 text-center text-sm">{item.alt}</p>
            </div>
          ))}
        </div>

        {/* Goal Fit */}
        <div className="bg-white p-4 rounded shadow w-96 h-fit">
          <img
            src={goalFit}
            alt="Goal Fit"
            className="w-full h-auto object-contain"
          />
          <p className="mt-4 text-center text-medium">Goal Fit</p>
        </div>
      </div>
    </div>
  );
};

export default GeneratedOutfit;
