import { Injectable } from '@angular/core';
import { TbxMatFontIconService } from '@teqbench/tbx-mat-icons';

/**
 * Default font-based close button icon service.
 *
 * Extends `TbxMatFontIconService` from `@teqbench/tbx-mat-icons` and
 * registers the `'close'` Material Symbols ligature. Used as the
 * package-provided default for `TbxMatDialogProviderConfig.closeIconResolverService`
 * when the consumer does not supply a custom close icon resolver.
 *
 * No default SVG close icon service is provided. Consumers who want
 * SVG close icons must create a concrete subclass of
 * `TbxMatSvgIconService` from `@teqbench/tbx-mat-icons` and provide it
 * via `TbxMatDialogProviderConfig.closeIconResolverService`.
 *
 * #### fontSet resolution
 *
 * The fontSet is resolved by `TbxMatFontIconService`'s fallback chain:
 *
 * 1. **Explicit constructor argument** — `new TbxMatDialogCloseFontIconService('material-symbols-sharp')`
 * 2. **`TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token** — set once in `app.config.ts`
 * 3. **`MAT_ICON_DEFAULT_OPTIONS.fontSet`** — Angular Material's global icon default
 * 4. **Error** — if none of the above provides a fontSet
 */
@Injectable()
export class TbxMatDialogCloseFontIconService extends TbxMatFontIconService<string> {
    /**
     * @param fontSet - Optional fontSet identifier (e.g., `'material-symbols-rounded'`).
     *                  When provided, takes precedence over all global defaults.
     */
    constructor(fontSet?: string) {
        super(fontSet);
    }

    /**
     * Register the default close icon ligature.
     *
     * Registers the `'close'` Material Symbols ligature under the key
     * `'close'`. Subclasses can override by calling
     * `register('close', 'different_ligature')`.
     */
    protected override initialize(): void {
        super.initialize();
        this.register('close', 'close');
    }
}
