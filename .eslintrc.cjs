const pp = 'plugin:prettier/recommended';
const a = 'airbnb-base';
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  overrides: [
    {
      files: ['*.yml', '*.yaml'],
      parser: 'yaml-eslint-parser',
      extends: ['plugin:yml/recommended', 'plugin:yml/prettier', pp],
    },
    {
      files: ['.babelrc.cjs', '.eslintrc.cjs', '.prettierrc.cjs', 'jest.config.js'],
      extends: [a, pp],
      rules: {
        'no-plusplus': 'off',
        'unicorn/prefer-module': 'off',
        'no-use-before-define': 'off',
        'no-console': 'off',
        'sonarjs/cognitive-complexity': 'off',
        'camelcase': 'off',
        'unicorn/no-process-exit': 'off',
      },
      parser: '@babel/eslint-parser',
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 'latest',
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
    {
      files: ['*.html', '*.htm'],
      plugins: ['html'],
      extends: [pp],
      parserOptions: {
        sourceType: 'module',
      },
    },
    {
      files: ['*.json'],
      extends: ['plugin:json/recommended', pp],
      rules: { 'json/*': ['error', 'allowComments'] },
    },
    {
      files: ['*.md'],
      extends: ['plugin:markdown/recommended', pp],
    },
    {
      files: ['.github/workflows/*.{yml,yaml}'],
      extends: ['plugin:actions/recommended'],
    },
    {
      files: ['.github/scripts/*.cjs'],
      plugins: ['simple-import-sort', 'import'],
      extends: [a, 'plugin:import/errors', 'eslint:recommended', pp],
      env: { es2022: true, node: true },
      parser: '@babel/eslint-parser',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      rules: {
        'import/no-extraneous-dependencies': 0,
      },
    },
    {
      files: ['__tests__/**/*.ts'],
      plugins: ['simple-import-sort', 'import', 'jest', '@typescript-eslint', 'optimize-regex'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb-base',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:sonarjs/recommended',
        'plugin:unicorn/recommended',
        'plugin:optimize-regex/recommended',
        pp,
      ],

      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: ['./__tests__/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            js: 'never',
            mjs: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
          },
        ],
        'no-console': 0,
      },
      env: {
        'jest/globals': true,
      },
    },
    {
      files: ['src/**/*.ts'],
      plugins: [
        'simple-import-sort',
        'import',
        'jest',
        '@typescript-eslint',
        'security',
        'optimize-regex',
      ],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:security/recommended',
        'airbnb-base',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:sonarjs/recommended',
        'plugin:unicorn/recommended',
        'plugin:optimize-regex/recommended',
        pp,
      ],

      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      rules: {
        'unicorn/no-hex-escape': 0,
        'import/no-extraneous-dependencies': 0,
        'max-len': 0,
        'maximumLineLength': 0,
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-object-literal-type-assertion': 'off',
        '@typescript-eslint/prefer-interface': 'off',
        '@typescript-eslint/camelcase': 'off',

        'import/prefer-default-export': 'off',
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            js: 'never',
            mjs: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
          },
        ],
        'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
        'dot-notation': 'off',
        '@typescript-eslint/dot-notation': ['error'],
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/ban-ts-comment': 'error',
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          { accessibility: 'no-public' },
        ],
        '@typescript-eslint/func-call-spacing': ['error', 'never'],
        '@typescript-eslint/lines-between-class-members': ['error'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-unnecessary-qualifier': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/prefer-for-of': 'warn',
        '@typescript-eslint/prefer-function-type': 'warn',
        '@typescript-eslint/prefer-includes': 'error',
        '@typescript-eslint/prefer-string-starts-ends-with': 'error',
        '@typescript-eslint/promise-function-async': 'error',
        '@typescript-eslint/require-array-sort-compare': 'error',
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/semi': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/unbound-method': 'error',
        'quote-props': 'off',
        'camelcase': 'off',
        'consistent-return': 'off',
        'eslint-comments/no-use': 'off',
        'no-plusplus': 'off',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/no-namespace': 'off',
        'no-unused-vars': 'off',
        'github/no-then': 'off',
        'security/detect-non-literal-fs-filename': 'off',
        '@typescript-eslint/no-array-constructor': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-extraneous-class': 'error',
        '@typescript-eslint/no-for-in-array': 'error',
        '@typescript-eslint/no-inferrable-types': 'error',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        'semi': 'off',
        'space-before-function-paren': 'off',
        'sort-imports': 'off',
        'sonarjs/cognitive-complexity': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/import': 'off',
        'unicorn/import-style': 'off',
        'unicorn/no-null': 'off',
        'unicorn/prefer-module': 'off',
        'unicorn/prefer-top-level-await': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'no-restricted-syntax': 'off',
      },
      env: {
        'node': true,
        'es6': true,
        'es2021': true,
        'jest/globals': true,
      },
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
          },
        },
        'import/extensions': ['.js', '.ts', '.mjs', '.jsx', '.tsx'],
      },
    },
  ],
};
