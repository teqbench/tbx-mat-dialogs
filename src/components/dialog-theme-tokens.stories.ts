import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DEFAULT_HARNESS_ARGS, DialogHarnessComponent, SHARED_HARNESS_ARG_TYPES } from './dialog.stories.common';
import { withCustomProperties } from './story-overrides';

const meta: Meta<DialogHarnessComponent> = {
    title: 'Dialogs/Theme Token Override',
    component: DialogHarnessComponent,
    decorators: [moduleMetadata({ imports: [DialogHarnessComponent] })],
    argTypes: SHARED_HARNESS_ARG_TYPES,
};

export default meta;
type Story = StoryObj<DialogHarnessComponent>;

/* Per-package alias override — only dialogs flip; banners/notifications retain
 * the shared severity-theme defaults. Uses the `--tbx-mat-dialog-{level}-{background,text}`
 * aliases emitted by the `severity.tbx-mat-severity-theme('tbx-mat-dialog')`
 * mixin in `_tbx-mat-dialogs.scss`. */
const PER_PACKAGE_OVERRIDE = `
    html {
        --tbx-mat-dialog-success-background: #1b5e20;
        --tbx-mat-dialog-success-text: #ffffff;
        --tbx-mat-dialog-information-background: #4527a0;
        --tbx-mat-dialog-information-text: #ffffff;
        --tbx-mat-dialog-warning-background: #ef6c00;
        --tbx-mat-dialog-warning-text: #ffffff;
    }
`;

export const Default: Story = {
    name: 'Theme Token Override',
    args: { ...DEFAULT_HARNESS_ARGS },
    decorators: [withCustomProperties(PER_PACKAGE_OVERRIDE)],
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates per-package theme overrides via the `--tbx-mat-dialog-{level}-{background,text}` aliases. Themes can override the dialog-prefixed tokens (affects only dialogs) or the underlying `--tbx-mat-severity-{level}-*` tokens (affects every severity-aware package). This story overrides the success / information / warning aliases — open the corresponding dialogs to see the custom colors.',
            },
        },
    },
};
