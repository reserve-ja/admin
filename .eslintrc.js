module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}
