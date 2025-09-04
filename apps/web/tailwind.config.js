/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // En Tailwind v4, la configuration migre vers le CSS avec @theme
  // Ce fichier se concentre sur le content et les plugins JavaScript
  plugins: [],
}
