/**
 * Result of a dialog interaction. Returned as part of DialogOutput
 * when the dialog closes.
 *
 * - Affirm: User confirmed the action (OK, Yes, Save, Delete, etc.)
 * - Deny: User explicitly declined (No)
 * - Cancel: User aborted the interaction (Cancel button)
 * - Close: User dismissed without choosing (close button, Escape, backdrop)
 */
export enum DialogResultType {
    Affirm = 'affirm',
    Deny = 'deny',
    Cancel = 'cancel',
    Close = 'close',
}
