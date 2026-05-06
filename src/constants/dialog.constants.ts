import { TbxMatDialogDismissReason } from '../types/dialog-result.type';
import { type TbxMatDialogFooterButton } from '../models/dialog-footer.model';

/**
 * Default dialog width when not specified in {@link TbxMatDialogConfig}
 *
 * @remarks
 * Applied by {@link TbxMatDialogService} when {@link TbxMatDialogConfig}.width is omitted.
 * Override per-dialog by setting `width` in the config.
 *
 * @example
 * ```typescript
 * await dialog.show({ title: 'Custom width', width: '40rem', message: '...' });
 * // omitting width yields TBX_MAT_DIALOG_DEFAULT_WIDTH ('30rem')
 * ```
 *
 * @category Constants
 * @displayName Default Width
 * @order 1
 * @since 0.1.0
 *
 * @public
 */
export const TBX_MAT_DIALOG_DEFAULT_WIDTH = '30rem';

/**
 * Single OK button preset — right-aligned, primary emphasis
 *
 * @remarks
 * Default footer for the severity-leveled methods (`success`, `error`, `warning`,
 * `information`, `help`, `default`).
 *
 * @usage
 * Spread into a custom `footer` array, or pass directly as the `footer` field. Use when
 * the dialog only needs an acknowledgement.
 *
 * @example
 * ```typescript
 * await dialog.show({ title: 'Saved', message: 'Done.', footer: TBX_MAT_DIALOG_BUTTONS_OK });
 * ```
 *
 * @category Constants
 * @displayName OK Buttons Preset
 * @order 2
 * @since 0.1.0
 * @related TBX_MAT_DIALOG_BUTTONS_OK_CANCEL
 * @related TBX_MAT_DIALOG_BUTTONS_YES_NO
 * @related TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL
 *
 * @public
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
 * OK + Cancel buttons preset — Cancel left, OK right
 *
 * @remarks
 * Default footer for the `input` method.
 *
 * @usage
 * Use when the dialog requires a positive commit and offers an explicit cancel path.
 *
 * @example
 * ```typescript
 * await dialog.show({
 *     title: 'Rename',
 *     content: RenameFormComponent, // hypothetical consumer-defined component
 *     footer: TBX_MAT_DIALOG_BUTTONS_OK_CANCEL,
 * });
 * ```
 *
 * @category Constants
 * @displayName OK/Cancel Buttons Preset
 * @order 3
 * @since 0.1.0
 * @related TBX_MAT_DIALOG_BUTTONS_OK
 *
 * @public
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
 * Yes + No buttons preset — both right-aligned, Yes primary
 *
 * @remarks
 * Default footer for the `confirm` method.
 *
 * @usage
 * Use when the dialog asks a binary question without a "back out" path.
 *
 * @example
 * ```typescript
 * await dialog.show({
 *     title: 'Continue?',
 *     message: 'Are you sure?',
 *     footer: TBX_MAT_DIALOG_BUTTONS_YES_NO,
 * });
 * ```
 *
 * @category Constants
 * @displayName Yes/No Buttons Preset
 * @order 4
 * @since 0.1.0
 * @related TBX_MAT_DIALOG_BUTTONS_OK
 * @related TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL
 *
 * @public
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
 * Yes + No + Cancel buttons preset — Cancel left, No and Yes right
 *
 * @usage
 * Use when the dialog asks a binary question and also needs a third option to back out
 * without committing to either answer.
 *
 * @example
 * ```typescript
 * await dialog.show({
 *     title: 'Save changes?',
 *     message: 'You have unsaved changes.',
 *     footer: TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL,
 * });
 * ```
 *
 * @category Constants
 * @displayName Yes/No/Cancel Buttons Preset
 * @order 5
 * @since 0.1.0
 * @related TBX_MAT_DIALOG_BUTTONS_YES_NO
 *
 * @public
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
