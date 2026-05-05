import { type Signal, Type } from '@angular/core';
import { type TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
import { TbxMatDialogDismissReason } from '../types/dialog-result.type';
import { type TbxMatDialogFooterControlType } from '../types/dialog-footer-control.type';

/**
 * Typed output returned when a dialog closes.
 *
 * @typeParam T - Type of data returned by input dialogs (from TbxMatDialogData<T>.value).
 *               Defaults to `void` for informational and confirmation dialogs.
 * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
 *               Callers that need typed footer values specify an interface as the
 *               second generic parameter.
 *
 * Usage:
 * ```typescript
 * // Simple confirmation — both generics use defaults
 * const output: TbxMatDialogResult = await dialog.confirm({ ... });
 *
 * // Input dialog with typed data
 * const output: TbxMatDialogResult<string> = await dialog.input<string>({ ... });
 *
 * // Confirmation with typed footer values
 * interface MyFooter { dontAskAgain: boolean; }
 * const output: TbxMatDialogResult<void, MyFooter> = await dialog.confirm<MyFooter>({ ... });
 * ```
 */
export interface TbxMatDialogResult<
    T = void,
    F extends Record<string, unknown> = Record<string, unknown>,
> {
    /** Which action closed the dialog. */
    readonly result: TbxMatDialogDismissReason;

    /** Data from input dialog content component. Undefined for non-input dialogs or Cancel/Close. */
    readonly data?: T;

    /** Values from footer controls, keyed by TbxMatDialogFooterControlType.key. */
    readonly footerValues: F;
}

/**
 * Configuration for opening a dialog via TbxMatDialogService.
 *
 * @typeParam T - Type of data for input dialogs. Defaults to `void`.
 * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
 */
export interface TbxMatDialogConfig<T = void> {
    /** Dialog title displayed in the header. Required. */
    readonly title: string;

    /** Material icon name displayed before the title. Colored by severity type. */
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

    /**
     * Severity level — determines accent color for icon, buttons, separators, and
     * the per-severity panel class applied to the dialog overlay. Mirrors the
     * `type` field on `TbxMatBannerConfig` and `TbxMatNotificationConfig`.
     */
    readonly type?: TbxMatSeverityLevel;

    /**
     * Component class to render in the dialog body for input dialogs.
     * Must implement TbxMatDialogData<T>.
     * When provided, `message` is ignored.
     */
    readonly content?: Type<TbxMatDialogData<T>>;

    /**
     * Footer items — buttons and controls rendered in a single flex row.
     * Items render in array order. First `align: 'end'` item gets `margin-left: auto`.
     * When omitted, TbxMatDialogService applies a default button preset based on the dialog type.
     */
    readonly footer?: readonly TbxMatDialogFooterControlType[];

    /** Dialog width. Defaults to TBX_MAT_DIALOG_DEFAULT_WIDTH. */
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
 * and reads `value` to include in TbxMatDialogResult.data when the user confirms.
 *
 * Content components own their own form layout, validation, and state.
 * The dialog system never inspects the content — it only reads these two signals.
 *
 * @typeParam T - Type of value produced by the form content.
 *
 * ## Input dialogs (form content)
 *
 * ```typescript
 * @Component({
 *     imports: [MatFormFieldModule, MatInputModule],
 *     template: `
 *         <mat-form-field>
 *             <input matInput cdkFocusInitial [ngModel]="name()" (ngModelChange)="name.set($event)" />
 *         </mat-form-field>
 *     `,
 * })
 * export class RenameFormComponent implements TbxMatDialogData<string> {
 *     readonly name = signal('');
 *     readonly isValid = computed(() => this.name().trim().length > 0);
 *     readonly value = this.name;
 * }
 * ```
 *
 * ## Focus management
 *
 * The dialog uses `autoFocus: 'first-tabbable'` (Material default). For
 * input dialogs, the first tabbable element in DOM order is typically the
 * header close button — not the first form field. Content components should
 * apply the `cdkFocusInitial` attribute to the element that should receive
 * initial focus. This is a plain HTML attribute recognized by the CDK focus
 * trap — no directive import needed.
 *
 * ## Non-input components (display-only content)
 *
 * Components that display content without producing a form value use
 * the null object pattern — `isValid` is always true (nothing to validate),
 * `value` is always undefined (nothing to extract):
 *
 * ```typescript
 * @Component({ ... })
 * export class UserSettingsComponent implements TbxMatDialogData<void> {
 *     readonly isValid = signal(true);
 *     readonly value = signal<void>(undefined);
 * }
 * ```
 *
 * This allows any component to be hosted in a dialog via `TbxMatDialogService.show()`
 * without type casts. The shell's affirm button is never disabled (isValid is true),
 * and TbxMatDialogResult.data is undefined (no form value). If the dialog has `footer: []`
 * (no buttons), neither signal is ever read — the user closes via the header close button.
 */
export interface TbxMatDialogData<T> {
    /** Whether the form content is in a valid state. Drives affirm button disabled. */
    readonly isValid: Signal<boolean>;

    /** Current value of the form content. Included in TbxMatDialogResult.data on affirm. */
    readonly value: Signal<T>;
}
