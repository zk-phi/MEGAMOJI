module.exports = {
  entry: "./src/megamoji.js",
  devServer: {
    contentBase: 'dist',
    open: true
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
    },
  },
};
