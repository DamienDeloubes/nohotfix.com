/** @type {import('prettier').Config} */
const config = {
  singleQuote: true,
  semi: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 180,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@releasepilot/(.*)$',
    '',
    '^[./]',
  ],
  importOrderTypeScriptVersion: '5.7.2',
};

module.exports = config;
