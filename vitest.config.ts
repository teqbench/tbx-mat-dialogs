import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [angular({ jit: true, tsconfig: 'tsconfig.spec.json' })],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/test-setup.ts'],
        passWithNoTests: false,
        coverage: {
            // Exclude files that contain only constants, interfaces, types,
            // injection tokens, or test infrastructure — no testable logic to cover.
            exclude: [
                'src/constants/**',
                'src/models/**',
                'src/tokens/**',
                'src/types/**',
                'src/test-setup.ts',
                'src/**/*.stories.ts',
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                statements: 80,
                branches: 75,
                perFile: true,
            },
        },
    },
});
