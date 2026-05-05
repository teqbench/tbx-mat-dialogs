import {
    type TbxMatDialogFooterButton,
    type TbxMatDialogFooterCheckbox,
    type TbxMatDialogFooterToggle,
    type TbxMatDialogFooterRadioGroup,
    type TbxMatDialogFooterToggleGroup,
} from '../models/dialog-footer.model';

/**
 * Discriminated union of all dialog footer item types.
 *
 * The dialog shell component renders each item via `@switch (control.type)`,
 * and TypeScript narrows the type automatically in each branch.
 */
export type TbxMatDialogFooterControlType =
    | TbxMatDialogFooterButton
    | TbxMatDialogFooterCheckbox
    | TbxMatDialogFooterToggle
    | TbxMatDialogFooterRadioGroup
    | TbxMatDialogFooterToggleGroup;
