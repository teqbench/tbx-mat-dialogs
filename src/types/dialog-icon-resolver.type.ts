import { type TbxMatIconResolver, type TbxMatIconType } from '@teqbench/tbx-mat-icons';

/**
 * Icon resolver that also exposes the resolved icon's type
 *
 * @remarks
 * Combines `TbxMatIconResolver` from `@teqbench/tbx-mat-icons` with the static
 * `iconType` property the dialog template needs to decide whether to render a
 * font ligature or an SVG element.
 *
 * @usage
 * The shape of the optional `closeIconResolverService` slot on
 * {@link TbxMatDialogProviderConfig}. Custom close icon services must conform to this
 * shape — extending `TbxMatFontIconService<string>` or `TbxMatSvgIconService<string>`
 * from `@teqbench/tbx-mat-icons` provides it automatically.
 *
 * @example
 * ```typescript
 * // MyCloseIconService is a hypothetical consumer-defined service.
 * const resolver: TbxMatDialogIconResolver = new MyCloseIconService();
 * const icon = resolver.resolve('close');
 * const type = resolver.iconType; // 'font' | 'svg'
 * ```
 *
 * @category Types
 * @displayName Dialog Icon Resolver
 * @order 4
 * @since 0.1.0
 * @related TbxMatDialogProviderConfig
 *
 * @public
 */
export type TbxMatDialogIconResolver = TbxMatIconResolver<string> & {
    readonly iconType: TbxMatIconType;
};
