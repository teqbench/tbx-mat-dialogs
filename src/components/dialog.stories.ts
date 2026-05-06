import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import {
    DEFAULT_HARNESS_ARGS,
    DialogHarnessComponent,
    SHARED_HARNESS_ARG_TYPES,
} from './dialog.stories.common';

const meta: Meta<DialogHarnessComponent> = {
    title: 'Dialogs',
    component: DialogHarnessComponent,
    decorators: [moduleMetadata({ imports: [DialogHarnessComponent] })],
    argTypes: SHARED_HARNESS_ARG_TYPES,
};

export default meta;
type Story = StoryObj<DialogHarnessComponent>;

export const Default: Story = {
    args: { ...DEFAULT_HARNESS_ARGS },
    parameters: {
        docs: {
            description: {
                story: 'Standard severity palette with the default Material Symbols font icons (registered via `TbxMatDialogSeverityFontIconService`). Use the **Icon Size** control to flip between `standard` (3rem default), `medium` (2rem), and `small` (1.5rem); each overrides `--tbx-mat-dialog-icon-size`. **Icon Animation** drives the Material Symbols `FILL` axis via `font-variation-settings`.',
            },
        },
    },
};

export const Inverted: Story = {
    args: { ...DEFAULT_HARNESS_ARGS },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })],
        }),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Inverted severity palette — wired via `provideTbxMatSeverityTheme({ invert: true })` at bootstrap. The inversion is app-global and shared across `tbx-mat-banners`, `tbx-mat-notifications`, and `tbx-mat-dialogs`.',
            },
        },
    },
};
