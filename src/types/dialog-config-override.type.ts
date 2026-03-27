import { type DialogConfig } from '../models/dialog.model';

/**
 * Convenience type for the opinionated dialog methods (info, warning, error,
 * confirm, input). Requires a title — all other DialogConfig fields are optional.
 * Callers specify only what they want to override.
 */
export type DialogConfigOverrideType<T = void> = { title: string } & Partial<
    Omit<DialogConfig<T>, 'title'>
>;
