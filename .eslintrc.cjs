module.exports = {
	root: true,
	extends: ['eslint:recommended', 'prettier', 'plugin:svelte/recommended'],
	rules: {
		'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
		'svelte/no-at-html-tags': 0,
		'no-undef': 0,
		'no-useless-escape': 0
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2020: true,
		node: true
	}
};
