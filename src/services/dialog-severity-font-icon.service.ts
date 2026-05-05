import { Injectable } from '@angular/core';
import {
    TBX_MAT_SEVERITY_DEFAULT_FONT_LIGATURES,
    TbxMatSeverityFontIconService,
    TbxMatSeverityLevel,
} from '@teqbench/tbx-mat-severity-theme';

/**
 * Default font-based severity dialog icon service.
 *
 * Extends `TbxMatSeverityFontIconService` from
 * `@teqbench/tbx-mat-severity-theme` and registers the shared default
 * Material Symbols ligatures (`TBX_MAT_SEVERITY_DEFAULT_FONT_LIGATURES`)
 * for every severity level. The inherited `resolve()` and severity
 * methods (`default()`, `success()`, `error()`, etc.) work via the
 * registered mappings.
 *
 * #### fontSet resolution
 *
 * The fontSet is resolved by `TbxMatFontIconService`'s fallback chain:
 *
 * 1. **Explicit constructor argument** — `new TbxMatDialogSeverityFontIconService('material-symbols-sharp')`
 * 2. **`TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token** — set once in `app.config.ts`
 * 3. **`MAT_ICON_DEFAULT_OPTIONS.fontSet`** — Angular Material's global icon default
 * 4. **Error** — if none of the above provides a fontSet
 *
 * @example Using with MAT_ICON_DEFAULT_OPTIONS:
 * ```typescript
 * // app.config.ts
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
 * @example Using with an explicit fontSet:
 * ```typescript
 * providers: [
 *     {
 *         provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatDialogSeverityFontIconService('material-symbols-rounded'),
 *         }),
 *     },
 * ]
 * ```
 */
@Injectable()
export class TbxMatDialogSeverityFontIconService extends TbxMatSeverityFontIconService {
    /**
     * @param fontSet - Optional fontSet identifier (e.g., `'material-symbols-rounded'`).
     *                  When provided, takes precedence over all global defaults.
     */
    constructor(fontSet?: string) {
        super(fontSet);
    }

    /**
     * Register the shared default Material Symbols ligatures for every
     * severity level.
     *
     * Iterates `TBX_MAT_SEVERITY_DEFAULT_FONT_LIGATURES` from
     * `@teqbench/tbx-mat-severity-theme`, registering each level's
     * ligature. These work with any Material Symbols font variant
     * (outlined, rounded, sharp) since the ligature names are
     * consistent across variants. Subclasses can override any of these
     * defaults by calling `register()` with the same key and a
     * different ligature.
     */
    protected override initialize(): void {
        super.initialize();
        for (const level of Object.values(TbxMatSeverityLevel)) {
            this.register(level, TBX_MAT_SEVERITY_DEFAULT_FONT_LIGATURES[level]);
        }
    }
}
