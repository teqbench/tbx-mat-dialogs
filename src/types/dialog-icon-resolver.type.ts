import { type TbxMatIconResolver, type TbxMatIconType } from '@teqbench/tbx-mat-icons';

/**
 * Icon resolver that also exposes the resolved icon's type.
 *
 * Combines `TbxMatIconResolver` with the static `iconType` property
 * the dialog template needs to decide whether to render a font ligature
 * or an SVG element.
 */
export type TbxMatDialogIconResolver = TbxMatIconResolver<string> & {
    readonly iconType: TbxMatIconType;
};
