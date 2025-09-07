module.exports = {
  extends: ['./index.js'],
  env: {
    node: true,
    es2022: true
  },
  rules: {
    'no-process-exit': 'error',
    'no-sync': 'warn'
  }
};