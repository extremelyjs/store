require('@reskript/config-lint/patch');

module.exports = {
    extends: require.resolve('@reskript/config-lint/config/eslint'),
    rules: {
        // close some rules
        'camelcase': 'off',
        'max-len': 'off',
        'max-statements': 'off',
        'no-negated-condition': 'off',
        'prefer-promise-reject-errors': 'off',
        '@typescript-eslint/init-declarations': 'off',
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
    },
};
