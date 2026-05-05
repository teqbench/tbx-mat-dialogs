/**
 * Dialog system — typed modal dialogs with severity, footer controls, and input content.
 *
 * Public API:
 *   - TbxMatDialogService                     — inject and call show(), success(), error(), warning(), information(), help(), default(), confirm(), input()
 *   - TbxMatDialogConfigArgs                  — Partial config with required title (for opinionated methods)
 *   - TbxMatDialogDismissReason               — result enum (Affirm, Deny, Cancel, Close)
 *   - TbxMatDialogResult<T, F>                — typed return value
 *   - TbxMatDialogConfig<T>                   — full configuration for show()
 *   - TbxMatDialogData<T>                     — contract for input dialog content components
 *   - TbxMatDialogFooterControlType           — discriminated union of footer items
 *   - TBX_MAT_DIALOG_BUTTONS_OK / OK_CANCEL / YES_NO / YES_NO_CANCEL — button presets
 *   - TBX_MAT_DIALOG_DEFAULT_WIDTH            — default width constant
 *   - TBX_MAT_DIALOG_PROVIDER_CONFIG          — injection token for icon provider configuration
 *   - TbxMatDialogProviderConfig              — provider config interface (severity + close icon resolvers)
 *   - TbxMatDialogIconResolver                — icon resolver shape combined with the resolved icon's type
 *   - TbxMatDialogSeverityFontIconService     — default font-based severity icon service
 *   - TbxMatDialogSeveritySvgIconService      — default SVG-based severity icon service
 *   - TbxMatDialogCloseFontIconService        — default font-based close icon service
 *
 * Internal (not re-exported):
 *   - DialogShellComponent     — common chrome
 *   - DialogShellData          — MAT_DIALOG_DATA payload
 */

// Types — enum values
export { TbxMatDialogDismissReason } from './types/dialog-result.type';

// Models — dialog types
export type {
    TbxMatDialogResult,
    TbxMatDialogConfig,
    TbxMatDialogData,
} from './models/dialog.model';

// Types — type aliases
export type { TbxMatDialogFooterControlType } from './types/dialog-footer-control.type';
export type { TbxMatDialogConfigArgs } from './types/dialog-config-override.type';
export type { TbxMatDialogIconResolver } from './types/dialog-icon-resolver.type';

// Models — provider config and footer controls
export type { TbxMatDialogProviderConfig } from './models/dialog-provider-config.model';
export type {
    TbxMatDialogFooterItem,
    TbxMatDialogFooterButton,
    TbxMatDialogFooterCheckbox,
    TbxMatDialogFooterToggle,
    TbxMatDialogFooterRadioGroup,
    TbxMatDialogFooterRadioOption,
    TbxMatDialogFooterToggleGroup,
    TbxMatDialogFooterToggleOption,
} from './models/dialog-footer.model';

// Constants — button presets and defaults
export {
    TBX_MAT_DIALOG_DEFAULT_WIDTH,
    TBX_MAT_DIALOG_BUTTONS_OK,
    TBX_MAT_DIALOG_BUTTONS_OK_CANCEL,
    TBX_MAT_DIALOG_BUTTONS_YES_NO,
    TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL,
} from './constants/dialog.constants';

// Tokens — pluggable DI
export { TBX_MAT_DIALOG_PROVIDER_CONFIG } from './tokens/dialog-provider-config.token';

// Services
export { TbxMatDialogService } from './services/dialog.service';
export { TbxMatDialogSeverityFontIconService } from './services/dialog-severity-font-icon.service';
export { TbxMatDialogSeveritySvgIconService } from './services/dialog-severity-svg-icon.service';
export { TbxMatDialogCloseFontIconService } from './services/dialog-close-font-icon.service';
