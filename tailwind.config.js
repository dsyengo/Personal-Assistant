/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Color Palette
        calmBlue: '#4A90E2',       // Primary Blue (light/dark)
        flashGreen: '#4CAF50',     // Success/Secondary Button (light/dark)
        softTeal: '#26C6DA',       // Selected Icons/Links
        lightGray: '#F2F2F2',      // Light mode background
        darkGray: '#333333',       // Light mode text/tab default
        coral: '#FF6F61',          // Warnings and Errors
        white: '#FFFFFF',          // Light mode input/card/tint

        // Dark Mode Specific
        darkText: '#ECEDEE',           // Dark mode text
        darkBackground: '#151718',     // Dark mode background
        darkTint: '#FFFFFF',           // Tint in dark mode
        darkInput: '#1E1E1E',          // Input background in dark mode
        darkCard: '#242424',           // Card background in dark mode
        darkTabIconDefault: '#9BA1A6', // Tab icon default in dark mode
        darkTabIconSelected: '#FFFFFF' // Tab icon selected in dark mode
      },
    },
  },
  plugins: [],
};
