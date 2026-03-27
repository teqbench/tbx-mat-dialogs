import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { SeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
import { DIALOG_ICON_SERVICE } from '../tokens/dialog-icon-service.token';
import { DialogShellComponent, type DialogShellData } from '../components/dialog-shell.component';
import { DialogResultType } from '../types/dialog-result.type';
import { DialogEmphasisType } from '../types/dialog-emphasis.type';
import { type DialogConfig, type DialogOutput } from '../models/dialog.model';
import { type DialogFooterControlType } from '../types/dialog-footer-control.type';
import { type DialogConfigOverrideType } from '../types/dialog-config-override.type';
import {
    BUTTONS_OK,
    BUTTONS_OK_CANCEL,
    BUTTONS_YES_NO,
    DIALOG_DEFAULT_WIDTH,
} from '../constants/dialog.constants';

/**
 * Severity levels used by dialogs (excludes Success, which has no dialog method).
 *
 * Declared as an enum rather than `Exclude<SeverityLevelType, SeverityLevelType.Success>`
 * because a type alias has no runtime presence and cannot be used as computed
 * property keys or in other value positions. Initializing each member from
 * SeverityLevelType keeps the values in sync with the upstream enum.
 */
enum DialogSeverityLevelType {
    Information = SeverityLevelType.Information,
    Warning = SeverityLevelType.Warning,
    Error = SeverityLevelType.Error,
    Help = SeverityLevelType.Help,
}

/**
 * Application-wide dialog service.
 *
 * Provides six opinionated dialog methods with sensible defaults and a
 * general-purpose show() method for full control. All dialogs use the
 * shared DialogShellComponent for consistent chrome (header, body, footer).
 *
 * All methods return a Promise that resolves when the dialog closes,
 * so consumers use async/await with no subscription management.
 *
 * Icons are resolved via the injected DIALOG_ICON_SERVICE token, ensuring
 * dialogs use icons optimized for their visual context (filled variants
 * inside colored circle containers by default). Downstream apps swap the
 * icon set via { provide: DIALOG_ICON_SERVICE, useClass: ... } in app.config.ts.
 *
 * Opinionated methods — each provides defaults for icon, emphasis, and footer:
 *
 * ```typescript
 * private readonly dialog = inject(DialogService);
 *
 * // Simplest — just title and message, everything else defaulted
 * await this.dialog.info({ title: 'Session Expired', message: 'Please sign in again.' });
 *
 * // Override defaults selectively
 * await this.dialog.info({ title: 'Welcome', message: 'Ready.', icon: 'celebration' });
 *
 * // Warning dialog — amber emphasis, warning icon
 * await this.dialog.warning({ title: 'Caution', message: 'This may take a while.' });
 *
 * // Error dialog — destructive emphasis, error icon
 * await this.dialog.error({ title: 'Failed', message: 'Could not save changes.' });
 *
 * // Confirmation — default emphasis, help icon, Yes/No buttons
 * const output = await this.dialog.confirm({ title: 'Continue?', message: 'Proceed?' });
 * if (output.result === DialogResultType.Affirm) { ... }
 *
 * // Input — default emphasis, info icon, OK/Cancel buttons
 * const output = await this.dialog.input<string>({
 *     title: 'Rename',
 *     content: RenameFormComponent,
 * });
 *
 * // Typed footer values
 * interface MyFooter { dontAskAgain: boolean; }
 * const output = await this.dialog.confirm<MyFooter>({
 *     title: 'Delete',
 *     message: 'Are you sure?',
 *     footer: [
 *         { key: 'dontAskAgain', type: 'checkbox', label: "Don't ask again", align: 'start' },
 *         ...BUTTONS_YES_NO,
 *     ],
 * });
 * ```
 *
 * Full control — no defaults applied:
 *
 * ```typescript
 * const output = await this.dialog.show({
 *     title: 'Custom',
 *     icon: 'build',
 *     emphasis: DialogEmphasisType.Warning,
 *     message: 'Full control over every option.',
 *     footer: [...customFooter],
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
    private readonly dialog = inject(MatDialog);
    private readonly icons = inject(DIALOG_ICON_SERVICE, { optional: true });

    /** Hardcoded fallbacks when DIALOG_ICON_SERVICE is not provided. */
    private static readonly FALLBACK_ICONS: Record<DialogSeverityLevelType, string> = {
        [DialogSeverityLevelType.Information]: 'info_i',
        [DialogSeverityLevelType.Warning]: 'exclamation',
        [DialogSeverityLevelType.Error]: 'exclamation',
        [DialogSeverityLevelType.Help]: 'question_mark',
    };

    /**
     * Open a dialog with full control — no defaults applied.
     *
     * Use this when none of the opinionated methods fit, or when the caller
     * needs to specify every aspect of the dialog configuration. The config
     * is passed through to the shell component exactly as provided.
     *
     * @typeParam T - Type of data for input dialogs. Defaults to void.
     * @typeParam F - Type of footer control values. Defaults to Record<string, unknown>.
     */
    async show<T = void, F extends Record<string, unknown> = Record<string, unknown>>(
        config: DialogConfig<T>
    ): Promise<DialogOutput<T, F>> {
        return this.open<T, F>(config, config.footer ?? []);
    }

    /**
     * Open an informational dialog.
     *
     * Defaults: info icon, Informational emphasis, OK button.
     * All defaults can be overridden via config properties.
     *
     * @typeParam F - Type of footer control values. Defaults to Record<string, unknown>.
     */
    async information<F extends Record<string, unknown> = Record<string, unknown>>(
        config: DialogConfigOverrideType<void>
    ): Promise<DialogOutput<void, F>> {
        return this.open<void, F>(
            this.mergeDefaults(
                config,
                this.resolveIcon(DialogSeverityLevelType.Information),
                DialogEmphasisType.Informational
            ),
            config.footer ?? BUTTONS_OK
        );
    }

    /**
     * Open a warning dialog.
     *
     * Defaults: warning icon, Warning emphasis, OK button.
     * All defaults can be overridden via config properties.
     *
     * @typeParam F - Type of footer control values. Defaults to Record<string, unknown>.
     */
    async warning<F extends Record<string, unknown> = Record<string, unknown>>(
        config: DialogConfigOverrideType<void>
    ): Promise<DialogOutput<void, F>> {
        return this.open<void, F>(
            this.mergeDefaults(
                config,
                this.resolveIcon(DialogSeverityLevelType.Warning),
                DialogEmphasisType.Warning
            ),
            config.footer ?? BUTTONS_OK
        );
    }

    /**
     * Open an error dialog.
     *
     * Defaults: error icon, Destructive emphasis, OK button.
     * All defaults can be overridden via config properties.
     *
     * @typeParam F - Type of footer control values. Defaults to Record<string, unknown>.
     */
    async error<F extends Record<string, unknown> = Record<string, unknown>>(
        config: DialogConfigOverrideType<void>
    ): Promise<DialogOutput<void, F>> {
        return this.open<void, F>(
            this.mergeDefaults(
                config,
                this.resolveIcon(DialogSeverityLevelType.Error),
                DialogEmphasisType.Destructive
            ),
            config.footer ?? BUTTONS_OK
        );
    }

    /**
     * Open a confirmation dialog.
     *
     * Defaults: help icon, Default emphasis, Yes/No buttons.
     * All defaults can be overridden via config properties.
     *
     * @typeParam F - Type of footer control values. Defaults to Record<string, unknown>.
     */
    async confirm<F extends Record<string, unknown> = Record<string, unknown>>(
        config: DialogConfigOverrideType<void>
    ): Promise<DialogOutput<void, F>> {
        return this.open<void, F>(
            this.mergeDefaults(
                config,
                this.resolveIcon(DialogSeverityLevelType.Help),
                DialogEmphasisType.Default
            ),
            config.footer ?? BUTTONS_YES_NO
        );
    }

    /**
     * Open an input dialog.
     *
     * Renders a content component in the dialog body. The content component
     * must implement DialogContent<T>. Returns typed data on affirm.
     *
     * Defaults: info icon, Default emphasis, OK/Cancel buttons.
     * All defaults can be overridden via config properties.
     *
     * @typeParam T - Type of data returned by the content component.
     * @typeParam F - Type of footer control values. Defaults to Record<string, unknown>.
     */
    async input<T, F extends Record<string, unknown> = Record<string, unknown>>(
        config: DialogConfigOverrideType<T>
    ): Promise<DialogOutput<T, F>> {
        return this.open<T, F>(
            this.mergeDefaults(
                config,
                this.resolveIcon(DialogSeverityLevelType.Information),
                DialogEmphasisType.Default
            ),
            config.footer ?? BUTTONS_OK_CANCEL
        );
    }

    /**
     * Resolve an icon from the icon service with hardcoded fallback.
     * If the service is not provided or returns a falsy value, the fallback is used.
     */
    private resolveIcon(method: DialogSeverityLevelType): string {
        const fromService = this.icons?.[method]();
        return fromService || DialogService.FALLBACK_ICONS[method];
    }

    /**
     * Merge caller overrides with method defaults.
     *
     * Caller-provided values win — defaults are only applied for fields
     * the caller did not specify (undefined). This means passing
     * `{ icon: 'custom_icon' }` overrides the default icon, but omitting
     * `icon` uses the default.
     */
    private mergeDefaults<T>(
        config: DialogConfigOverrideType<T>,
        defaultIcon: string,
        defaultEmphasis: DialogEmphasisType
    ): DialogConfig<T> {
        return {
            ...config,
            icon: config.icon ?? defaultIcon,
            emphasis: config.emphasis ?? defaultEmphasis,
        } as DialogConfig<T>;
    }

    /**
     * Internal: open the dialog shell with resolved config.
     *
     * Applies default width when not specified. Wires disableClose.
     * Returns a Promise that resolves with the dialog output, or a
     * fallback Close result if the dialog is dismissed without a result
     * (e.g., backdrop click when disableClose is false).
     */
    private async open<T, F extends Record<string, unknown>>(
        config: DialogConfig<T>,
        resolvedFooter: readonly DialogFooterControlType[]
    ): Promise<DialogOutput<T, F>> {
        const shellData: DialogShellData = {
            config: config as DialogConfig<unknown>,
            resolvedFooter,
        };

        const dialogRef = this.dialog.open(DialogShellComponent, {
            data: shellData,
            width: config.width ?? DIALOG_DEFAULT_WIDTH,
            minWidth: config.minWidth,
            maxWidth: config.maxWidth,
            minHeight: config.minHeight,
            maxHeight: config.maxHeight,
            disableClose: config.disableClose ?? false,
            panelClass: 'tbx-dialog-panel',
            autoFocus: 'dialog',
        });

        const output = await firstValueFrom(dialogRef.afterClosed());

        // When dialog is dismissed via backdrop/Escape without a button click,
        // afterClosed() emits undefined. Return a Close result with empty footer values.
        if (!output) {
            return {
                result: DialogResultType.Close,
                footerValues: {} as F,
            };
        }

        return output as DialogOutput<T, F>;
    }
}
