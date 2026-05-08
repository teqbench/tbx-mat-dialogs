/**
 * Opinionated modal dialog service for {@link https://angular.dev | Angular}
 *
 * @remarks
 * Built on {@link https://material.angular.dev/components/dialog/api | Angular Material's MatDialog},
 * this package exposes nine async dialog methods returning `Promise<TbxMatDialogResult<T, F>>`:
 * six severity-leveled methods that mirror `tbx-mat-banners` and `tbx-mat-notifications`
 * (`success`, `error`, `warning`, `information`, `help`, `default`), two dialog-specific UX
 * patterns (`confirm` for Yes/No, `input` for projected form content), and `show` for
 * full-control configuration.
 *
 * Severity colors come from `@teqbench/tbx-mat-severity-theme`; pluggable icon resolution
 * is wired via {@link TBX_MAT_DIALOG_PROVIDER_CONFIG} with three default services
 * ({@link TbxMatDialogSeverityFontIconService}, {@link TbxMatDialogSeveritySvgIconService},
 * {@link TbxMatDialogCloseFontIconService}). Footer is a single flex row of buttons and
 * form controls (checkbox, slide-toggle, radio group, button-toggle group). Input dialog
 * content components implement {@link TbxMatDialogData} with signal-based validation.
 *
 * Key exports:
 *
 * - {@link TbxMatDialogService} — inject and call `show()`, `success()`, `error()`, `warning()`, `information()`, `help()`, `default()`, `confirm()`, `input()`
 * - {@link TbxMatDialogConfig} — full configuration for `show()`
 * - {@link TbxMatDialogConfigArgs} — partial config with required title (for opinionated methods)
 * - {@link TbxMatDialogResult} — typed return value
 * - {@link TbxMatDialogDismissReason} — result enum (`Affirm`, `Deny`, `Cancel`, `Close`)
 * - {@link TbxMatDialogData} — contract for input dialog content components
 * - {@link TbxMatDialogFooterControlType} — discriminated union of footer items
 * - {@link TbxMatDialogProviderConfig} — provider config interface (severity + close icon resolvers)
 * - {@link TBX_MAT_DIALOG_PROVIDER_CONFIG} — injection token for icon provider configuration
 * - {@link TBX_MAT_DIALOG_BUTTONS_OK}, {@link TBX_MAT_DIALOG_BUTTONS_OK_CANCEL}, {@link TBX_MAT_DIALOG_BUTTONS_YES_NO}, {@link TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL} — button presets
 *
 * @see {@link https://angular.dev | Angular}
 * @see {@link https://material.angular.dev | Angular Material}
 *
 * @packageDocumentation
 */

// Enums
export { TbxMatDialogDismissReason } from './enums/dialog-dismiss-reason.enum';

// Types
export type { TbxMatDialogFooterControlType } from './types/dialog-footer-control.type';
export type { TbxMatDialogConfigArgs } from './types/dialog-config-override.type';
export type { TbxMatDialogIconResolver } from './types/dialog-icon-resolver.type';

// Models
export type { TbxMatDialogResult, TbxMatDialogConfig, TbxMatDialogData } from './models/dialog.model';
export type { TbxMatDialogProviderConfig } from './models/dialog-provider-config.model';
export type { TbxMatDialogFooterItem, TbxMatDialogFooterButton, TbxMatDialogFooterCheckbox, TbxMatDialogFooterToggle, TbxMatDialogFooterRadioGroup, TbxMatDialogFooterRadioOption, TbxMatDialogFooterToggleGroup, TbxMatDialogFooterToggleOption } from './models/dialog-footer.model';

// Constants
export { TBX_MAT_DIALOG_DEFAULT_WIDTH, TBX_MAT_DIALOG_BUTTONS_OK, TBX_MAT_DIALOG_BUTTONS_OK_CANCEL, TBX_MAT_DIALOG_BUTTONS_YES_NO, TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL } from './constants/dialog.constants';

// Tokens
export { TBX_MAT_DIALOG_PROVIDER_CONFIG } from './tokens/dialog-provider-config.token';

// Services
export { TbxMatDialogService } from './services/dialog.service';
export { TbxMatDialogSeverityFontIconService } from './services/dialog-severity-font-icon.service';
export { TbxMatDialogSeveritySvgIconService } from './services/dialog-severity-svg-icon.service';
export { TbxMatDialogCloseFontIconService } from './services/dialog-close-font-icon.service';
