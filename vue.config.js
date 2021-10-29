const path = require("path")
const vueSrc = "./src"

module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg")

    svgRule.uses.clear()

    svgRule
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("vue-svg-loader")
      .loader("vue-svg-loader")
  },
  devServer: {
    host: "localhost",
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, vueSrc),
      },
      extensions: [".js", ".vue", ".json", ".svg"],
    },
  },
  publicPath: "/radioskugga/",
}
