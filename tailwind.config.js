const colors = require("tailwindcss/colors")

module.exports = {
  purge: [],
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
        mdplus: "1050px",
        navbig: "1400px",
        navmedium: "1220px",
      },
      flexGrow: {
        max: 10000,
      },
    },
    variants: {},
  },
  plugins: [],
}
