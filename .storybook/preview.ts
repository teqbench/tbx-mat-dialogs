import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { TBX_MAT_DIALOG_PROVIDER_CONFIG } from '../src/tokens/dialog-provider-config.token';
import { TbxMatDialogSeverityFontIconService } from '../src/services/dialog-severity-font-icon.service';

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
