/**
 * Identify which action closed a dialog
 *
 * @remarks
 * Returned as {@link TbxMatDialogResult}.result when the dialog closes.
 *
 * - `Affirm` — User confirmed the action (OK, Yes, Save, Delete, etc.).
 * - `Deny` — User explicitly declined (No).
 * - `Cancel` — User aborted the interaction (Cancel button).
 * - `Close` — User dismissed without choosing (close button, Escape, backdrop).
 *
 * @usage
 * Compare {@link TbxMatDialogResult}.result against the enum members to branch on the
 * user's action. Footer button declarations carry a `result` field that maps the click
 * to one of these values.
 *
 * @example
 * ```typescript
 * const output = await dialog.confirm({ title: 'Delete?', message: 'This cannot be undone.' });
 * if (output.result === TbxMatDialogDismissReason.Affirm) {
 *     // proceed with deletion
 * }
 * ```
 *
 * @category Enums
 * @displayName Dialog Dismiss Reason
 * @order 1
 * @since 0.1.0
 * @related TbxMatDialogResult
 *
 * @public
 */
export enum TbxMatDialogDismissReason {
    /**
     * The user confirmed the action (OK, Yes, Save, Delete, etc.)
     *
     * @public
     */
    Affirm = 'affirm',

    /**
     * The user explicitly declined (No)
     *
     * @public
     */
    Deny = 'deny',

    /**
     * The user aborted the interaction (Cancel button)
     *
     * @public
     */
    Cancel = 'cancel',

    /**
     * The user dismissed without choosing (close button, Escape, backdrop)
     *
     * @public
     */
    Close = 'close',
}
