const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: "./src/megamoji.ts",
  devServer: {
    contentBase: "dist",
    open: true,
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
  },
  module: {
    rules: [
      { test: /\.ts$/, use: "ts-loader" },
      { test: /\.vue$/, use: "vue-loader" },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
};
