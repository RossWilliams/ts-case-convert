import importPlugin from 'eslint-plugin-import';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const typescriptRules = {
  indent: 'off',
  '@typescript-eslint/indent': 'off',
  quotes: ['error', 'single', { avoidEscape: true }],
  'comma-dangle': 'off',
  'comma-spacing': ['error', { before: false, after: true }],
  'no-multi-spaces': ['error', { ignoreEOLComments: false }],
  'array-bracket-spacing': ['error', 'never'],
  'array-bracket-newline': ['error', 'consistent'],
  'object-curly-spacing': ['error', 'always'],
  'object-curly-newline': ['error', { multiline: true, consistent: true }],
  'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
  'keyword-spacing': ['error'],
  'brace-style': ['error', '1tbs', { allowSingleLine: true }],
  'space-before-blocks': ['error'],
  curly: ['error', 'multi-line', 'consistent'],
  semi: ['error', 'always'],
  'max-len': [
    'error',
    {
      code: 150,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
    },
  ],
  'quote-props': ['error', 'consistent-as-needed'],
  '@typescript-eslint/no-require-imports': ['error'],
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: ['**/test/**'],
      optionalDependencies: false,
      peerDependencies: true,
    },
  ],
  'import/no-unresolved': ['error'],
  'import/order': [
    'warn',
    {
      groups: ['builtin', 'external'],
      alphabetize: { order: 'asc', caseInsensitive: true },
    },
  ],
  'no-duplicate-imports': ['error'],
  'no-shadow': ['off'],
  '@typescript-eslint/no-shadow': ['error'],
  'key-spacing': ['error'],
  'no-multiple-empty-lines': ['error'],
  '@typescript-eslint/no-floating-promises': ['error'],
  'no-return-await': ['off'],
  '@typescript-eslint/return-await': ['error'],
  'no-trailing-spaces': ['error'],
  'dot-notation': ['error'],
  'no-bitwise': ['error'],
  '@typescript-eslint/member-ordering': [
    'error',
    {
      default: [
        'public-static-field',
        'public-static-method',
        'protected-static-field',
        'protected-static-method',
        'private-static-field',
        'private-static-method',
        'field',
        'constructor',
        'method',
      ],
    },
  ],
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_',
    },
  ],
};

export default [
  {
    ignores: ['node_modules/**', 'coverage/**', 'dist/**', 'lib/**', '*.d.ts', '*.generated.ts'],
  },
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.dev.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        node: {},
        typescript: {
          project: './tsconfig.dev.json',
          alwaysTryTypes: true,
        },
      },
    },
    rules: typescriptRules,
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2019,
      sourceType: 'commonjs',
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'no-trailing-spaces': ['error'],
    },
  },
];
