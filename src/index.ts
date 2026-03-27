/**
 * Dialog system — typed modal dialogs with emphasis, footer controls, and input content.
 *
 * Public API:
 *   - DialogService            — inject and call show(), info(), warning(), error(), confirm(), input()
 *   - DialogConfigOverrideType  — Partial config with required title (for opinionated methods)
 *   - DialogResultType         — result enum (Affirm, Deny, Cancel, Close)
 *   - DialogEmphasisType       — emphasis enum (Default, Destructive, Warning, Informational)
 *   - DialogOutput<T, F>       — typed return value
 *   - DialogConfig<T>          — full configuration for show()
 *   - DialogContent<T>         — contract for input dialog content components
 *   - DialogFooterControlType  — discriminated union of footer items
 *   - BUTTONS_OK/OK_CANCEL/YES_NO/YES_NO_CANCEL — button presets
 *   - DIALOG_DEFAULT_WIDTH     — default width constant
 *   - DIALOG_ICON_SERVICE      — injection token for pluggable icon resolution
 *   - DialogIconService        — default icon service (Material Symbols Rounded)
 *   - SampleInputComponent     — reference DialogContent<SampleInputData> implementation
 *   - SampleInputData          — data type returned by SampleInputComponent
 *
 * Internal (not re-exported):
 *   - DialogShellComponent     — common chrome
 *   - DialogShellData          — MAT_DIALOG_DATA payload
 */

// Types — enum values
export { DialogResultType } from './types/dialog-result.type';
export { DialogEmphasisType } from './types/dialog-emphasis.type';

// Models — dialog types
export type { DialogOutput, DialogConfig, DialogContent } from './models/dialog.model';

// Types — type aliases
export type { DialogFooterControlType } from './types/dialog-footer-control.type';
export type { DialogConfigOverrideType } from './types/dialog-config-override.type';

// Models — footer controls
export type {
    DialogFooterItem,
    DialogFooterButton,
    DialogFooterCheckbox,
    DialogFooterToggle,
    DialogFooterRadioGroup,
    DialogFooterRadioOption,
    DialogFooterToggleGroup,
    DialogFooterToggleOption,
} from './models/dialog-footer.model';

// Constants — button presets and defaults
export {
    DIALOG_DEFAULT_WIDTH,
    BUTTONS_OK,
    BUTTONS_OK_CANCEL,
    BUTTONS_YES_NO,
    BUTTONS_YES_NO_CANCEL,
} from './constants/dialog.constants';

// Tokens — pluggable DI
export { DIALOG_ICON_SERVICE } from './tokens/dialog-icon-service.token';

// Services
export { DialogService } from './services/dialog.service';
export { DialogIconService } from './services/dialog-icon.service';

// Components — sample/reference implementations
export { SampleInputComponent } from './components/sample-input.component';
export type { SampleInputData } from './components/sample-input.component';
