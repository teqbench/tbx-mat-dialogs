import { Injectable } from '@angular/core';
import { TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS, TbxMatSeveritySvgIconService, TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';

/**
 * Resolve severity levels to SVG dialog icons
 *
 * @remarks
 * Default SVG-based severity dialog icon service. Extends `TbxMatSeveritySvgIconService`
 * from `@teqbench/tbx-mat-severity-theme` and registers the shared default SVG icons
 * (`TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS`) for every severity level. The inherited
 * `resolve()` and severity methods (`default()`, `success()`, `error()`, etc.) work via
 * the registered mappings.
 *
 * No provider is registered automatically — instantiate explicitly via the
 * {@link TBX_MAT_DIALOG_PROVIDER_CONFIG} factory.
 *
 * Default icons ship with `@teqbench/tbx-mat-severity-theme`. Subclasses can override any
 * default by overriding `initialize()` and calling `register()` with the same key and
 * different SVG markup.
 *
 * @usage
 * Provide as `severityIconResolverService` on {@link TbxMatDialogProviderConfig} when SVG
 * icons are preferred over font ligatures. Subclass to override individual icons.
 *
 * @example
 * ```typescript
 * // app.config.ts — using the defaults directly.
 * import { TBX_MAT_DIALOG_PROVIDER_CONFIG, TbxMatDialogSeveritySvgIconService }
 *     from '@teqbench/tbx-mat-dialogs';
 *
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
 * @example
 * ```typescript
 * // Subclassing with custom SVG markup.
 * import { Injectable } from '@angular/core';
 * import { TbxMatDialogSeveritySvgIconService } from '@teqbench/tbx-mat-dialogs';
 * import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
 *
 * // MyDialogSvgIcons is a hypothetical consumer-defined subclass.
 * @Injectable()
 * export class MyDialogSvgIcons extends TbxMatDialogSeveritySvgIconService {
 *     protected override initialize(): void {
 *         super.initialize();
 *         this.register(TbxMatSeverityLevel.Success, '<svg>...</svg>');
 *     }
 * }
 * ```
 *
 * @category Services
 * @displayName Severity SVG Icon Service
 * @order 3
 * @since 0.1.0
 * @related TBX_MAT_DIALOG_PROVIDER_CONFIG
 * @related TbxMatDialogProviderConfig
 * @related TbxMatDialogSeverityFontIconService
 *
 * @public
 */
@Injectable()
export class TbxMatDialogSeveritySvgIconService extends TbxMatSeveritySvgIconService {
    /**
     * Register the shared default SVG icons for every severity level
     *
     * @remarks
     * Iterates `TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS` from `@teqbench/tbx-mat-severity-theme`,
     * registering each level's SVG markup. Subclasses can override any of these defaults
     * by calling `register()` with the same key and different SVG markup.
     *
     * @internal
     */
    protected override initialize(): void {
        super.initialize();
        for (const level of Object.values(TbxMatSeverityLevel)) {
            this.register(level, TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS[level]);
        }
    }
}
