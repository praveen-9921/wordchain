/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0f172a",
        glassBg: "rgba(30, 41, 59, 0.7)",
        glassBorder: "rgba(255, 255, 255, 0.1)",
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(124, 58, 237, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}