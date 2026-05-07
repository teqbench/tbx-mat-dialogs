import { type Signal } from '@angular/core';
import { type TbxMatDialogDismissReason } from '../enums/dialog-dismiss-reason.enum';

/**
 * Base interface for all dialog footer items — buttons and form controls alike
 *
 * @remarks
 * Every footer item has a `key` (used in the returned {@link TbxMatDialogResult}.footerValues
 * record) and an `align` (determines left or right positioning in the footer row).
 *
 * The footer is a single flex row. Items render in caller-specified array order. The first
 * `align: 'end'` item receives `margin-left: auto`, pushing it and all subsequent items to
 * the right side.
 *
 * @usage
 * Not used directly — extend via the discriminated members of {@link TbxMatDialogFooterControlType}.
 *
 * @example
 * ```typescript
 * // Implementations are the concrete footer item interfaces.
 * const item: TbxMatDialogFooterButton = {
 *     key: 'ok',
 *     type: 'button',
 *     label: 'OK',
 *     emphasis: 'primary',
 *     result: TbxMatDialogDismissReason.Affirm,
 *     align: 'end',
 * };
 * ```
 *
 * @category Models
 * @displayName Dialog Footer Item
 * @order 5
 * @since 0.1.0
 * @related TbxMatDialogFooterControlType
 *
 * @public
 */
export interface TbxMatDialogFooterItem {
    /**
     * Unique identifier
     *
     * @remarks
     * Used as the property name in {@link TbxMatDialogResult}.footerValues.
     *
     * @order 1
     *
     * @public
     */
    readonly key: string;

    /**
     * Position within the footer row
     *
     * @remarks
     * `'start'` flows left, `'end'` flows right.
     *
     * @order 2
     *
     * @public
     */
    readonly align: 'start' | 'end';
}

/**
 * Button footer item
 *
 * @remarks
 * Clicking a button with a `result` closes the dialog and returns that result in
 * {@link TbxMatDialogResult}. Buttons without a `result` perform side effects (e.g.,
 * navigation) without dismissing the dialog.
 *
 * @usage
 * Add to a {@link TbxMatDialogConfig}.footer array, or use a button preset constant
 * ({@link TBX_MAT_DIALOG_BUTTONS_OK}, etc.).
 *
 * @example
 * ```typescript
 * const proceed: TbxMatDialogFooterButton = {
 *     key: 'proceed',
 *     type: 'button',
 *     label: 'Proceed',
 *     emphasis: 'primary',
 *     result: TbxMatDialogDismissReason.Affirm,
 *     align: 'end',
 * };
 * ```
 *
 * @category Models
 * @displayName Dialog Footer Button
 * @order 6
 * @since 0.1.0
 * @related TbxMatDialogFooterControlType
 * @related TBX_MAT_DIALOG_BUTTONS_OK
 *
 * @public
 */
export interface TbxMatDialogFooterButton extends TbxMatDialogFooterItem {
    readonly type: 'button';

    /**
     * Button label text
     *
     * @order 1
     *
     * @public
     */
    readonly label: string;

    /**
     * {@link https://fonts.google.com/icons | Material Symbols} icon name
     *
     * @remarks
     * Rendered before or after the label based on `iconPosition`.
     *
     * @order 2
     *
     * @public
     */
    readonly icon?: string;

    /**
     * Position of the icon relative to the label
     *
     * @remarks
     * Defaults to `'before'`.
     *
     * @order 3
     *
     * @public
     */
    readonly iconPosition?: 'before' | 'after';

    /**
     * Visual emphasis of the button
     *
     * @remarks
     * - `'primary'` — `matButton="filled"` with the dialog severity tokens.
     * - `'text'` — `matButton="text"` (no background).
     *
     * Defaults to `'text'` when omitted. For destructive prompts, set the
     * dialog `severity` to `'warning'` (reversible) or `'error'` (irreversible);
     * the panel itself communicates danger and a single `'primary'` affirm
     * button reads correctly without per-button palette overrides.
     *
     * @order 4
     *
     * @public
     */
    readonly emphasis?: 'primary' | 'text';

    /**
     * {@link TbxMatDialogDismissReason} returned when this button is clicked
     *
     * @remarks
     * When provided, clicking the button closes the dialog with this result.
     *
     * @order 5
     *
     * @public
     */
    readonly result?: TbxMatDialogDismissReason;

    /**
     * Whether the button is disabled
     *
     * @remarks
     * Accepts a static boolean or a `Signal<boolean>` for reactive binding (e.g., driven
     * by {@link TbxMatDialogData}.isValid).
     *
     * @order 6
     *
     * @public
     */
    readonly disabled?: boolean | Signal<boolean>;
}

/**
 * Checkbox footer control
 *
 * @remarks
 * Value is tracked in {@link TbxMatDialogResult}.footerValues as a boolean under the
 * item's key.
 *
 * @usage
 * Add to a {@link TbxMatDialogConfig}.footer array to collect a boolean alongside the
 * dismiss action.
 *
 * @example
 * ```typescript
 * const remember: TbxMatDialogFooterCheckbox = {
 *     key: 'remember',
 *     type: 'checkbox',
 *     label: "Don't ask again",
 *     align: 'start',
 * };
 * ```
 *
 * @category Models
 * @displayName Dialog Footer Checkbox
 * @order 7
 * @since 0.1.0
 * @related TbxMatDialogFooterControlType
 *
 * @public
 */
export interface TbxMatDialogFooterCheckbox extends TbxMatDialogFooterItem {
    readonly type: 'checkbox';

    /**
     * Label displayed next to the checkbox
     *
     * @order 1
     *
     * @public
     */
    readonly label: string;

    /**
     * Initial checked state
     *
     * @remarks
     * Defaults to `false`.
     *
     * @order 2
     *
     * @public
     */
    readonly initialValue?: boolean;
}

/**
 * Slide toggle footer control
 *
 * @remarks
 * Value is tracked in {@link TbxMatDialogResult}.footerValues as a boolean under the
 * item's key.
 *
 * @usage
 * Add to a {@link TbxMatDialogConfig}.footer array to collect a boolean alongside the
 * dismiss action — visually distinct from a checkbox.
 *
 * @example
 * ```typescript
 * const notify: TbxMatDialogFooterToggle = {
 *     key: 'notify',
 *     type: 'toggle',
 *     label: 'Email notifications',
 *     initialValue: true,
 *     align: 'start',
 * };
 * ```
 *
 * @category Models
 * @displayName Dialog Footer Toggle
 * @order 8
 * @since 0.1.0
 * @related TbxMatDialogFooterControlType
 *
 * @public
 */
export interface TbxMatDialogFooterToggle extends TbxMatDialogFooterItem {
    readonly type: 'toggle';

    /**
     * Label displayed next to the toggle
     *
     * @order 1
     *
     * @public
     */
    readonly label: string;

    /**
     * Initial toggle state
     *
     * @remarks
     * Defaults to `false`.
     *
     * @order 2
     *
     * @public
     */
    readonly initialValue?: boolean;
}

/**
 * Radio group footer control — single-select from a set of options
 *
 * @remarks
 * Value is tracked in {@link TbxMatDialogResult}.footerValues as a string under the
 * item's key.
 *
 * @usage
 * Add to a {@link TbxMatDialogConfig}.footer array to let the user pick one option from a
 * small set (typically two to four).
 *
 * @example
 * ```typescript
 * const visibility: TbxMatDialogFooterRadioGroup = {
 *     key: 'visibility',
 *     type: 'radio-group',
 *     options: [
 *         { label: 'Public', value: 'public' },
 *         { label: 'Private', value: 'private' },
 *     ],
 *     initialValue: 'public',
 *     align: 'start',
 * };
 * ```
 *
 * @category Models
 * @displayName Dialog Footer Radio Group
 * @order 9
 * @since 0.1.0
 * @related TbxMatDialogFooterRadioOption
 * @related TbxMatDialogFooterControlType
 *
 * @public
 */
export interface TbxMatDialogFooterRadioGroup extends TbxMatDialogFooterItem {
    readonly type: 'radio-group';

    /**
     * Available options
     *
     * @order 1
     *
     * @public
     */
    readonly options: readonly TbxMatDialogFooterRadioOption[];

    /**
     * Initially selected option value
     *
     * @order 2
     *
     * @public
     */
    readonly initialValue?: string;
}

/**
 * Individual option within a {@link TbxMatDialogFooterRadioGroup}
 *
 * @example
 * ```typescript
 * const option: TbxMatDialogFooterRadioOption = { label: 'Public', value: 'public' };
 * ```
 *
 * @category Models
 * @displayName Dialog Footer Radio Option
 * @order 10
 * @since 0.1.0
 * @related TbxMatDialogFooterRadioGroup
 *
 * @public
 */
export interface TbxMatDialogFooterRadioOption {
    /**
     * Display label for the radio button
     *
     * @order 1
     *
     * @public
     */
    readonly label: string;

    /**
     * Value submitted when this option is selected
     *
     * @order 2
     *
     * @public
     */
    readonly value: string;
}

/**
 * Button toggle group footer control — single-select or multi-select
 *
 * @remarks
 * Value is tracked in {@link TbxMatDialogResult}.footerValues as a string (single-select)
 * or `string[]` (multi-select) under the item's key.
 *
 * @usage
 * Add to a {@link TbxMatDialogConfig}.footer array to let the user pick from a set of
 * options rendered as a toggle button group. Use `multiple: true` to allow several
 * selections.
 *
 * @example
 * ```typescript
 * const align: TbxMatDialogFooterToggleGroup = {
 *     key: 'align',
 *     type: 'toggle-group',
 *     options: [
 *         { label: 'Left', value: 'left', icon: 'format_align_left' },
 *         { label: 'Center', value: 'center', icon: 'format_align_center' },
 *         { label: 'Right', value: 'right', icon: 'format_align_right' },
 *     ],
 *     initialValue: 'left',
 *     align: 'start',
 * };
 * ```
 *
 * @category Models
 * @displayName Dialog Footer Toggle Group
 * @order 11
 * @since 0.1.0
 * @related TbxMatDialogFooterToggleOption
 * @related TbxMatDialogFooterControlType
 *
 * @public
 */
export interface TbxMatDialogFooterToggleGroup extends TbxMatDialogFooterItem {
    readonly type: 'toggle-group';

    /**
     * Available options
     *
     * @order 1
     *
     * @public
     */
    readonly options: readonly TbxMatDialogFooterToggleOption[];

    /**
     * Allow multiple selections
     *
     * @remarks
     * Defaults to `false` (single-select).
     *
     * @order 2
     *
     * @public
     */
    readonly multiple?: boolean;

    /**
     * Initially selected value(s)
     *
     * @remarks
     * String for single-select, `string[]` for multi-select.
     *
     * @order 3
     *
     * @public
     */
    readonly initialValue?: string | string[];
}

/**
 * Individual option within a {@link TbxMatDialogFooterToggleGroup}
 *
 * @example
 * ```typescript
 * const option: TbxMatDialogFooterToggleOption = {
 *     label: 'Left',
 *     value: 'left',
 *     icon: 'format_align_left',
 * };
 * ```
 *
 * @category Models
 * @displayName Dialog Footer Toggle Option
 * @order 12
 * @since 0.1.0
 * @related TbxMatDialogFooterToggleGroup
 *
 * @public
 */
export interface TbxMatDialogFooterToggleOption {
    /**
     * Display label for the toggle button
     *
     * @order 1
     *
     * @public
     */
    readonly label: string;

    /**
     * Value submitted when this option is selected
     *
     * @order 2
     *
     * @public
     */
    readonly value: string;

    /**
     * {@link https://fonts.google.com/icons | Material Symbols} icon name
     *
     * @remarks
     * When provided, renders an icon-only toggle button.
     *
     * @order 3
     *
     * @public
     */
    readonly icon?: string;
}
