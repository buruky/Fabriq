import React from 'react';
import ClothingCard from './ClothingCard';

const ClothingGrid = ({ items, onItemClick }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No clothing items yet. Add your first item!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ClothingCard
          key={item.id}
          item={item}
          onClick={() => onItemClick && onItemClick(item)}
        />
      ))}
    </div>
  );
};

export default ClothingGrid;
