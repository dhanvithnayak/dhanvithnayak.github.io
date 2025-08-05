/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'nvim-bg': '#1c1c1c',
        'nvim-fg': '#d0d0d0',
        'nvim-gray': '#4e4e4e',
        'nvim-blue': '#5fafd7',
        'nvim-green': '#87d787',
        'nvim-statusline': '#303030',
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000',
        white: '#fff',
        'dark-blue': '#022859',
        'light-blue': '#F0F4F8',
        'dark-gray': '#333333',
        'light-gray': '#E0E0E0',
        'steel-blue': '#B0C4DE',
        'slate-gray': '#708090',
      },
      fontSize: {
        base: '20px',
      },
      fontFamily: {
        'jetbrains-mono': ['JetBrainsMono Nerd Font', 'monospace'],
        'console': ['Classic Console Neue Font', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
