import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['node_modules', 'coverage'] },
  // ── Standard CJS files (Express routes, models, middleware) ──────────────
  {
    files: ['**/*.js'],
    ignores: ['src/utils/seeder.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      sourceType: 'commonjs',
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-process-exit': 'off',
    },
  },
  // ── ESM files (seeder uses top-level import/export) ───────────────────────
  {
    files: ['src/utils/seeder.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      sourceType: 'module',
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-process-exit': 'off',
    },
  },
]
