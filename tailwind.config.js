/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ['"Roboto-Regular"', 'sans-serif'],
        RobotoItalic: ['"Roboto-Italic"', 'sans-serif'],
        RobotoBold: ['"Roboto-Bold"', 'sans-serif'],
        RobotoBoldItalic: ['"Roboto-BoldItalic"', 'sans-serif'],
        RobotoMedium: ['"Roboto-Medium"', 'sans-serif'],
        RobotoMediumItalic: ['"Roboto-MediumItalic"', 'sans-serif'],
        RobotoBlack: ['"Roboto-Black"', 'sans-serif'],
        RobotoBlackItalic: ['"Roboto-BlackItalic"', 'sans-serif'],
        RobotoLight: ['"Roboto-Light"', 'sans-serif'],
        RobotoLightItalic: ['"Roboto-LightItalic"', 'sans-serif'],
        RobotoThin: ['"Roboto-Thin"', 'sans-serif'],
        RobotoThinItalic: ['"Roboto-ThinItalic"', 'sans-serif'],
      },
      colors: {
        'primary-blue': '#302671',
        'primary-pink': '#fb77c5',
        'primary-red': '#de332b',
        'primary-black': '#333333',
      },
    },
  },
  plugins: [],
};
