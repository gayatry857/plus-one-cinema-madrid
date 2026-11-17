/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBF9F4',
        night: '#2B0A12',
        maroon: '#6E1A31',
        yellow: '#F8CD4B',
        blue: '#1A00B0',
        sky: '#D6E8F5',
        panel: '#FFFFFF',
        panel2: '#F3EDE0',
        line: '#E4DACA',
        muted: '#7B6168',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['Anton', 'Impact', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
