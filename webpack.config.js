module.exports = {
  entry: "./js/megamoji.js",
  output: {
    path: `${__dirname}/js`,
    filename: "bundle.js",
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
    },
  },
};
