/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    'max-len': 0,
    'quote-props': 'as-needed'
  },
  globals: {
    API: 'readonly'
  },
  overrides: [
    // {
    //   files: [
    //     'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
    //   ],
    //   'extends': [
    //     'plugin:cypress/recommended'
    //   ]
    // }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
