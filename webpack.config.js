// eslint-disable-next-line @typescript-eslint/no-var-requires
const { VueLoaderPlugin } = require("vue-loader");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { EnvironmentPlugin, DefinePlugin } = require("webpack");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => ({
  entry: {
    bundle: "./src/megamoji",
    gifworker: "./src/gifworker",
  },
  devServer: {
    contentBase: "dist",
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "[name].js",
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
      }, {
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
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new EnvironmentPlugin({
      NODE_ENV: argv.mode,
      ROLLBAR_TOKEN: "",
      GA4_TOKEN: "",
    }),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [{
        context: `${__dirname}/static`,
        from: "*",
        to: `${__dirname}/dist`,
      }],
    }),
  ],
});
