import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { TBX_MAT_DIALOG_PROVIDER_CONFIG } from '../src/tokens/dialog-provider-config.token';
import { TbxMatDialogSeverityFontIconService } from '../src/services/dialog-severity-font-icon.service';
import { removeStoryOverrideStyleTag } from '../src/components/story-overrides';

// M3 theme generated via mat.theme() with light-dark() support, dark mode
// bridge rules, dialog emphasis tokens, and global panel styles.
import './storybook-theme.scss';
import '../src/styles/_tbx-mat-dialogs.scss';

const preview: Preview = {
    globalTypes: {
        colorScheme: {
            description: 'Color scheme',
            toolbar: {
                title: 'Scheme',
                icon: 'mirror',
                items: [
                    { value: 'light', title: 'Light', icon: 'sun' },
                    { value: 'dark', title: 'Dark', icon: 'moon' },
                    { value: 'auto', title: 'Auto (OS)', icon: 'sidebyside' },
                ],
                dynamicTitle: true,
            },
        },
    },
    initialGlobals: {
        colorScheme: 'auto',
    },
    decorators: [
        // Cleanup decorator — removes any per-story `<style>` tag injected by
        // the `withCustomProperties()` helper from
        // `src/components/story-overrides.ts`. Runs before each story so
        // overrides don't leak when navigating between stories. Mirrors the
        // pattern used by `tbx-mat-banners` and `tbx-mat-notifications`.
        (storyFn) => {
            removeStoryOverrideStyleTag();
            return storyFn();
        },
        // Color scheme decorator — applies data-color-scheme to the document
        // root, mirroring what ThemeService does at runtime. The SCSS in
        // storybook-theme.scss bridges data-color-scheme to the CSS
        // color-scheme property, which flips M3 light-dark() tokens.
        (storyFn, context) => {
            const scheme = context.globals['colorScheme'] || 'auto';
            const root = document.documentElement;

            if (scheme === 'auto') {
                delete root.dataset['colorScheme'];
            } else {
                root.dataset['colorScheme'] = scheme;
            }

            return storyFn();
        },
        applicationConfig({
            providers: [
                provideAnimationsAsync(),
                provideTbxMatSeverityTheme({ invert: false, applyToRoot: true }),
                {
                    provide: MAT_ICON_DEFAULT_OPTIONS,
                    useValue: { fontSet: 'material-symbols-rounded' },
                },
                {
                    provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
                    useFactory: () => ({
                        severityIconResolverService: new TbxMatDialogSeverityFontIconService(
                            'material-symbols-rounded'
                        ),
                    }),
                },
            ],
        }),
    ],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
