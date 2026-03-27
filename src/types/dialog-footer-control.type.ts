import {
    type DialogFooterButton,
    type DialogFooterCheckbox,
    type DialogFooterToggle,
    type DialogFooterRadioGroup,
    type DialogFooterToggleGroup,
} from '../models/dialog-footer.model';

/**
 * Discriminated union of all dialog footer item types.
 *
 * The dialog shell component renders each item via `@switch (control.type)`,
 * and TypeScript narrows the type automatically in each branch.
 */
export type DialogFooterControlType =
    | DialogFooterButton
    | DialogFooterCheckbox
    | DialogFooterToggle
    | DialogFooterRadioGroup
    | DialogFooterToggleGroup;
