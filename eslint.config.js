import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['coverage/', 'dist/', 'node_modules/'],
    },
    ...tseslint.configs.recommended,
    ...angular.configs.tsRecommended,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['eslint.config.js', 'vitest.config.ts'],
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['**/*.html'],
        extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    }
);
