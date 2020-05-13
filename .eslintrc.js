module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint-config-umi', 'airbnb', 'prettier', 'plugin:compat/recommended'],
  plugins: ['react-hooks'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    APP_TYPE: true,
    page: true,
    "APP_NAME": false,
    "APP_VER": false,
    "APP_ENV": false,
    "APP_API": false
  },
  rules: {
    'no-console': 'off',
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "arrow-parens": [0],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/jsx-tag-spacing': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    "react/state-in-constructor": 0,
    "react/static-property-placement": 0,
    "react/require-default-props": 0,
    "react/destructuring-assignment": 0,
    "react/jsx-props-no-spreading": 0,

    'import/no-cycle': 0,
    "import/prefer-default-export": [0],
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "import/no-extraneous-dependencies": [0],

    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": [0],
    "jsx-a11y/no-noninteractive-element-interactions": [0],
    "jsx-a11y/no-autofocus": [0],
    "jsx-a11y/label-has-associated-control": 0,
    "jsx-a11y/heading-has-content": [0],

    'linebreak-style': 0,
    quotes: ['error', 'single'], // 使用单引号
    semi: ['error', 'always'], // 结束添加分号
    'compat/compat': 0,
    "no-underscore-dangle": 0,
    "consistent-return": 0
  },
  settings: {
    // support import modules from TypeScript files in JavaScript files
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    polyfills: ['fetch', 'promises', 'url', 'object-assign'],
  },
};
