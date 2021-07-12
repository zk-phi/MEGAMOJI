// eslint-disable-next-line @typescript-eslint/no-var-requires
const { VueLoaderPlugin } = require("vue-loader");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { EnvironmentPlugin } = require("webpack");

module.exports = (env, argv) => ({
  entry: "./src/megamoji.ts",
  devServer: {
    contentBase: "dist",
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      }, {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      }, {
        test: /\.vue$/,
        use: "vue-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: argv.mode,
      ROLLBAR_TOKEN: "",
    }),
    new VueLoaderPlugin(),
  ],
});
