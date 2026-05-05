import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { DialogHarnessComponent } from './dialog.stories.common';

const meta: Meta<DialogHarnessComponent> = {
    title: 'Dialogs',
    component: DialogHarnessComponent,
    decorators: [moduleMetadata({ imports: [DialogHarnessComponent] })],
};

export default meta;
type Story = StoryObj<DialogHarnessComponent>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Standard severity palette with the default Material Symbols font icons (registered via `TbxMatDialogSeverityFontIconService`). Click any button to open the corresponding dialog. The header icon container takes the severity color; the dialog surface stays neutral.',
            },
        },
    },
};

export const Inverted: Story = {
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })],
        }),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Inverted severity palette — wired via `provideTbxMatSeverityTheme({ invert: true })` at bootstrap. The inversion is app-global and shared across `tbx-mat-banners`, `tbx-mat-notifications`, and `tbx-mat-dialogs`. The icon container backgrounds and on-severity glyph colors swap.',
            },
        },
    },
};
