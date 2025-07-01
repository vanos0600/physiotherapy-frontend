module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          500: '#10b981',
          600: '#059669',
        },
      },
    },
  },
  plugins: [],
};