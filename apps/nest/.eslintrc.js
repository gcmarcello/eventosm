/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require("@repo/config/lint/nest.eslintrc"),
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
