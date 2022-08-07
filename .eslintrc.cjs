/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    // this tool sucks...
    // "@vue/eslint-config-prettier",
  ],
  env: {
    "vue/setup-compiler-macros": true,
  },
  // seems useless
  rules: {
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 5,
        multiline: 5,
      },
    ],
  },
};
