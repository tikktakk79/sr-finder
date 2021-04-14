const colors = require("tailwindcss/colors")

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        radiogray: "#dfdfdf",
        warmgray: colors.warmGray,
      },
      fontFamily: {
        radio: ["Ubuntu", "sans-serif"],
      },
      fontSize: {
        logo: ["3.3rem", "1"],
      },
      maxWidth: {
        view: "80rem",
      },
      gridTemplateColumns: {
        topmenu: "1fr auto 1fr",
      },
      screens: {
        mdplus: "940px",
      },
      flexGrow: {
        max: 10000,
      },
    },
    variants: {},
  },
  plugins: [],
}
