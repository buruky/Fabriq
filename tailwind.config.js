/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fabriq Brand Colors - Earthy & Sophisticated Dark Mode
        primary: {
          DEFAULT: '#A8B5A4', // Soft sage green
          dark: '#8B9688',
          light: '#B5C1B3',
        },
        secondary: {
          DEFAULT: '#9CA89B', // Muted olive
          dark: '#7A8A78',
          light: '#A8B5A4',
        },
        accent: {
          DEFAULT: '#E8D973', // Golden yellow
          dark: '#D4C25F',
          light: '#F4E893',
        },
        neutral: {
          background: '#1A1D1A', // Deep charcoal
          'background-light': '#242724', // Slightly lighter
          text: '#E8EAE8',       // Off-white
          'text-muted': '#A8ADA8', // Muted gray-green
          border: '#3A3D3A',     // Dark gray-green
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

