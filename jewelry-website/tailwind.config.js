/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tiffany: '#81D8D0',
        gold: '#D4AF37',
        luxury: { black: '#0A0A0A', dark: '#111111', gray: '#1A1A1A', light: '#F8F8F8' }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slowZoom': 'slowZoom 10s ease-out forwards',
      },
      keyframes: {
        fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:  { '0%': { transform: 'translateY(40px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slowZoom: { '0%': { transform: 'scale(1.1)' }, '100%': { transform: 'scale(1)' } },
      },
      scale: { '108': '1.08' }
    },
  },
  plugins: [],
}
