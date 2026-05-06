import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { DEFAULT_HARNESS_ARGS, DialogHarnessComponent, SHARED_HARNESS_ARG_TYPES, withSvgIcons } from '../../components/dialog.stories.common';

const INSTRUCTIONS = 'Modal dialogs with severity-leveled chrome. Service methods (default / success / error / warning / information / help) mirror tbx-mat-banners and tbx-mat-notifications. Dialog-only patterns (confirm / input) layer on top of severity. Click any button to open the corresponding dialog. Use the Controls panel to tweak Icon Size and Icon Animation. The dialog surface stays neutral; the header icon container takes the severity color and scales proportionally with the icon size.';

const meta: Meta<DialogHarnessComponent> = {
    title: 'Dialogs',
    tags: ['dialogs'],
    component: DialogHarnessComponent,
    decorators: [moduleMetadata({ imports: [DialogHarnessComponent] })],
    argTypes: SHARED_HARNESS_ARG_TYPES,
};

export default meta;
type Story = StoryObj<DialogHarnessComponent>;

export const Dialogs: Story = {
    args: { ...DEFAULT_HARNESS_ARGS, description: INSTRUCTIONS },
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
    args: { ...DEFAULT_HARNESS_ARGS, description: INSTRUCTIONS },
    argTypes: {
        ...SHARED_HARNESS_ARG_TYPES,
        iconAnimation: { table: { disable: true }, control: false },
    },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: false, applyToRoot: true })],
        }),
        withSvgIcons(),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Standard severity palette with the default SVG icons shipped by `@teqbench/tbx-mat-severity-theme` (registered via `TbxMatDialogSeveritySvgIconService`). Icon animation is font-icon only and does not apply here.',
            },
        },
    },
};

export const Inverted: Story = {
    args: { ...DEFAULT_HARNESS_ARGS, description: INSTRUCTIONS },
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
    args: { ...DEFAULT_HARNESS_ARGS, description: INSTRUCTIONS },
    argTypes: {
        ...SHARED_HARNESS_ARG_TYPES,
        iconAnimation: { table: { disable: true }, control: false },
    },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })],
        }),
        withSvgIcons(),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Inverted severity palette with the default SVG icons. Icon animation is font-icon only and does not apply here.',
            },
        },
    },
};
