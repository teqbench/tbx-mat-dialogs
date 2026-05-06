import { InjectionToken } from '@angular/core';
import type { TbxMatDialogProviderConfig } from '../models/dialog-provider-config.model';

/**
 * Injection token for dialog component icon configuration
 *
 * @remarks
 * Required. Provide in `app.config.ts` to configure the severity icon resolver service and
 * the close button icon. Use {@link TbxMatDialogSeverityFontIconService} for font icons or
 * {@link TbxMatDialogSeveritySvgIconService} for SVG icons — both ship with sensible
 * defaults from `@teqbench/tbx-mat-severity-theme`.
 *
 * No provider is registered automatically — without an explicit provider, the dialog
 * component will not render.
 *
 * @usage
 * Provide in `app.config.ts` with a {@link TbxMatDialogProviderConfig} factory.
 *
 * @example
 * ```typescript
 * // app.config.ts — font icons with explicit fontSet.
 * import { TBX_MAT_DIALOG_PROVIDER_CONFIG, TbxMatDialogSeverityFontIconService }
 *     from '@teqbench/tbx-mat-dialogs';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatDialogSeverityFontIconService('material-symbols-rounded'),
 *         }),
 *     },
 * ]
 * ```
 *
 * @example
 * ```typescript
 * // Font icons via MAT_ICON_DEFAULT_OPTIONS (no explicit fontSet).
 * import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
 * import { TBX_MAT_DIALOG_PROVIDER_CONFIG, TbxMatDialogSeverityFontIconService }
 *     from '@teqbench/tbx-mat-dialogs';
 *
 * providers: [
 *     { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } },
 *     {
 *         provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatDialogSeverityFontIconService(),
 *         }),
 *     },
 * ]
 * ```
 *
 * @example
 * ```typescript
 * // With a custom close icon resolver.
 * // MyCloseIconService is a hypothetical consumer-defined service that extends
 * // TbxMatFontIconService<string> or TbxMatSvgIconService<string> and registers
 * // an icon under the 'close' key.
 * providers: [
 *     {
 *         provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatDialogSeverityFontIconService('material-symbols-rounded'),
 *             closeIconResolverService: new MyCloseIconService('material-symbols-rounded'),
 *         }),
 *     },
 * ]
 * ```
 *
 * @category Tokens
 * @displayName Dialog Provider Config Token
 * @order 1
 * @since 0.1.0
 * @related TbxMatDialogProviderConfig
 * @related TbxMatDialogSeverityFontIconService
 * @related TbxMatDialogSeveritySvgIconService
 * @related TbxMatDialogCloseFontIconService
 *
 * @public
 */
export const TBX_MAT_DIALOG_PROVIDER_CONFIG = new InjectionToken<TbxMatDialogProviderConfig>(
    'TBX_MAT_DIALOG_PROVIDER_CONFIG'
);
