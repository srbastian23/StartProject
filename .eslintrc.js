module.exports = {
  root: true,
  extends: [
    'react-app',
    'plugin:prettier/recommended', // https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
    'prettier/react',
    'prettier/flowtype',
  ],
  env: {
    jest: true,
  },
  ignorePatterns: [
    'flow-typed/'
  ],
};
