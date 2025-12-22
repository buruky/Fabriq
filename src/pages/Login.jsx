import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-background via-neutral-background-light to-neutral-background relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="glass rounded-3xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome <span className="text-gradient-primary">Back</span>
            </h1>
            <p className="text-neutral-text-muted">Sign in to continue to Fabriq</p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-neutral-text-muted text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary font-semibold hover:text-primary-light transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-text-muted">
            Secure login powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
