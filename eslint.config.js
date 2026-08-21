import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import lit from 'eslint-plugin-lit'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**', 'custom-elements.json']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: { lit },
    languageOptions: {
      globals: { ...globals.browser }
    },
    rules: {
      ...lit.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },
  {
    files: ['**/*.js', 'vite.config.ts', 'custom-elements-manifest.config.js'],
    languageOptions: {
      globals: { ...globals.node }
    }
  },
  {
    // Test globals (Mocha) + chai's expression-style assertions.
    files: ['**/*.test.ts'],
    languageOptions: {
      globals: { ...globals.mocha }
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
)
