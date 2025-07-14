module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#f0f9ff',
          secondary: '#f8fafc',
          accent: '#2563eb',
          text: {
            primary: '#0f172a',
            secondary: '#334155',
            muted: '#64748b'
          },
          card: {
            bg: 'rgba(255, 255, 255, 0.9)',
            border: 'rgba(226, 232, 240, 0.9)'
          }
        },
        dark: {
          primary: '#0f172a',
          secondary: '#1e293b',
          accent: '#3b82f6',
          text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
            muted: '#94a3b8'
          },
          card: {
            bg: 'rgba(30, 41, 59, 0.7)',
            border: 'rgba(51, 65, 85, 0.7)'
          }
        }
      },
      screens: {
        'xs': '480px',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translateX(-2px)' },
          '20%, 80%': { transform: 'translateX(4px)' },
          '30%, 50%, 70%': { transform: 'translateX(-8px)' },
          '40%, 60%': { transform: 'translateX(8px)' },
        },
      },
      animation: {
        shake: 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both'
      },
      colors: {
        // Custom colors for light/dark mode
      }
    },
  },
  plugins: [],
}
