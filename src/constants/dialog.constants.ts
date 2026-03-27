import { DialogResultType } from '../types/dialog-result.type';
import { type DialogFooterButton } from '../models/dialog-footer.model';

/**
 * Dialog system constants.
 *
 * Centralizes button presets and default dimensions. Callers can import
 * presets directly or override with custom footer arrays.
 */

/** Default dialog width when not specified in DialogConfig. */
export const DIALOG_DEFAULT_WIDTH = '30rem';

/**
 * Single OK button — right-aligned, primary emphasis.
 * Default for informational dialogs.
 */
export const BUTTONS_OK: readonly DialogFooterButton[] = [
    {
        key: 'ok',
        type: 'button',
        label: 'OK',
        result: DialogResultType.Affirm,
        emphasis: 'primary',
        align: 'end',
    },
];

/**
 * OK + Cancel buttons — Cancel left, OK right.
 * Default for input dialogs.
 */
export const BUTTONS_OK_CANCEL: readonly DialogFooterButton[] = [
    {
        key: 'cancel',
        type: 'button',
        label: 'Cancel',
        result: DialogResultType.Cancel,
        emphasis: 'text',
        align: 'start',
    },
    {
        key: 'ok',
        type: 'button',
        label: 'OK',
        result: DialogResultType.Affirm,
        emphasis: 'primary',
        align: 'end',
    },
];

/**
 * Yes + No buttons — both right-aligned, Yes primary.
 * Default for confirmation dialogs.
 */
export const BUTTONS_YES_NO: readonly DialogFooterButton[] = [
    {
        key: 'no',
        type: 'button',
        label: 'No',
        result: DialogResultType.Deny,
        emphasis: 'text',
        align: 'end',
    },
    {
        key: 'yes',
        type: 'button',
        label: 'Yes',
        result: DialogResultType.Affirm,
        emphasis: 'primary',
        align: 'end',
    },
];

/**
 * Yes + No + Cancel buttons — Cancel left, No and Yes right.
 */
export const BUTTONS_YES_NO_CANCEL: readonly DialogFooterButton[] = [
    {
        key: 'cancel',
        type: 'button',
        label: 'Cancel',
        result: DialogResultType.Cancel,
        emphasis: 'text',
        align: 'start',
    },
    {
        key: 'no',
        type: 'button',
        label: 'No',
        result: DialogResultType.Deny,
        emphasis: 'text',
        align: 'end',
    },
    {
        key: 'yes',
        type: 'button',
        label: 'Yes',
        result: DialogResultType.Affirm,
        emphasis: 'primary',
        align: 'end',
    },
];
