import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import backgroundImage from '../assets/background.jpg';

const Register = () => {
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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Main Card */}
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Link to="/" className="flex items-center space-x-3">
                <h2
                  className="text-4xl tracking-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    color: 'white'
                  }}
                >
                  FABRIQ.
                </h2>
              </Link>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl mb-2 text-white" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '500' }}>
                Join Fabriq
              </h1>
              <p className="text-white/60 text-sm tracking-[0.1em]">Start organizing your wardrobe today</p>
            </div>

            {/* Register Form */}
            <RegisterForm />

            {/* Log In Link */}
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-white font-medium hover:text-white/80 transition-colors tracking-[0.05em]"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/40 tracking-[0.1em]">
              Free forever • No credit card required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
