import { type TbxMatDialogConfig } from '../models/dialog.model';

/**
 * Convenience type for the opinionated dialog methods (`success`, `error`, `warning`,
 * `information`, `help`, `default`, `confirm`, `input`)
 *
 * @remarks
 * Requires a `title` — all other {@link TbxMatDialogConfig} fields are optional. Callers
 * specify only what they want to override; the service merges in defaults for severity
 * type and footer button preset.
 *
 * @typeParam T - Type of data for input dialogs. Defaults to `void`.
 *
 * @usage
 * Used as the parameter type for the opinionated {@link TbxMatDialogService} methods.
 * Use {@link TbxMatDialogConfig} directly when calling `show()`, which applies no defaults.
 *
 * @example
 * ```typescript
 * await dialog.success({ title: 'Saved' });
 * await dialog.warning({ title: 'Caution', message: 'This may take a while.' });
 * ```
 *
 * @category Types
 * @displayName Dialog Config Args
 * @order 2
 * @since 0.1.0
 * @related TbxMatDialogConfig
 * @related TbxMatDialogService
 *
 * @public
 */
export type TbxMatDialogConfigArgs<T = void> = { title: string } & Partial<
    Omit<TbxMatDialogConfig<T>, 'title'>
>;
