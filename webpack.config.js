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
}
