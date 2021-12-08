const colors = require("tailwindcss/colors")

module.exports = {
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === "production",
    content: ["./src/**/*.html", "./src/**/*.vue", "./src/**/*.jsx"],
  },
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
        navbig: "1450px",
        navmedium: "1260px",
      },
      flexGrow: {
        max: 10000,
      },
    },
    variants: {},
  },
  plugins: [],
}
