import type { StorybookConfig } from '@analogjs/storybook-angular';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(ts|mdx)'],
    addons: [],
    framework: {
        name: '@analogjs/storybook-angular',
        options: {},
    },
    core: {
        builder: {
            name: '@storybook/builder-vite',
            options: {
                viteConfigPath: '.storybook/vite.config.ts',
            },
        },
    },
};

export default config;
