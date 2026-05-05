import { TbxMatDialogDismissReason } from '../types/dialog-result.type';
import { type TbxMatDialogFooterButton } from '../models/dialog-footer.model';

/**
 * Dialog system constants.
 *
 * Centralizes button presets and default dimensions. Callers can import
 * presets directly or override with custom footer arrays.
 */

/** Default dialog width when not specified in TbxMatDialogConfig. */
export const TBX_MAT_DIALOG_DEFAULT_WIDTH = '30rem';

/**
 * Single OK button — right-aligned, primary emphasis.
 * Default for informational dialogs.
 */
export const TBX_MAT_DIALOG_BUTTONS_OK: readonly TbxMatDialogFooterButton[] = [
    {
        key: 'ok',
        type: 'button',
        label: 'OK',
        result: TbxMatDialogDismissReason.Affirm,
        emphasis: 'primary',
        align: 'end',
    },
];

/**
 * OK + Cancel buttons — Cancel left, OK right.
 * Default for input dialogs.
 */
export const TBX_MAT_DIALOG_BUTTONS_OK_CANCEL: readonly TbxMatDialogFooterButton[] = [
    {
        key: 'cancel',
        type: 'button',
        label: 'Cancel',
        result: TbxMatDialogDismissReason.Cancel,
        emphasis: 'text',
        align: 'start',
    },
    {
        key: 'ok',
        type: 'button',
        label: 'OK',
        result: TbxMatDialogDismissReason.Affirm,
        emphasis: 'primary',
        align: 'end',
    },
];

/**
 * Yes + No buttons — both right-aligned, Yes primary.
 * Default for confirmation dialogs.
 */
export const TBX_MAT_DIALOG_BUTTONS_YES_NO: readonly TbxMatDialogFooterButton[] = [
    {
        key: 'no',
        type: 'button',
        label: 'No',
        result: TbxMatDialogDismissReason.Deny,
        emphasis: 'text',
        align: 'end',
    },
    {
        key: 'yes',
        type: 'button',
        label: 'Yes',
        result: TbxMatDialogDismissReason.Affirm,
        emphasis: 'primary',
        align: 'end',
    },
];

/**
 * Yes + No + Cancel buttons — Cancel left, No and Yes right.
 */
export const TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL: readonly TbxMatDialogFooterButton[] = [
    {
        key: 'cancel',
        type: 'button',
        label: 'Cancel',
        result: TbxMatDialogDismissReason.Cancel,
        emphasis: 'text',
        align: 'start',
    },
    {
        key: 'no',
        type: 'button',
        label: 'No',
        result: TbxMatDialogDismissReason.Deny,
        emphasis: 'text',
        align: 'end',
    },
    {
        key: 'yes',
        type: 'button',
        label: 'Yes',
        result: TbxMatDialogDismissReason.Affirm,
        emphasis: 'primary',
        align: 'end',
    },
];
