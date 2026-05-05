/**
 * Result of a dialog interaction. Returned as part of TbxMatDialogResult
 * when the dialog closes.
 *
 * - Affirm: User confirmed the action (OK, Yes, Save, Delete, etc.)
 * - Deny: User explicitly declined (No)
 * - Cancel: User aborted the interaction (Cancel button)
 * - Close: User dismissed without choosing (close button, Escape, backdrop)
 */
export enum TbxMatDialogDismissReason {
    Affirm = 'affirm',
    Deny = 'deny',
    Cancel = 'cancel',
    Close = 'close',
}
