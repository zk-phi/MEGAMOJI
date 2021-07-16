// eslint-disable-next-line @typescript-eslint/no-var-requires
const { VueLoaderPlugin } = require("vue-loader");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { EnvironmentPlugin } = require("webpack");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => ({
  entry: "./src/megamoji.ts",
  devServer: {
    contentBase: "dist",
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
    assetModuleFilename: "assets/[hash][ext][query]",
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
      }, {
        test: /\.(woff|svg|png)$/,
        type: "asset/resource",
      },{
        test: /\.glsl$/,
        loader: "webpack-glsl-minify",
        options: {
          preserveUniforms: true,
        },
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
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
});
