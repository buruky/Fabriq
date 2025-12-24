import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background.jpg';

const Landing = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Left Navigation */}
        <nav className="fixed left-8 top-8 z-20">
          <ul className="space-y-4">
            <li>
              <Link
                to="/login"
                className="block text-sm tracking-[0.2em] transition-all duration-300 hover:text-white hover:tracking-[0.3em] text-white/60 px-4"
              >
                LOGIN
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="block text-sm tracking-[0.2em] transition-all duration-300 hover:text-white hover:tracking-[0.3em] text-white/60 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm text-center"
              >
                GET STARTED
              </Link>
            </li>
          </ul>
        </nav>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-8">
            {/* Main Title */}
            <h1
              className="text-[clamp(4rem,15vw,12rem)] tracking-tight leading-none mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: '600',
                letterSpacing: '0.05em',
                color: 'white'
              }}
            >
              FABRIQ.
            </h1>

            {/* Tagline */}
            <p className="text-white/80 text-sm md:text-base tracking-[0.3em] font-light mb-12">
              Curate your style, one piece at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
