import { type Signal, Type } from '@angular/core';
import { type TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
import { TbxMatDialogDismissReason } from '../enums/dialog-dismiss-reason.enum';
import { type TbxMatDialogFooterControlType } from '../types/dialog-footer-control.type';

/**
 * Configuration for opening a dialog via {@link TbxMatDialogService}
 *
 * @remarks
 * The full configuration shape used by {@link TbxMatDialogService}.show(). The opinionated
 * methods (`success()`, `error()`, etc.) accept {@link TbxMatDialogConfigArgs} instead,
 * which makes every field except `title` optional.
 *
 * Sizing fields (`width`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`) pass through to
 * {@link https://material.angular.dev/components/dialog/api | Angular Material's MatDialogConfig}.
 *
 * @typeParam T - Type of data for input dialogs (the value produced by the projected content
 *   component implementing {@link TbxMatDialogData}). Defaults to `void`.
 *
 * @usage
 * Used when calling {@link TbxMatDialogService}.show() for full control over every option.
 * Most callers should use the opinionated methods, which apply sensible defaults.
 *
 * @example
 * ```typescript
 * import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
 *
 * const config: TbxMatDialogConfig = {
 *     title: 'Custom Dialog',
 *     icon: 'build',
 *     type: TbxMatSeverityLevel.Warning,
 *     subtitle: 'Optional secondary line',
 *     contextBadge: 'Beta',
 *     message: 'Full control over every option.',
 *     footer: [
 *         { key: 'cancel', type: 'button', label: 'Cancel', result: TbxMatDialogDismissReason.Cancel, align: 'end' },
 *         { key: 'proceed', type: 'button', label: 'Proceed', emphasis: 'primary', result: TbxMatDialogDismissReason.Affirm, align: 'end' },
 *     ],
 * };
 * ```
 *
 * @category Models
 * @displayName Dialog Config
 * @order 1
 * @since 0.1.0
 * @related TbxMatDialogService
 * @related TbxMatDialogConfigArgs
 * @related TbxMatDialogResult
 *
 * @public
 */
export interface TbxMatDialogConfig<T = void> {
    /**
     * Dialog title displayed in the header. Required.
     *
     * @order 1
     *
     * @public
     */
    readonly title: string;

    /**
     * {@link https://fonts.google.com/icons | Material Symbols} icon name displayed before
     * the title
     *
     * @remarks
     * When provided, takes precedence over the icon resolved from `type` via the configured
     * severity icon resolver. Always rendered as a font ligature.
     *
     * @order 2
     *
     * @public
     */
    readonly icon?: string;

    /**
     * Secondary text displayed below the title
     *
     * @order 3
     *
     * @public
     */
    readonly subtitle?: string;

    /**
     * Short badge text displayed next to the title
     *
     * @remarks
     * Rendered as a compact chip (e.g., "Beta", "v2", "Required").
     *
     * @order 4
     *
     * @public
     */
    readonly contextBadge?: string;

    /**
     * Message text displayed in the dialog body
     *
     * @remarks
     * Ignored when `content` is provided.
     *
     * @order 5
     *
     * @public
     */
    readonly message?: string;

    /**
     * Severity level — determines accent color for icon, buttons, separators, and the
     * per-severity panel class applied to the dialog overlay
     *
     * @remarks
     * Mirrors the `type` field on `TbxMatBannerConfig` and `TbxMatNotificationConfig`.
     *
     * @order 6
     *
     * @public
     */
    readonly type?: TbxMatSeverityLevel;

    /**
     * Component class to render in the dialog body for input dialogs
     *
     * @remarks
     * Must implement {@link TbxMatDialogData}. When provided, `message` is ignored.
     *
     * @order 7
     *
     * @public
     */
    readonly content?: Type<TbxMatDialogData<T>>;

    /**
     * Footer items — buttons and form controls rendered in a single flex row
     *
     * @remarks
     * Items render in array order. The first `align: 'end'` item gets `margin-left: auto`,
     * pushing it and all subsequent items to the right side. When omitted,
     * {@link TbxMatDialogService} applies a default button preset based on the dialog method.
     *
     * @order 8
     *
     * @public
     */
    readonly footer?: readonly TbxMatDialogFooterControlType[];

    /**
     * Dialog width. Defaults to {@link TBX_MAT_DIALOG_DEFAULT_WIDTH}.
     *
     * @order 9
     *
     * @public
     */
    readonly width?: string;

    /**
     * Minimum width constraint. Mapped directly to
     * {@link https://material.angular.dev/components/dialog/api | MatDialogConfig}.minWidth.
     *
     * @order 10
     *
     * @public
     */
    readonly minWidth?: string;

    /**
     * Maximum width constraint. Mapped directly to
     * {@link https://material.angular.dev/components/dialog/api | MatDialogConfig}.maxWidth.
     *
     * @order 11
     *
     * @public
     */
    readonly maxWidth?: string;

    /**
     * Minimum height constraint. Mapped directly to
     * {@link https://material.angular.dev/components/dialog/api | MatDialogConfig}.minHeight.
     *
     * @order 12
     *
     * @public
     */
    readonly minHeight?: string;

    /**
     * Maximum height constraint. Mapped directly to
     * {@link https://material.angular.dev/components/dialog/api | MatDialogConfig}.maxHeight.
     *
     * @order 13
     *
     * @public
     */
    readonly maxHeight?: string;

    /**
     * When `true`, prevents closing via Escape key or backdrop click
     *
     * @remarks
     * The user must interact with a footer button to close. Defaults to `false`.
     *
     * @order 14
     *
     * @public
     */
    readonly disableClose?: boolean;
}

/**
 * Typed output returned when a dialog closes
 *
 * @remarks
 * Resolved by every {@link TbxMatDialogService} method. Carries the user's action
 * ({@link TbxMatDialogDismissReason}), any data produced by an input dialog's projected
 * content component, and any values collected from footer form controls.
 *
 * On any non-Affirm dismissal (Deny, Cancel, Close, Escape, backdrop), `data` is `undefined`
 * and `footerValues` is an empty object — negative actions never carry state that implies
 * confirmation.
 *
 * @typeParam T - Type of data returned by input dialogs (from {@link TbxMatDialogData}.value).
 *   Defaults to `void` for informational and confirmation dialogs.
 * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
 *   Callers that need typed footer values specify an interface as the second generic
 *   parameter.
 *
 * @usage
 * The return shape of every {@link TbxMatDialogService} method. `await` a dialog call and
 * branch on `result` to handle the user's action.
 *
 * @example
 * ```typescript
 * // Simple confirmation — both generics use defaults.
 * const output: TbxMatDialogResult = await dialog.confirm({ title: 'Continue?' });
 *
 * // Input dialog with typed data.
 * const output: TbxMatDialogResult<string> = await dialog.input<string>({
 *     title: 'Rename',
 *     content: RenameFormComponent, // hypothetical consumer-defined component
 * });
 *
 * // Confirmation with typed footer values.
 * interface MyFooter { dontAskAgain: boolean; }
 * const output: TbxMatDialogResult<void, MyFooter> = await dialog.confirm<MyFooter>({
 *     title: 'Delete?',
 * });
 * ```
 *
 * @category Models
 * @displayName Dialog Result
 * @order 2
 * @since 0.1.0
 * @related TbxMatDialogService
 * @related TbxMatDialogDismissReason
 *
 * @public
 */
export interface TbxMatDialogResult<T = void, F extends Record<string, unknown> = Record<string, unknown>> {
    /**
     * Which action closed the dialog
     *
     * @order 1
     *
     * @public
     */
    readonly result: TbxMatDialogDismissReason;

    /**
     * Data from the projected input dialog content component
     *
     * @remarks
     * `undefined` for non-input dialogs and for non-Affirm dismissals.
     *
     * @order 2
     *
     * @public
     */
    readonly data?: T;

    /**
     * Values from footer controls, keyed by control `key`
     *
     * @remarks
     * Empty object on Cancel / Deny / Close.
     *
     * @order 3
     *
     * @public
     */
    readonly footerValues: F;
}

/**
 * Contract for components rendered in dialog bodies
 *
 * @remarks
 * The dialog shell reads `isValid` to drive the affirm button's disabled state and reads
 * `value` to include in {@link TbxMatDialogResult}.data when the user confirms. Content
 * components own their own form layout, validation, and state — the dialog system never
 * inspects the content beyond these two signals.
 *
 * #### Focus management
 *
 * For input dialogs, the dialog service sets `autoFocus: 'first-tabbable'` so the
 * consumer's `cdkFocusInitial` attribute on a form field inside the projected content
 * component takes precedence. Content components should apply `cdkFocusInitial` to the
 * element that should receive initial focus. This is a plain HTML attribute recognized
 * by the {@link https://material.angular.dev/cdk/a11y/api#FocusTrap | Angular CDK FocusTrap} —
 * no directive import needed. Without it, focus would fall through to the first tabbable
 * element in DOM order (typically the header close button), so applying it on the
 * intended target is required for correct UX.
 *
 * #### Non-input components (display-only content)
 *
 * Components that display content without producing a form value use the null object
 * pattern — `isValid` is always `true` (nothing to validate), `value` is always `undefined`
 * (nothing to extract). This allows any component to be hosted via
 * {@link TbxMatDialogService}.show() without type casts.
 *
 * @typeParam T - Type of value produced by the form content.
 *
 * @usage
 * Implement on consumer-defined components passed to {@link TbxMatDialogService}.input()
 * or {@link TbxMatDialogService}.show() via {@link TbxMatDialogConfig}.content.
 *
 * @example
 * ```typescript
 * // Input dialog form content.
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
 *
 * // Display-only content — null object pattern.
 * @Component({ ... })
 * export class UserSettingsComponent implements TbxMatDialogData<void> {
 *     readonly isValid = signal(true);
 *     readonly value = signal<void>(undefined);
 * }
 * ```
 *
 * @category Models
 * @displayName Dialog Data
 * @order 3
 * @since 0.1.0
 * @related TbxMatDialogService
 * @related TbxMatDialogConfig
 * @related TbxMatDialogResult
 *
 * @public
 */
export interface TbxMatDialogData<T> {
    /**
     * Whether the form content is in a valid state
     *
     * @remarks
     * Drives the affirm button's disabled state.
     *
     * @order 1
     *
     * @public
     */
    readonly isValid: Signal<boolean>;

    /**
     * Current value of the form content
     *
     * @remarks
     * Included in {@link TbxMatDialogResult}.data on Affirm.
     *
     * @order 2
     *
     * @public
     */
    readonly value: Signal<T>;
}
