const path = require("path")
const Dotenv = require("dotenv-webpack")

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: ["babel-loader", "vue-svg-loader"],
          },
          {
            loader: "file-loader",
            query: {
              name: "assets/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, "..", ".env.local"),
    }),
  ],
}
