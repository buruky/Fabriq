import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Wardrobe from './pages/Wardrobe';
import Outfits from './pages/Outfits';
import GeneratedOutfit from './pages/GeneratedOutfit'; // update path if needed

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/GeneratedOutfit" element={<GeneratedOutfit />} />
        <Route path="/outfits" element={<Outfits />} />
      </Routes>
    </Router>
  );
}

export default App;