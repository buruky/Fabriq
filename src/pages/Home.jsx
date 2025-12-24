// src/pages/Home.jsx
import { useContext, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { DocumentIcon } from '@heroicons/react/outline';
import { getWardrobe } from '../util/storage';
import { generateOutfit } from '../ai/generateOutfit';
import { UserContext } from '../context/UserContext';
import { useAuth } from '../hooks/useAuth';
import backgroundImage from '../assets/background.jpg';

const Home = () => {
  const { currentUser = 'guest' } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prompt, setPrompt] = useState('');

  const navItems = [
    { name: 'HOME', path: '/dashboard' },
    { name: 'WARDROBE', path: '/wardrobe' },
    { name: 'OUTFITS', path: '/outfits' },
    { name: 'PROFILE', path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

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
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Top Left Navigation */}
        <nav className="fixed left-8 top-8 z-20">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`block text-sm tracking-[0.2em] transition-all duration-300 hover:text-[#A8B5A4] hover:tracking-[0.3em] relative ${
                    isActive(item.path)
                      ? 'text-[#A8B5A4] font-medium'
                      : 'text-white/60'
                  }`}
                >
                  {isActive(item.path) && (
                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#A8B5A4] rounded-full"></span>
                  )}
                  {item.name}
                </Link>
              </li>
            ))}

            {/* Separator Line */}
            <li className="py-2">
              <div className="w-full h-px bg-white/20"></div>
            </li>

            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogout}
                className="block text-sm tracking-[0.2em] transition-all duration-300 hover:text-white hover:tracking-[0.3em] text-white/60"
              >
                LOGOUT
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="flex flex-col items-center space-y-6 p-6 sm:p-8 bg-black/30 backdrop-blur-md border border-white/10 rounded-3xl w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '500' }}>Goal Outfit</h1>

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
            className="w-full h-48 border-2 border-dashed border-white/30 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Inspo Preview"
                className="h-full object-contain"
              />
            ) : (
              <DocumentIcon className="w-10 h-10 text-white/60" />
            )}
          </button>

          {/* Prompt Input */}
          <input
            type="text"
            placeholder="Describe your outfit goal..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-3 border border-white/20 rounded-xl bg-black/30 backdrop-blur-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
          />

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full px-6 py-3 bg-[#A8B5A4] text-white rounded-xl hover:bg-[#8B9688] transition-all shadow-lg shadow-[#A8B5A4]/30 hover:shadow-xl hover:shadow-[#A8B5A4]/40 tracking-[0.1em] text-sm font-semibold"
          >
            Generate Outfit
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
