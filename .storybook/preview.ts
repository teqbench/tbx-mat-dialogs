import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { TBX_MAT_DIALOG_PROVIDER_CONFIG } from '../src/tokens/dialog-provider-config.token';
import { TbxMatDialogSeverityFontIconService } from '../src/services/dialog-severity-font-icon.service';
import { removeStoryOverrideStyleTag } from '../src/components/story-overrides';

// M3 prebuilt theme — provides typography, shape, and state-layer tokens.
import '@angular/material/prebuilt-themes/azure-blue.css';

import '../src/styles/_tbx-mat-dialogs.scss';

const preview: Preview = {
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
                        severityIconResolverService: new TbxMatDialogSeverityFontIconService('material-symbols-rounded'),
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
