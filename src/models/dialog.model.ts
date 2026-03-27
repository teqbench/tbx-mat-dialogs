import { type Signal, Type } from '@angular/core';
import { DialogResultType } from '../types/dialog-result.type';
import { DialogEmphasisType } from '../types/dialog-emphasis.type';
import { type DialogFooterControlType } from '../types/dialog-footer-control.type';

/**
 * Typed output returned when a dialog closes.
 *
 * @typeParam T - Type of data returned by input dialogs (from DialogContent<T>.value).
 *               Defaults to `void` for informational and confirmation dialogs.
 * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
 *               Callers that need typed footer values specify an interface as the
 *               second generic parameter.
 *
 * Usage:
 * ```typescript
 * // Simple confirmation — both generics use defaults
 * const output: DialogOutput = await dialog.confirm({ ... });
 *
 * // Input dialog with typed data
 * const output: DialogOutput<string> = await dialog.input<string>({ ... });
 *
 * // Confirmation with typed footer values
 * interface MyFooter { dontAskAgain: boolean; }
 * const output: DialogOutput<void, MyFooter> = await dialog.confirm<MyFooter>({ ... });
 * ```
 */
export interface DialogOutput<
    T = void,
    F extends Record<string, unknown> = Record<string, unknown>,
> {
    /** Which action closed the dialog. */
    readonly result: DialogResultType;

    /** Data from input dialog content component. Undefined for non-input dialogs or Cancel/Close. */
    readonly data?: T;

    /** Values from footer controls, keyed by DialogFooterControlType.key. */
    readonly footerValues: F;
}

/**
 * Configuration for opening a dialog via DialogService.
 *
 * @typeParam T - Type of data for input dialogs. Defaults to `void`.
 * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
 */
export interface DialogConfig<T = void> {
    /** Dialog title displayed in the header. Required. */
    readonly title: string;

    /** Material icon name displayed before the title. Colored by emphasis. */
    readonly icon?: string;

    /** Secondary text displayed below the title. */
    readonly subtitle?: string;

    /**
     * Short badge text displayed next to the title (e.g., "Beta", "v2", "Required").
     * Rendered as a compact chip or styled span.
     */
    readonly contextBadge?: string;

    /** Message text displayed in the dialog body. Ignored when `content` is provided. */
    readonly message?: string;

    /** Visual emphasis — determines accent color for icon, buttons, and separators. */
    readonly emphasis?: DialogEmphasisType;

    /**
     * Component class to render in the dialog body for input dialogs.
     * Must implement DialogContent<T>.
     * When provided, `message` is ignored.
     */
    readonly content?: Type<DialogContent<T>>;

    /**
     * Footer items — buttons and controls rendered in a single flex row.
     * Items render in array order. First `align: 'end'` item gets `margin-left: auto`.
     * When omitted, DialogService applies a default button preset based on the dialog type.
     */
    readonly footer?: readonly DialogFooterControlType[];

    /** Dialog width. Defaults to DIALOG_DEFAULT_WIDTH. */
    readonly width?: string;

    /** Minimum width constraint. Mapped directly to MatDialogConfig.minWidth. */
    readonly minWidth?: string;

    /** Maximum width constraint. Mapped directly to MatDialogConfig.maxWidth. */
    readonly maxWidth?: string;

    /** Minimum height constraint. Mapped directly to MatDialogConfig.minHeight. */
    readonly minHeight?: string;

    /** Maximum height constraint. Mapped directly to MatDialogConfig.maxHeight. */
    readonly maxHeight?: string;

    /**
     * When true, prevents closing via Escape key or backdrop click.
     * The user must interact with a footer button to close.
     * Defaults to false.
     */
    readonly disableClose?: boolean;
}

/**
 * Contract for components rendered in dialog bodies.
 *
 * The dialog shell reads `isValid` to drive the affirm button's disabled state
 * and reads `value` to include in DialogOutput.data when the user confirms.
 *
 * Content components own their own form layout, validation, and state.
 * The dialog system never inspects the content — it only reads these two signals.
 *
 * @typeParam T - Type of value produced by the form content.
 *
 * ## Input dialogs (form content)
 *
 * ```typescript
 * @Component({ ... })
 * export class RenameFormComponent implements DialogContent<string> {
 *     readonly name = signal('');
 *     readonly isValid = computed(() => this.name().trim().length > 0);
 *     readonly value = this.name;
 * }
 * ```
 *
 * ## Non-input components (display-only content)
 *
 * Components that display content without producing a form value use
 * the null object pattern — `isValid` is always true (nothing to validate),
 * `value` is always undefined (nothing to extract):
 *
 * ```typescript
 * @Component({ ... })
 * export class UserSettingsComponent implements DialogContent<void> {
 *     readonly isValid = signal(true);
 *     readonly value = signal<void>(undefined);
 * }
 * ```
 *
 * This allows any component to be hosted in a dialog via `DialogService.show()`
 * without type casts. The shell's affirm button is never disabled (isValid is true),
 * and DialogOutput.data is undefined (no form value). If the dialog has `footer: []`
 * (no buttons), neither signal is ever read — the user closes via the header close button.
 */
export interface DialogContent<T> {
    /** Whether the form content is in a valid state. Drives affirm button disabled. */
    readonly isValid: Signal<boolean>;

    /** Current value of the form content. Included in DialogOutput.data on affirm. */
    readonly value: Signal<T>;
}
