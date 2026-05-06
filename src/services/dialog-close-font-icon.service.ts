import { Injectable } from '@angular/core';
import { TbxMatFontIconService } from '@teqbench/tbx-mat-icons';

/**
 * Resolve the dialog close button to a font-based icon
 *
 * @remarks
 * Default font-based close button icon service. Extends `TbxMatFontIconService` from
 * `@teqbench/tbx-mat-icons` and registers the `'close'`
 * {@link https://fonts.google.com/icons | Material Symbols} ligature. Used as the
 * package-provided fallback for {@link TbxMatDialogProviderConfig}.closeIconResolverService
 * when the consumer does not supply a custom close icon resolver.
 *
 * No provider is registered automatically — when omitted from
 * {@link TbxMatDialogProviderConfig}, the dialog shell instantiates this class with no
 * fontSet argument and relies on the inherited fallback chain.
 *
 * No default SVG close icon service is provided. Consumers who want SVG close icons must
 * create a concrete subclass of `TbxMatSvgIconService` from `@teqbench/tbx-mat-icons` and
 * provide it via {@link TbxMatDialogProviderConfig}.closeIconResolverService.
 *
 * #### fontSet resolution
 *
 * The fontSet is resolved by `TbxMatFontIconService`'s fallback chain:
 *
 * 1. Explicit constructor argument — `new TbxMatDialogCloseFontIconService('material-symbols-sharp')`.
 * 2. `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token — set once in `app.config.ts`.
 * 3. `MAT_ICON_DEFAULT_OPTIONS.fontSet` — {@link https://material.angular.dev | Angular Material}'s global icon default.
 * 4. Error — if none of the above provides a fontSet.
 *
 * @usage
 * Provide as `closeIconResolverService` on {@link TbxMatDialogProviderConfig} when an
 * explicit fontSet is required. Subclass to override the close ligature.
 *
 * @example
 * ```typescript
 * // app.config.ts — explicit close icon font.
 * import {
 *     TBX_MAT_DIALOG_PROVIDER_CONFIG,
 *     TbxMatDialogSeverityFontIconService,
 *     TbxMatDialogCloseFontIconService,
 * } from '@teqbench/tbx-mat-dialogs';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatDialogSeverityFontIconService('material-symbols-rounded'),
 *             closeIconResolverService: new TbxMatDialogCloseFontIconService('material-symbols-rounded'),
 *         }),
 *     },
 * ]
 * ```
 *
 * @category Services
 * @displayName Close Font Icon Service
 * @order 4
 * @since 0.1.0
 * @related TBX_MAT_DIALOG_PROVIDER_CONFIG
 * @related TbxMatDialogProviderConfig
 *
 * @public
 */
@Injectable()
export class TbxMatDialogCloseFontIconService extends TbxMatFontIconService<string> {
    /**
     * Construct a font-based close icon service
     *
     * @param fontSet - Optional fontSet identifier (e.g., `'material-symbols-rounded'`).
     *   When provided, takes precedence over all global defaults.
     *
     * @public
     */
    constructor(fontSet?: string) {
        super(fontSet);
    }

    /**
     * Register the default close icon ligature
     *
     * @remarks
     * Registers the `'close'` {@link https://fonts.google.com/icons | Material Symbols}
     * ligature under the key `'close'`. Subclasses can override by calling
     * `register('close', 'different_ligature')`.
     *
     * @internal
     */
    protected override initialize(): void {
        super.initialize();
        this.register('close', 'close');
    }
}
