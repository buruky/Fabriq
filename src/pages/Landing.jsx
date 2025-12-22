import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-background via-neutral-background-light to-neutral-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10"></div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 md:py-40">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full shadow-lg mb-8">
            <span className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-neutral-text">Your Digital Fashion Companion</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight">
            Welcome to{' '}
            <span className="text-gradient-primary inline-block">
              Fabriq
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-neutral-text-muted mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Transform how you manage your wardrobe. Organize, curate, and create stunning outfits effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/register" className="btn-primary w-full sm:w-auto">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-outline w-full sm:w-auto">
              Sign In
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-neutral-text-muted">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>4.9/5 rating</span>
            </div>
            <span className="text-neutral-border">•</span>
            <span>10,000+ users</span>
            <span className="text-neutral-border">•</span>
            <span>100% free</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 max-w-6xl mx-auto">
          {[
            {
              icon: '👕',
              title: 'Smart Organization',
              description: 'Catalog your entire wardrobe with photos, tags, and smart categorization',
              gradient: 'from-primary/10 to-primary/5'
            },
            {
              icon: '✨',
              title: 'Outfit Creation',
              description: 'Mix and match items to create and save your favorite outfit combinations',
              gradient: 'from-secondary/10 to-secondary/5'
            },
            {
              icon: '📱',
              title: 'Access Anywhere',
              description: 'Sync across all your devices and access your wardrobe on the go',
              gradient: 'from-accent/10 to-accent/5'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${feature.gradient} backdrop-blur-sm
                         rounded-3xl p-8 border border-neutral-border
                         hover:shadow-2xl hover:shadow-primary/10 hover:scale-105 hover:-translate-y-2
                         transition-all duration-500 ease-out`}
            >
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-text">
                {feature.title}
              </h3>
              <p className="text-neutral-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="relative glass rounded-3xl p-12 md:p-16 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 -z-10"></div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-text">
              Ready to Transform Your Wardrobe?
            </h2>
            <p className="text-lg text-neutral-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              Join our community of fashion-forward individuals organizing their style and creating amazing looks every day.
            </p>
            <Link to="/register" className="btn-primary inline-block">
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
