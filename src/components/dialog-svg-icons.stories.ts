import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DialogHarnessComponent, withSvgIcons } from './dialog.stories.common';

const meta: Meta<DialogHarnessComponent> = {
    title: 'Dialogs/SVG Icons',
    component: DialogHarnessComponent,
    decorators: [moduleMetadata({ imports: [DialogHarnessComponent] }), withSvgIcons()],
};

export default meta;
type Story = StoryObj<DialogHarnessComponent>;

export const Default: Story = {
    name: 'SVG Icons',
    parameters: {
        docs: {
            description: {
                story: 'Standard severity palette with the default SVG icons shipped by `@teqbench/tbx-mat-severity-theme` (registered via `TbxMatDialogSeveritySvgIconService`). Click any button to open the corresponding dialog and observe the SVG-rendered header icon.',
            },
        },
    },
};
