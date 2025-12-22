import React from 'react';

const OutfitCard = ({ outfit, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="grid grid-cols-2 gap-1 p-2 bg-gray-50">
        {/* TODO: Display outfit item images */}
        <div className="aspect-square bg-gray-200 rounded"></div>
        <div className="aspect-square bg-gray-200 rounded"></div>
        <div className="aspect-square bg-gray-200 rounded"></div>
        <div className="aspect-square bg-gray-200 rounded"></div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{outfit.name}</h3>
        {outfit.notes && (
          <p className="text-sm text-gray-600 mt-1 truncate">{outfit.notes}</p>
        )}
      </div>
    </div>
  );
};

export default OutfitCard;
