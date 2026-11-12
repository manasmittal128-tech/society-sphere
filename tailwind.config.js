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
        dark: {
          950: '#060911',
          900: '#0b0f19',
          850: '#0f172a',
          800: '#141d31',
          750: '#1a243d',
          700: '#1e293b',
          600: '#334155',
          500: '#475569',
        },
        brand: {
          violet: '#8b5cf6',
          'violet-dark': '#6d28d9',
          'violet-light': '#c4b5fd',
          blue: '#3b82f6',
          'blue-dark': '#1d4ed8',
          'blue-light': '#93c5fd',
          cyan: '#06b6d4',
          'cyan-dark': '#0e7490',
          'cyan-light': '#67e8f9',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 30px -5px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 30px -5px rgba(59, 130, 246, 0.3)',
        'subtle-card': '0 4px 20px -2px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'hover-card': '0 12px 30px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.12)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
