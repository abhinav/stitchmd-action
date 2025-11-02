import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import github from 'eslint-plugin-github'
import jest from 'eslint-plugin-jest'

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        plugins: {
            github,
            jest
        },
        languageOptions: {
            ecmaVersion: 9,
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.json'
            },
            globals: {
                // Node.js globals
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly'
            }
        },
        rules: {
            // Disable rules from github recommended that we don't want
            'i18n-text/no-en': 'off',
            'eslint-comments/no-use': 'off',
            'import/no-namespace': 'off',

            // TypeScript rules
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {accessibility: 'no-public'}
            ],
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/array-type': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/ban-ts-comment': 'error',
            camelcase: 'off',
            '@typescript-eslint/consistent-type-assertions': 'error',
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {allowExpressions: true}
            ],
            '@typescript-eslint/no-array-constructor': 'error',
            '@typescript-eslint/no-empty-interface': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-extraneous-class': 'error',
            '@typescript-eslint/no-for-in-array': 'error',
            '@typescript-eslint/no-inferrable-types': 'error',
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-namespace': 'error',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-unnecessary-qualifier': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/no-useless-constructor': 'error',
            '@typescript-eslint/no-var-requires': 'error',
            '@typescript-eslint/prefer-for-of': 'warn',
            '@typescript-eslint/prefer-function-type': 'warn',
            '@typescript-eslint/prefer-includes': 'error',
            '@typescript-eslint/prefer-string-starts-ends-with': 'error',
            '@typescript-eslint/promise-function-async': 'error',
            '@typescript-eslint/require-array-sort-compare': 'error',
            '@typescript-eslint/restrict-plus-operands': 'error',
            semi: 'off',
            '@typescript-eslint/unbound-method': 'error',
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'error'
        }
    },
    {
        // Test files configuration
        files: ['**/*.test.ts'],
        languageOptions: {
            globals: {
                // Jest globals for test files
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                jest: 'readonly'
            }
        },
        rules: {
            // Disable strict type checking for test files
            // because Bun/Jest APIs have loose typing
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/unbound-method': 'off'
        }
    },
    {
        // Ignore patterns
        ignores: ['dist/', 'lib/', 'node_modules/', '*.config.js']
    }
)
