/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    { pattern: /bg-(red|blue|green|yellow|indigo|purple|pink|orange)-300/ },
    { pattern: /border-(red|blue|green|yellow|indigo|purple|pink|orange)-400/ }
  ],
  plugins: [],
}