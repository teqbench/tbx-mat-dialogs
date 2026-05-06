import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
import { DialogShellComponent, type DialogShellData } from '../components/dialog-shell.component';
import { TbxMatDialogDismissReason } from '../types/dialog-result.type';
import { type TbxMatDialogConfig, type TbxMatDialogResult } from '../models/dialog.model';
import { type TbxMatDialogFooterControlType } from '../types/dialog-footer-control.type';
import { type TbxMatDialogConfigArgs } from '../types/dialog-config-override.type';
import { TBX_MAT_DIALOG_BUTTONS_OK, TBX_MAT_DIALOG_BUTTONS_OK_CANCEL, TBX_MAT_DIALOG_BUTTONS_YES_NO, TBX_MAT_DIALOG_DEFAULT_WIDTH } from '../constants/dialog.constants';

/**
 * Open a typed modal dialog and await the user's choice
 *
 * @remarks
 * Application-wide dialog service built on
 * {@link https://material.angular.dev/components/dialog/api | Angular Material's MatDialog}.
 * Provides nine opinionated dialog methods with sensible defaults and a general-purpose
 * `show()` method for full control. All dialogs use the shared internal shell component
 * for consistent chrome (header, body, footer).
 *
 * Severity-leveled methods (`success`, `error`, `warning`, `information`, `help`,
 * `default`) mirror the surface exposed by `TbxMatBannerService` and
 * `TbxMatNotificationService`. Dialog-specific patterns (`confirm`, `input`) layer on top
 * of the severity model with their own default footer presets.
 *
 * All methods return a Promise that resolves when the dialog closes, so consumers use
 * `async`/`await` with no subscription management.
 *
 * Icons are resolved at render time by the dialog shell via the required
 * {@link TBX_MAT_DIALOG_PROVIDER_CONFIG} injection token. Consumers configure the severity
 * icon resolver (font or SVG) and an optional close icon resolver in `app.config.ts`; see
 * {@link TbxMatDialogProviderConfig} for the full shape. Per-call
 * {@link TbxMatDialogConfig}.icon overrides take precedence over the resolved severity
 * icon and are rendered as font ligatures.
 *
 * #### Error handling
 *
 * When the dialog is dismissed via backdrop click or Escape without a button click, the
 * underlying `afterClosed()` emits `undefined`. The service catches this case and returns
 * a {@link TbxMatDialogDismissReason}.Close result with an empty `footerValues` record —
 * dismissal is a negative action like Cancel or Deny and never carries form state.
 *
 * @usage
 * Inject in any component or service that needs to prompt the user. Prefer the opinionated
 * methods over `show()` so severity, icon, and footer defaults stay consistent across the
 * application.
 *
 * @example
 * ```typescript
 * private readonly dialog = inject(TbxMatDialogService);
 *
 * // Severity methods (mirror banners/notifications).
 * await this.dialog.success({ title: 'Saved', message: 'Your changes are saved.' });
 * await this.dialog.error({ title: 'Failed', message: 'Could not save changes.' });
 * await this.dialog.warning({ title: 'Caution', message: 'This may take a while.' });
 * await this.dialog.information({ title: 'FYI', message: 'Heads up.' });
 * await this.dialog.help({ title: 'How it works', message: 'Tap to learn more.' });
 * await this.dialog.default({ title: 'Notice', message: 'Neutral surface.' });
 *
 * // Confirmation — Help severity, Yes/No buttons.
 * const output = await this.dialog.confirm({ title: 'Continue?', message: 'Proceed?' });
 * if (output.result === TbxMatDialogDismissReason.Affirm) {
 *     // proceed
 * }
 *
 * // Input — Information severity, OK/Cancel buttons.
 * // RenameFormComponent is a hypothetical consumer-defined component that
 * // implements TbxMatDialogData<string>.
 * const output = await this.dialog.input<string>({
 *     title: 'Rename',
 *     content: RenameFormComponent,
 * });
 *
 * // Typed footer values.
 * interface MyFooter { dontAskAgain: boolean; }
 * const output = await this.dialog.confirm<MyFooter>({
 *     title: 'Delete',
 *     message: 'Are you sure?',
 *     footer: [
 *         { key: 'dontAskAgain', type: 'checkbox', label: "Don't ask again", align: 'start' },
 *         ...TBX_MAT_DIALOG_BUTTONS_YES_NO,
 *     ],
 * });
 *
 * // Full control — no defaults applied.
 * const output = await this.dialog.show({
 *     title: 'Custom',
 *     icon: 'build',
 *     type: TbxMatSeverityLevel.Warning,
 *     message: 'Full control over every option.',
 *     footer: [...customFooter],
 * });
 * ```
 *
 * @see {@link https://angular.dev | Angular}
 * @see {@link https://material.angular.dev/components/dialog/api | Angular Material MatDialog}
 *
 * @category Services
 * @displayName Dialog Service
 * @order 1
 * @since 0.1.0
 * @related TbxMatDialogConfig
 * @related TbxMatDialogConfigArgs
 * @related TbxMatDialogResult
 * @related TbxMatDialogDismissReason
 * @related TBX_MAT_DIALOG_PROVIDER_CONFIG
 *
 * @public
 */
@Injectable({ providedIn: 'root' })
export class TbxMatDialogService {
    private readonly dialog = inject(MatDialog);

    /**
     * Open a dialog with full control — no defaults applied
     *
     * @remarks
     * Use this when none of the opinionated methods fit, or when the caller needs to
     * specify every aspect of the dialog configuration. The config is passed through to
     * the shell component exactly as provided.
     *
     * @typeParam T - Type of data for input dialogs. Defaults to `void`.
     * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
     *
     * @param config - Full {@link TbxMatDialogConfig} for the dialog.
     * @returns A Promise that resolves with the typed {@link TbxMatDialogResult} when the
     *   dialog closes.
     *
     * @public
     */
    async show<T = void, F extends Record<string, unknown> = Record<string, unknown>>(config: TbxMatDialogConfig<T>): Promise<TbxMatDialogResult<T, F>> {
        return this.open<T, F>(config, config.footer ?? []);
    }

    /**
     * Open a success dialog
     *
     * @remarks
     * Defaults: success icon, Success severity, OK button.
     *
     * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
     *
     * @param config - Caller config; merged with the method's defaults.
     * @returns A Promise that resolves with the {@link TbxMatDialogResult} when the dialog
     *   closes.
     *
     * @public
     */
    async success<F extends Record<string, unknown> = Record<string, unknown>>(config: TbxMatDialogConfigArgs<void>): Promise<TbxMatDialogResult<void, F>> {
        return this.open<void, F>(this.mergeDefaults(config, TbxMatSeverityLevel.Success), config.footer ?? TBX_MAT_DIALOG_BUTTONS_OK);
    }

    /**
     * Open an error dialog
     *
     * @remarks
     * Defaults: error icon, Error severity, OK button.
     *
     * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
     *
     * @param config - Caller config; merged with the method's defaults.
     * @returns A Promise that resolves with the {@link TbxMatDialogResult} when the dialog
     *   closes.
     *
     * @public
     */
    async error<F extends Record<string, unknown> = Record<string, unknown>>(config: TbxMatDialogConfigArgs<void>): Promise<TbxMatDialogResult<void, F>> {
        return this.open<void, F>(this.mergeDefaults(config, TbxMatSeverityLevel.Error), config.footer ?? TBX_MAT_DIALOG_BUTTONS_OK);
    }

    /**
     * Open a warning dialog
     *
     * @remarks
     * Defaults: warning icon, Warning severity, OK button.
     *
     * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
     *
     * @param config - Caller config; merged with the method's defaults.
     * @returns A Promise that resolves with the {@link TbxMatDialogResult} when the dialog
     *   closes.
     *
     * @public
     */
    async warning<F extends Record<string, unknown> = Record<string, unknown>>(config: TbxMatDialogConfigArgs<void>): Promise<TbxMatDialogResult<void, F>> {
        return this.open<void, F>(this.mergeDefaults(config, TbxMatSeverityLevel.Warning), config.footer ?? TBX_MAT_DIALOG_BUTTONS_OK);
    }

    /**
     * Open an informational dialog
     *
     * @remarks
     * Defaults: info icon, Information severity, OK button.
     *
     * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
     *
     * @param config - Caller config; merged with the method's defaults.
     * @returns A Promise that resolves with the {@link TbxMatDialogResult} when the dialog
     *   closes.
     *
     * @public
     */
    async information<F extends Record<string, unknown> = Record<string, unknown>>(config: TbxMatDialogConfigArgs<void>): Promise<TbxMatDialogResult<void, F>> {
        return this.open<void, F>(this.mergeDefaults(config, TbxMatSeverityLevel.Information), config.footer ?? TBX_MAT_DIALOG_BUTTONS_OK);
    }

    /**
     * Open a help dialog
     *
     * @remarks
     * Defaults: help icon, Help severity, OK button.
     *
     * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
     *
     * @param config - Caller config; merged with the method's defaults.
     * @returns A Promise that resolves with the {@link TbxMatDialogResult} when the dialog
     *   closes.
     *
     * @public
     */
    async help<F extends Record<string, unknown> = Record<string, unknown>>(config: TbxMatDialogConfigArgs<void>): Promise<TbxMatDialogResult<void, F>> {
        return this.open<void, F>(this.mergeDefaults(config, TbxMatSeverityLevel.Help), config.footer ?? TBX_MAT_DIALOG_BUTTONS_OK);
    }

    /**
     * Open a default-severity (neutral) dialog
     *
     * @remarks
     * Defaults: default icon, Default severity, OK button.
     *
     * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
     *
     * @param config - Caller config; merged with the method's defaults.
     * @returns A Promise that resolves with the {@link TbxMatDialogResult} when the dialog
     *   closes.
     *
     * @public
     */
    async default<F extends Record<string, unknown> = Record<string, unknown>>(config: TbxMatDialogConfigArgs<void>): Promise<TbxMatDialogResult<void, F>> {
        return this.open<void, F>(this.mergeDefaults(config, TbxMatSeverityLevel.Default), config.footer ?? TBX_MAT_DIALOG_BUTTONS_OK);
    }

    /**
     * Open a confirmation dialog
     *
     * @remarks
     * Dialog-specific UX pattern layered on top of the severity model. Defaults: help
     * icon, Help severity, Yes/No buttons.
     *
     * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
     *
     * @param config - Caller config; merged with the method's defaults.
     * @returns A Promise that resolves with the {@link TbxMatDialogResult} when the dialog
     *   closes.
     *
     * @public
     */
    async confirm<F extends Record<string, unknown> = Record<string, unknown>>(config: TbxMatDialogConfigArgs<void>): Promise<TbxMatDialogResult<void, F>> {
        return this.open<void, F>(this.mergeDefaults(config, TbxMatSeverityLevel.Help), config.footer ?? TBX_MAT_DIALOG_BUTTONS_YES_NO);
    }

    /**
     * Open an input dialog
     *
     * @remarks
     * Renders a content component in the dialog body. The content component must implement
     * {@link TbxMatDialogData}. Returns typed data on Affirm.
     *
     * Dialog-specific UX pattern layered on top of the severity model. Defaults: info icon,
     * Information severity, OK/Cancel buttons.
     *
     * @typeParam T - Type of data returned by the content component.
     * @typeParam F - Type of footer control values. Defaults to `Record<string, unknown>`.
     *
     * @param config - Caller config; merged with the method's defaults.
     * @returns A Promise that resolves with the {@link TbxMatDialogResult} when the dialog
     *   closes.
     *
     * @public
     */
    async input<T, F extends Record<string, unknown> = Record<string, unknown>>(config: TbxMatDialogConfigArgs<T>): Promise<TbxMatDialogResult<T, F>> {
        return this.open<T, F>(this.mergeDefaults(config, TbxMatSeverityLevel.Information), config.footer ?? TBX_MAT_DIALOG_BUTTONS_OK_CANCEL);
    }

    /**
     * Merge caller overrides with method defaults
     *
     * @remarks
     * Sets `type` to the method's default severity when the caller did not specify one.
     * Icon resolution happens at render time in the dialog shell based on `config.type`
     * and the provider config — the service does not pre-compute icon strings. A
     * caller-provided `config.icon` is preserved as-is and rendered as a font ligature,
     * taking precedence over severity resolution.
     *
     * @internal
     */
    private mergeDefaults<T>(config: TbxMatDialogConfigArgs<T>, defaultType: TbxMatSeverityLevel): TbxMatDialogConfig<T> {
        return {
            ...config,
            type: config.type ?? defaultType,
        } as TbxMatDialogConfig<T>;
    }

    /**
     * Open the dialog shell with resolved config
     *
     * @remarks
     * Applies default width when not specified. Wires `disableClose`. Sets `ariaModal`
     * for screen reader modal semantics. Uses `'first-tabbable'` `autoFocus` (Material
     * default). Content components that need a specific element focused should apply
     * `cdkFocusInitial` to that element — the CDK focus trap honors it.
     *
     * Footer values and content data are only included in the output when the user
     * affirms. Deny, Cancel, Close, Escape, and backdrop dismiss all return empty
     * `footerValues` — negative actions never carry state that implies confirmation.
     *
     * The `panelClass` list includes the per-severity `tbx-mat-dialog-panel-{level}`
     * class consumed by the shared severity-theme SCSS mixin.
     *
     * Returns a Promise that resolves with the dialog output, or a fallback Close result
     * if the dialog is dismissed without a result (e.g., backdrop click when
     * `disableClose` is `false`).
     *
     * @internal
     */
    private async open<T, F extends Record<string, unknown>>(config: TbxMatDialogConfig<T>, resolvedFooter: readonly TbxMatDialogFooterControlType[]): Promise<TbxMatDialogResult<T, F>> {
        const shellData: DialogShellData = {
            config: config as TbxMatDialogConfig<unknown>,
            resolvedFooter,
        };

        const severity = config.type ?? TbxMatSeverityLevel.Default;

        const dialogRef = this.dialog.open(DialogShellComponent, {
            data: shellData,
            width: config.width ?? TBX_MAT_DIALOG_DEFAULT_WIDTH,
            minWidth: config.minWidth,
            maxWidth: config.maxWidth,
            minHeight: config.minHeight,
            maxHeight: config.maxHeight,
            disableClose: config.disableClose ?? false,
            panelClass: ['tbx-mat-dialog-panel', `tbx-mat-dialog-panel-${severity}`],
            autoFocus: 'first-tabbable',
            ariaModal: true,
        });

        const output = await firstValueFrom(dialogRef.afterClosed());

        // When dialog is dismissed via backdrop/Escape without a button click,
        // afterClosed() emits undefined. Return a Close result with empty footer values.
        if (!output) {
            return {
                result: TbxMatDialogDismissReason.Close,
                footerValues: {} as F,
            };
        }

        return output as TbxMatDialogResult<T, F>;
    }
}
