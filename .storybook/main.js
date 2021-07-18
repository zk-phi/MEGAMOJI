module.exports = {
  stories: [
    "../src/components/**/*.stories.js",
  ],
  addons: [
    "@storybook/addon-essentials",
  ],
  core: {
    builder: "webpack5",
  },
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.glsl$/,
      loader: "webpack-glsl-minify",
      options: {
        preserveUniforms: true,
      },
    });
    return config;
  },
}
