/**
 * Dialog system — typed modal dialogs with emphasis, footer controls, and input content.
 *
 * Public API:
 *   - TbxMatDialogService            — inject and call show(), information(), warning(), error(), confirm(), input()
 *   - TbxMatDialogConfigArgs         — Partial config with required title (for opinionated methods)
 *   - TbxMatDialogDismissReason      — result enum (Affirm, Deny, Cancel, Close)
 *   - TbxMatDialogEmphasisType       — emphasis enum (Default, Destructive, Warning, Informational)
 *   - TbxMatDialogResult<T, F>       — typed return value
 *   - TbxMatDialogConfig<T>          — full configuration for show()
 *   - TbxMatDialogData<T>            — contract for input dialog content components
 *   - TbxMatDialogFooterControlType  — discriminated union of footer items
 *   - TBX_MAT_DIALOG_BUTTONS_OK / OK_CANCEL / YES_NO / YES_NO_CANCEL — button presets
 *   - TBX_MAT_DIALOG_DEFAULT_WIDTH   — default width constant
 *   - TBX_MAT_DIALOG_ICON_SERVICE    — injection token for pluggable icon resolution
 *   - TbxMatDialogIconService        — default icon service (Material Symbols Rounded)
 *
 * Internal (not re-exported):
 *   - DialogShellComponent     — common chrome
 *   - DialogShellData          — MAT_DIALOG_DATA payload
 */

// Types — enum values
export { TbxMatDialogDismissReason } from './types/dialog-result.type';
export { TbxMatDialogEmphasisType } from './types/dialog-emphasis.type';

// Models — dialog types
export type {
    TbxMatDialogResult,
    TbxMatDialogConfig,
    TbxMatDialogData,
} from './models/dialog.model';

// Types — type aliases
export type { TbxMatDialogFooterControlType } from './types/dialog-footer-control.type';
export type { TbxMatDialogConfigArgs } from './types/dialog-config-override.type';

// Models — footer controls
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
export { TBX_MAT_DIALOG_ICON_SERVICE } from './tokens/dialog-icon-service.token';

// Services
export { TbxMatDialogService } from './services/dialog.service';
export { TbxMatDialogIconService } from './services/dialog-icon.service';
