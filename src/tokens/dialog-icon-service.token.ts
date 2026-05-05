import { InjectionToken } from '@angular/core';
import type { TbxMatSeverityResolver } from '@teqbench/tbx-mat-severity-theme';

/**
 * Optional injection token for customizing dialog icons.
 *
 * Provide a TbxMatSeverityResolver implementation to override the default
 * Material Symbols ligatures used by DialogComponent.
 *
 * ```typescript
 * providers: [
 *     { provide: TBX_MAT_DIALOG_ICON_SERVICE, useClass: TbxMatDialogIconService },
 * ]
 * ```
 */
export const TBX_MAT_DIALOG_ICON_SERVICE = new InjectionToken<TbxMatSeverityResolver>(
    'TBX_MAT_DIALOG_ICON_SERVICE'
);
