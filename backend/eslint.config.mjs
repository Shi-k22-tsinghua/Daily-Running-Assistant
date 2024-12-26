import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      'semi': ['error', 'always'], // Enforce semicolons
      'spaced-comment': ['error', 'always'], // Spacing in comments
      'comma-spacing': ['error', { before: false, after: true }], // Comma spacing
      'space-before-function-paren': ['error', 'never'], // No space before function paren
      'no-unused-vars': 'error', // No unused vars
      'key-spacing': ['error', { beforeColon: false, afterColon: true }], // Key spacing
      'space-before-blocks': ['error', 'always'], // Space before blocks
      'object-curly-spacing': ['error', 'always'], // Space inside braces
      'linebreak-style': ['error', 'unix'], // Unix linebreaks
      'no-multiple-empty-lines': ['error', { max: 1 }], // No multiple empty lines
      'comma-dangle': ['error', 'never'], // No trailing commas
      'quotes': ['error', 'single'], // Single quotes
      'indent': ['error', 2], // 2-space indentation
      'eol-last': ['error', 'always'], // Newline at end of files
      'no-trailing-spaces': 'error', // No trailing spaces
      'arrow-spacing': ['error', { before: true, after: true }], // Arrow function spacing
      'no-console': 'warn', // Warn on console
      'prefer-const': 'error' // Prefer const
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' } // CommonJS for JS files
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } } // Browser and Node globals
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended
];
