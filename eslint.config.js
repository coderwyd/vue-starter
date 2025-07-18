import { defineConfig } from '@coderwyd/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default defineConfig(
  {
    unocss: true,
    isInEditor: false,
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
  oxlint.configs['flat/recommended'],
)
