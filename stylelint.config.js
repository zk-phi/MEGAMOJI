module.exports = {
  extends: [
    "@primer/stylelint-config",
    "stylelint-config-html/vue",
  ],
  rules: {

    // stylelint-config-primer dropped these rules from v11
    indentation: 2,
    "string-quotes": "double",
    "value-list-comma-newline-after": "always-multi-line",

    // do not require newlines for inline styles
    "declaration-block-semicolon-newline-after": null,

    // allow css-gradients, which is not allowed by default
    "plugin/no-unsupported-browser-features": [true, {
      severity: "error",
      ignore: ["css-gradients"],
    }],

    // scan all .vue files to resolve css vars
    "primer/no-undefined-vars": [true, {
      files: ["**/*.vue", "!node_modules"],
    }],

    // stop forcing to use primer/css vars
    "primer/box-shadow": null,
    "primer/spacing": null,
    "primer/borders": null,
    "primer/typography": null,
    "primer/colors": null,
  },
};
