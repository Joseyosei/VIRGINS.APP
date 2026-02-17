/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f2f6',
          900: '#1A1A2E',
          800: '#16213E',
          700: '#1f2e52',
        },
        gold: {
          50: '#FDF8F0',
          100: '#F9F3EA',
          200: '#F5E6D3',
          300: '#E6CFA6',
          400: '#DEBA85',
          500: '#D4A574',
          600: '#C59056',
          700: '#B8860B',
          800: '#8A6508',
        },
        cream: '#E8D5B7',
        primary: {
          50: '#f0f2f6',
          100: '#e0e5ed',
          200: '#c2cdda',
          300: '#94a8c0',
          400: '#607d9f',
          500: '#3d5f83',
          600: '#2e4a6a',
          700: '#253b56',
          800: '#16213E',
          900: '#1A1A2E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        body: ['Cormorant Garamond', 'serif'],
      },
      animation: {
        blob: "blob 7s infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      },
    },
  },
  plugins: [],
};
