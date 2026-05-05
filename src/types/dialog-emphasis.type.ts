/**
 * Visual emphasis for the dialog. Determines the color of the header icon,
 * primary action button, and separator highlight via --tbx-dialog-* tokens.
 *
 * Universal defaults are defined on `html` in `_dialog-panels.scss`.
 * Themes can override per `html[data-theme]` block.
 */
export enum TbxMatDialogEmphasisType {
    Default = 'default',
    Destructive = 'destructive',
    Warning = 'warning',
    Informational = 'informational',
}
