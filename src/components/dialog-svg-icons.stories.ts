import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DEFAULT_HARNESS_ARGS, DialogHarnessComponent, SHARED_HARNESS_ARG_TYPES, withSvgIcons } from './dialog.stories.common';

const meta: Meta<DialogHarnessComponent> = {
    title: 'Dialogs/SVG Icons',
    component: DialogHarnessComponent,
    decorators: [moduleMetadata({ imports: [DialogHarnessComponent] }), withSvgIcons()],
    argTypes: {
        ...SHARED_HARNESS_ARG_TYPES,
        // Icon animation uses the Material Symbols FILL axis (font-only),
        // so it doesn't apply to the SVG variant — same disable banners uses
        // for its SVG icon stories.
        iconAnimation: { table: { disable: true }, control: false },
    },
};

export default meta;
type Story = StoryObj<DialogHarnessComponent>;

export const Default: Story = {
    name: 'SVG Icons',
    args: { ...DEFAULT_HARNESS_ARGS },
    parameters: {
        docs: {
            description: {
                story: 'Standard severity palette with the default SVG icons shipped by `@teqbench/tbx-mat-severity-theme` (registered via `TbxMatDialogSeveritySvgIconService`). Use the **Icon Size** control to compare scaling against the font variant.',
            },
        },
    },
};
