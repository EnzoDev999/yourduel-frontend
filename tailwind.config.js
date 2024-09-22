module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
      },
      colors: {
        "purple-start": "#9B59B6",
        "purple-end": "#7D3C98",
      },
    },
  },
  plugins: [],
};
