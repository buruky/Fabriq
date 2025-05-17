import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Wardrobe from './components/Wardrobe';
import Outfits from './components/Outfits';
import GeneratedOutfit from './components/GeneratedOutfit'; // update path if needed

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/GeneratedOutfit" element={<GeneratedOutfit />} />
        <Route path="/outfits" element={<Outfits />} />
      </Routes>
    </Router>
  );
}

export default App;