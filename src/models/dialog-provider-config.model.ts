import { type TbxMatIconResolver, type TbxMatIconType } from '@teqbench/tbx-mat-icons';
import type { TbxMatSeverityResolver, TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';

import { type TbxMatDialogIconResolver } from '../types/dialog-icon-resolver.type';

/**
 * Configuration for the dialog component's injectable dependencies.
 *
 * Provided via the `TBX_MAT_DIALOG_PROVIDER_CONFIG` injection token in
 * `app.config.ts`. Groups all dialog icon customization into a single
 * provider entry, matching the pattern used by `TbxMatBannerProviderConfig`
 * and `TbxMatNotificationProviderConfig`.
 *
 * #### Properties
 *
 * - **`severityIconResolverService`** — resolves severity levels to icon
 *   identifiers. Use `TbxMatDialogSeverityFontIconService` for font icons
 *   or `TbxMatDialogSeveritySvgIconService` for SVG icons.
 *
 * - **`closeIconResolverService`** (optional) — resolves the close button
 *   icon. When omitted, the package provides a default font-based
 *   resolver (`TbxMatDialogCloseFontIconService`) that registers the
 *   `'close'` Material Symbols ligature.
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
 * @example SVG icons:
 * ```typescript
 * providers: [
 *     {
 *         provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatDialogSeveritySvgIconService(),
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
export interface TbxMatDialogProviderConfig {
    /**
     * Severity icon resolver — maps severity levels to icon identifiers.
     */
    readonly severityIconResolverService: TbxMatSeverityResolver &
        TbxMatIconResolver<TbxMatSeverityLevel> & {
            readonly iconType: TbxMatIconType;
        };

    /**
     * Close button icon resolver — resolves the close/dismiss button icon.
     *
     * When omitted, the package provides a default font-based resolver
     * (`TbxMatDialogCloseFontIconService`) that registers the `'close'`
     * Material Symbols ligature. Consumers who want SVG close icons must
     * provide a custom resolver.
     */
    readonly closeIconResolverService?: TbxMatDialogIconResolver;
}
