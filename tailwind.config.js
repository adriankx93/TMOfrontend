module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
}
