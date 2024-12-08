module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
    "vue/setup-compiler-macros": true,
  },
  plugins: ["vue", "import"],
  extends: ["plugin:vue/vue3-strongly-recommended", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
  },
  rules: {
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
        },
      },
    ],
  },
};
