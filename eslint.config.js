import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.ssr', 'assets-src', 'docs']),
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Core no-unused-vars can't see JSX references; ignore PascalCase/CONSTANTS
      // and framer-motion's <motion.div> namespace.
      'no-unused-vars': ['error', { varsIgnorePattern: '^([A-Z_]|motion$)' }],
    },
  },
  {
    // Build scripts, the API server and Node-side SEO modules.
    files: ['scripts/**/*.mjs', 'lib/**/*.js', 'server.js', 'vite.config.js', 'eslint.config.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    },
  },
])
