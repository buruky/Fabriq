import React from 'react';

// Manual imports
import blackBoots from './HackThon/closet/blackBoots.jpg';
import blackJacket from './HackThon/closet/blackJacket.webp';
import blackJorts from './HackThon/closet/blackJorts.jpg';
import blueCargo from './HackThon/closet/blueCargo.jpg';
import blueJacket from './HackThon/closet/blueJacket.webp';
import blueJeans from './HackThon/closet/blueJeans.jpg';
import greenShort from './HackThon/closet/greenShorts.webp';
import greyJersey from './HackThon/closet/greyJersey.webp';
import greySweats from './HackThon/closet/greySweats.jpg';
import purpleTank from './HackThon/closet/purpleTank.jpg';
import redShirt from './HackThon/closet/redShirt.jpg';
import redShoes from './HackThon/closet/redShoes.jpg';
import timbs from './HackThon/closet/timbs.png';
import whiteShirt from './HackThon/closet/whiteShirt.jpg';


const images = [
  { src: blackBoots, alt: 'Black Boots' },
  { src: blackJacket, alt: 'Black Jacket' },
  { src: blackJorts, alt: 'Black Jorts' },
  { src: blueCargo, alt: 'Blue Cargo Pants' },
  { src: blueJacket, alt: 'Blue Jacket' },
  { src: blueJeans, alt: 'Blue Jeans' },
  { src: greenShort, alt: 'Green Shorts' },
  { src: greyJersey, alt: 'Grey Jersey' },
  { src: greySweats, alt: 'Grey Sweats' },
  { src: purpleTank, alt: 'Purple Tank' },
  { src: redShirt, alt: 'Red Shirt' },
  { src: redShoes, alt: 'Red Shoes' },
  { src: timbs, alt: 'Timbs' },
  { src: whiteShirt, alt: 'White Shirt' },

];

const Wardrobe = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-4xl font-bold mb-20 text-center"></h1>
      <h1 className="text-4xl font-bold mb-10 text-center">Wardrobe</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img, idx) => (
          <div key={idx} className="bg-white p-2 rounded shadow">
            <img src={img.src} alt={img.alt} className="w-full h-auto object-contain" />
            <p className="mt-2 text-center text-sm">{img.alt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;


