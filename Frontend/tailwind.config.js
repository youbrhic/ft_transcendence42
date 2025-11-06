/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}" 
  ],
  theme: {
    extend: {
      fontFamily: {
        russo: ['"Russo One"', 'sans-serif'],
      },
      animation: {
        scaleUp: 'scaleUp 1s ease-in-out infinite',
      },
      keyframes: {
        scaleUp: {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.15)', opacity: 0.9 },
        },
      },
    },
  },
  plugins: [],
}
