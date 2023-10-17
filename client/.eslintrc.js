module.exports = {
    root: true,
    parser: '@babel/eslint-parser',
    settings: {
        react: {
            version: 'detect'
        }
    },
    env: {
        node: true,
        browser: true,
        es6: true,
        commonjs: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        //'plugin:@typescript-eslint/eslint-recommended',
        //'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        sourceType: 'module',
        ecmaVersion: 2020,
        requireConfigFile: false
    },
    plugins: [
        'react',
        '@next/eslint-plugin-next',
        'prettier',
        //'@typescript-eslint'
    ],
    rules: {
        'import/prefer-default-export': 0,
        'no-console': 'off',
        'no-nested-ternary': 0,
        'no-underscore-dangle': 0,
        'no-unused-expressions': ['error', { allowTernary: true }],
        camelcase: 0,
        'react/self-closing-comp': 1,
        'react/jsx-filename-extension': [1, { extensions: ['.js', 'jsx'] }],
        'react/prop-types': 0,
        'react/destructuring-assignment': 0,
        'react/jsx-no-comment-textnodes': 0,
        'react/jsx-props-no-spreading': 0,
        'react/no-array-index-key': 0,
        'react/no-unescaped-entities': 0,
        'react/require-default-props': 0,
        'react/react-in-jsx-scope': 0,
        'no-var-requires': 'off',
        'no-unused-vars': 'off',
        
        //'linebreak-style': ['error', 'windows'],
        'linebreak-style': 'off',
        semi: ['error', 'never'],
        'prettier/prettier': [
            'error',
            { endOfLine: 'auto' },
            { usePrettierrc: true }
        ]
    }
}
