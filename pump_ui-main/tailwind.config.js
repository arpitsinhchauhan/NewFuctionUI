/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        petrol: 'var(--fuel-petrol)',
        diesel: 'var(--fuel-diesel)',
        xppetrol: 'var(--fuel-xp)',
        powerdiesel: 'var(--fuel-power)',
        primary: 'var(--primary-color)',
        secondary: 'var(--sidebar-text)',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#0ea5e9',
        light: 'var(--bg-color)',
        dark: 'var(--text-color)',
        card: 'var(--card-bg)'
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
