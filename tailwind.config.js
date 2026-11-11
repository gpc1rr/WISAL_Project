/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#F0F7F4',
          100: '#DDEFE7',
          200: '#BCE0D2',
          300: '#8DC8B4',
          400: '#4DA588',
          500: '#1D8264',
          600: '#12634C',
          700: '#0E4D3A', // Primary Emerald
          800: '#0B3E2F',
          900: '#073D2D', // Deep Forest
          950: '#032118',
        },
        gold: {
          50: '#FBF9F2',
          100: '#F6F1E0',
          200: '#EBDDBB',
          300: '#DEC490',
          400: '#D3B16C',
          500: '#C9A45C', // Premium Gold
          600: '#B28B45',
          700: '#8F6C34',
          800: '#73562C',
          900: '#5F4627',
          950: '#362412',
        },
        ivory: {
          50: '#FDFCF9',
          100: '#FAF8F4',
          200: '#F8F6F0', // Warm Ivory
          300: '#EFECE3',
          400: '#E2DDCF',
          500: '#CEC6B4',
        },
        charcoal: {
          900: '#172B26', // Dark Text
          800: '#233933',
          700: '#344E46',
          600: '#47635A',
          500: '#5F756D',
          400: '#8C9E97',
          300: '#B8C5C0',
          200: '#DCE3E0',
          100: '#F0F3F2',
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'Cairo', 'system-ui', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(14, 77, 58, 0.05), 0 8px 24px -4px rgba(14, 77, 58, 0.08)',
        'elevated': '0 10px 30px -5px rgba(14, 77, 58, 0.12), 0 4px 12px -2px rgba(14, 77, 58, 0.06)',
        'gold-glow': '0 4px 20px -2px rgba(201, 164, 92, 0.25)',
      },
      backgroundImage: {
        'islamic-pattern': "radial-gradient(circle at 50% 50%, rgba(201, 164, 92, 0.05) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
