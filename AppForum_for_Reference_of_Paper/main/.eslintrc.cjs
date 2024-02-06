module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['html'],
  settings: {
    'html/html-extensions': ['.html']
  },
  env: {
    browser: true,
    node: true
  }
}
