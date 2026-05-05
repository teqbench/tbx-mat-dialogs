import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { DialogHarnessComponent, withSvgIcons } from '../../components/dialog.stories.common';

const INSTRUCTIONS =
    'Modal dialogs with severity-leveled chrome. Service methods (success / error / warning / information / help / default) mirror tbx-mat-banners and tbx-mat-notifications. Dialog-only patterns (confirm / input) layer on top of severity. Click any button to open the corresponding dialog. The dialog surface stays neutral; the header icon container takes the severity color.';

const meta: Meta<DialogHarnessComponent> = {
    title: 'Dialogs',
    tags: ['dialogs'],
    component: DialogHarnessComponent,
    decorators: [moduleMetadata({ imports: [DialogHarnessComponent] })],
};

export default meta;
type Story = StoryObj<DialogHarnessComponent>;

export const Dialogs: Story = {
    args: { description: INSTRUCTIONS },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: false, applyToRoot: true })],
        }),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Standard severity palette with the default Material Symbols font icons.',
            },
        },
    },
};

export const DialogsSvgIcons: Story = {
    name: 'Dialogs (SVG Icons)',
    args: { description: INSTRUCTIONS },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: false, applyToRoot: true })],
        }),
        withSvgIcons(),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Standard severity palette with the default SVG icons shipped by `@teqbench/tbx-mat-severity-theme` (registered via `TbxMatDialogSeveritySvgIconService`).',
            },
        },
    },
};

export const Inverted: Story = {
    args: { description: INSTRUCTIONS },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })],
        }),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Inverted severity palette — wired via `provideTbxMatSeverityTheme({ invert: true })` at bootstrap. The inversion is app-global: banners, notifications, and dialogs consuming the same shared theme invert simultaneously.',
            },
        },
    },
};

export const InvertedSvgIcons: Story = {
    name: 'Inverted (SVG Icons)',
    args: { description: INSTRUCTIONS },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })],
        }),
        withSvgIcons(),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Inverted severity palette with the default SVG icons.',
            },
        },
    },
};
