import {
    type TbxMatDialogFooterButton,
    type TbxMatDialogFooterCheckbox,
    type TbxMatDialogFooterToggle,
    type TbxMatDialogFooterRadioGroup,
    type TbxMatDialogFooterToggleGroup,
} from '../models/dialog-footer.model';

/**
 * Discriminated union of all dialog footer item types
 *
 * @remarks
 * The dialog shell component renders each item via `@switch (control.type)`,
 * and {@link https://www.typescriptlang.org | TypeScript} narrows the type
 * automatically in each branch. Members are {@link TbxMatDialogFooterButton},
 * {@link TbxMatDialogFooterCheckbox}, {@link TbxMatDialogFooterToggle},
 * {@link TbxMatDialogFooterRadioGroup}, and {@link TbxMatDialogFooterToggleGroup}.
 *
 * @usage
 * Use as the element type when assembling a custom `footer` array on a {@link TbxMatDialogConfig}
 * or a {@link TbxMatDialogConfigArgs}.
 *
 * @example
 * ```typescript
 * const footer: readonly TbxMatDialogFooterControlType[] = [
 *     { key: 'remember', type: 'checkbox', label: 'Remember me', align: 'start' },
 *     { key: 'cancel', type: 'button', label: 'Cancel', result: TbxMatDialogDismissReason.Cancel, align: 'end' },
 *     { key: 'ok', type: 'button', label: 'OK', emphasis: 'primary', result: TbxMatDialogDismissReason.Affirm, align: 'end' },
 * ];
 * ```
 *
 * @category Types
 * @displayName Dialog Footer Control Type
 * @order 3
 * @since 0.1.0
 * @related TbxMatDialogFooterButton
 * @related TbxMatDialogFooterCheckbox
 * @related TbxMatDialogFooterToggle
 * @related TbxMatDialogFooterRadioGroup
 * @related TbxMatDialogFooterToggleGroup
 *
 * @public
 */
export type TbxMatDialogFooterControlType =
    | TbxMatDialogFooterButton
    | TbxMatDialogFooterCheckbox
    | TbxMatDialogFooterToggle
    | TbxMatDialogFooterRadioGroup
    | TbxMatDialogFooterToggleGroup;
