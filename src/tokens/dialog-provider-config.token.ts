import { InjectionToken } from '@angular/core';
import type { TbxMatDialogProviderConfig } from '../models/dialog-provider-config.model';

/**
 * Injection token for dialog component icon configuration.
 *
 * **Required.** Provide in `app.config.ts` to configure the severity icon
 * resolver service and the close button icon. Use
 * `TbxMatDialogSeverityFontIconService` for font icons or
 * `TbxMatDialogSeveritySvgIconService` for SVG icons — both ship with
 * sensible defaults from `@teqbench/tbx-mat-severity-theme`.
 *
 * @example Font icons with explicit fontSet:
 * ```typescript
 * // app.config.ts
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
 * @example Font icons via MAT_ICON_DEFAULT_OPTIONS (no explicit fontSet):
 * ```typescript
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
 * @example With a custom close icon resolver:
 * ```typescript
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
 */
export const TBX_MAT_DIALOG_PROVIDER_CONFIG = new InjectionToken<TbxMatDialogProviderConfig>(
    'TBX_MAT_DIALOG_PROVIDER_CONFIG'
);
