import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DEFAULT_HARNESS_ARGS, DialogHarnessComponent, SHARED_HARNESS_ARG_TYPES, withAlternateCloseIcon } from './dialog.stories.common';

const meta: Meta<DialogHarnessComponent> = {
    title: 'Dialogs/Custom Close Icon',
    component: DialogHarnessComponent,
    decorators: [moduleMetadata({ imports: [DialogHarnessComponent] }), withAlternateCloseIcon()],
    argTypes: SHARED_HARNESS_ARG_TYPES,
};

export default meta;
type Story = StoryObj<DialogHarnessComponent>;

export const Default: Story = {
    name: 'Custom Close Icon',
    args: { ...DEFAULT_HARNESS_ARGS },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates the optional `closeIconResolverService` slot on `TbxMatDialogProviderConfig`. A consumer-defined `StoryAlternateCloseIconService` registers the `cancel` Material Symbols ligature (X-in-circle) under the `close` key. Open any dialog and notice the close button now renders the alternate glyph.',
            },
        },
    },
};
