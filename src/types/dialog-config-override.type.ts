import { type TbxMatDialogConfig } from '../models/dialog.model';

/**
 * Convenience type for the opinionated dialog methods (info, warning, error,
 * confirm, input). Requires a title — all other TbxMatDialogConfig fields are optional.
 * Callers specify only what they want to override.
 */
export type TbxMatDialogConfigArgs<T = void> = { title: string } & Partial<
    Omit<TbxMatDialogConfig<T>, 'title'>
>;
