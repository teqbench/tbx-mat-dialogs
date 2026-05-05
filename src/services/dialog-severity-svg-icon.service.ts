import { Injectable } from '@angular/core';
import {
    TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS,
    TbxMatSeveritySvgIconService,
    TbxMatSeverityLevel,
} from '@teqbench/tbx-mat-severity-theme';

/**
 * Default SVG-based severity dialog icon service.
 *
 * Extends `TbxMatSeveritySvgIconService` from
 * `@teqbench/tbx-mat-severity-theme` and registers the shared default
 * SVG icons (`TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS`) for every severity
 * level. The inherited `resolve()` and severity methods (`default()`,
 * `success()`, `error()`, etc.) work via the registered mappings.
 *
 * Default icons ship with `@teqbench/tbx-mat-severity-theme`. Subclasses
 * can override any default by overriding `initialize()` and calling
 * `register()` with the same key and different SVG markup.
 *
 * @example Using the defaults directly:
 * ```typescript
 * // app.config.ts
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
 * @example Subclassing with custom SVG markup:
 * ```typescript
 * import { Injectable } from '@angular/core';
 * import { TbxMatDialogSeveritySvgIconService } from '@teqbench/tbx-mat-dialogs';
 * import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
 *
 * @Injectable()
 * export class MyDialogSvgIcons extends TbxMatDialogSeveritySvgIconService {
 *     protected override initialize(): void {
 *         super.initialize();
 *         this.register(TbxMatSeverityLevel.Success, '<svg>...</svg>');
 *     }
 * }
 * ```
 */
@Injectable()
export class TbxMatDialogSeveritySvgIconService extends TbxMatSeveritySvgIconService {
    /**
     * Register the shared default SVG icons for every severity level.
     *
     * Iterates `TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS` from
     * `@teqbench/tbx-mat-severity-theme`, registering each level's SVG
     * markup. Subclasses can override any of these defaults by calling
     * `register()` with the same key and different SVG markup.
     */
    protected override initialize(): void {
        super.initialize();
        for (const level of Object.values(TbxMatSeverityLevel)) {
            this.register(level, TBX_MAT_SEVERITY_DEFAULT_SVG_ICONS[level]);
        }
    }
}
