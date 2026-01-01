/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // Bright Blue
        // Custom Creamy Light Mode
        cream: {
          50: '#FDFBF7',  // Very soft warm white background
          100: '#F5F2EB', // Slightly darker cream for inputs
          200: '#E6E2D6', // Borders
        },
        // Custom Rich Dark Mode (Blue-Blacks)
        midnight: {
          950: '#020617', // Deepest Blue-Black (Background)
          900: '#0F172A', // Slate Blue-Black (Card)
          800: '#1E293B', // Lighter Slate (Inputs)
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(15px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}