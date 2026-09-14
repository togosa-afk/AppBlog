const js = require('@eslint/js')
const globals = require('globals')

module.exports = [
	{
		ignores: ['node_modules/**', '**/dist/**', '**/coverage/**']
	},
	{
		files: ['client/**/*.{js,jsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.vitest
			},
			parserOptions: {
				ecmaFeatures: { jsx: true }
			}
		},
		rules: {
			...js.configs.recommended.rules,
			'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]
		}
	},
	{
		files: ['server/**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'commonjs',
			globals: globals.node
		},
		rules: {
			...js.configs.recommended.rules
		}
	}
]
