import { type Signal } from '@angular/core';
import { type TbxMatDialogDismissReason } from '../types/dialog-result.type';

/**
 * Base interface for all dialog footer items — buttons and form controls alike.
 *
 * Every footer item has a `key` (used in the returned footerValues record)
 * and an `align` (determines left or right positioning in the footer row).
 *
 * The footer is a single flex row. Items render in caller-specified array order.
 * The first `align: 'end'` item receives `margin-left: auto`, pushing it and
 * all subsequent items to the right side.
 */
export interface TbxMatDialogFooterItem {
    /** Unique identifier. Used as the property name in TbxMatDialogResult.footerValues. */
    readonly key: string;

    /** Position within the footer row. 'start' flows left, 'end' flows right. */
    readonly align: 'start' | 'end';
}

/**
 * Button footer item. Clicking a button with a `result` closes the dialog
 * and returns that result in TbxMatDialogResult.
 */
export interface TbxMatDialogFooterButton extends TbxMatDialogFooterItem {
    readonly type: 'button';

    /** Button label text. */
    readonly label: string;

    /** Material icon name. Rendered before or after the label based on iconPosition. */
    readonly icon?: string;

    /**
     * Position of the icon relative to the label.
     * Defaults to 'before'.
     */
    readonly iconPosition?: 'before' | 'after';

    /**
     * Visual emphasis of the button:
     * - 'primary' → matButton="filled" with emphasis accent color
     * - 'destructive' → matButton="filled" with --tbx-mat-dialog-destructive-accent
     * - 'text' → matButton="text" (no background)
     *
     * Defaults to 'text' when omitted.
     */
    readonly emphasis?: 'primary' | 'destructive' | 'text';

    /** TbxMatDialogDismissReason returned when this button is clicked. Closes the dialog. */
    readonly result?: TbxMatDialogDismissReason;

    /**
     * Whether the button is disabled.
     * Accepts a static boolean or a Signal<boolean> for reactive binding
     * (e.g., driven by TbxMatDialogData.isValid).
     */
    readonly disabled?: boolean | Signal<boolean>;
}

/**
 * Checkbox footer control. Value is tracked in TbxMatDialogResult.footerValues
 * as a boolean under the item's key.
 */
export interface TbxMatDialogFooterCheckbox extends TbxMatDialogFooterItem {
    readonly type: 'checkbox';

    /** Label displayed next to the checkbox. */
    readonly label: string;

    /** Initial checked state. Defaults to false. */
    readonly initialValue?: boolean;
}

/**
 * Slide toggle footer control. Value is tracked in TbxMatDialogResult.footerValues
 * as a boolean under the item's key.
 */
export interface TbxMatDialogFooterToggle extends TbxMatDialogFooterItem {
    readonly type: 'toggle';

    /** Label displayed next to the toggle. */
    readonly label: string;

    /** Initial toggle state. Defaults to false. */
    readonly initialValue?: boolean;
}

/** Individual option within a TbxMatDialogFooterRadioGroup. */
export interface TbxMatDialogFooterRadioOption {
    /** Display label for the radio button. */
    readonly label: string;

    /** Value submitted when this option is selected. */
    readonly value: string;
}

/**
 * Radio group footer control. Single-select from a set of options.
 * Value is tracked in TbxMatDialogResult.footerValues as a string under the item's key.
 */
export interface TbxMatDialogFooterRadioGroup extends TbxMatDialogFooterItem {
    readonly type: 'radio-group';

    /** Available options. */
    readonly options: readonly TbxMatDialogFooterRadioOption[];

    /** Initially selected option value. */
    readonly initialValue?: string;
}

/** Individual option within a TbxMatDialogFooterToggleGroup. */
export interface TbxMatDialogFooterToggleOption {
    /** Display label for the toggle button. */
    readonly label: string;

    /** Value submitted when this option is selected. */
    readonly value: string;

    /** Material icon name. When provided, renders an icon-only toggle button. */
    readonly icon?: string;
}

/**
 * Button toggle group footer control. Single-select or multi-select.
 * Value is tracked in TbxMatDialogResult.footerValues as a string (single-select)
 * or string[] (multi-select) under the item's key.
 */
export interface TbxMatDialogFooterToggleGroup extends TbxMatDialogFooterItem {
    readonly type: 'toggle-group';

    /** Available options. */
    readonly options: readonly TbxMatDialogFooterToggleOption[];

    /** Allow multiple selections. Defaults to false (single-select). */
    readonly multiple?: boolean;

    /** Initially selected value(s). String for single-select, string[] for multi-select. */
    readonly initialValue?: string | string[];
}
