module.exports = {
  build: {
    extend: (config) => {
      const svgRule = config.module.rules.find((rule) => rule.test.test(".svg"))

      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        use: ["babel-loader", "vue-svg-loader"],
      })
    },
  },
}
