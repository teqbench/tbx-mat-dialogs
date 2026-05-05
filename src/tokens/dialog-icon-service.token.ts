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
 *     { provide: DIALOG_ICON_SERVICE, useClass: DialogIconService },
 * ]
 * ```
 */
export const DIALOG_ICON_SERVICE = new InjectionToken<TbxMatSeverityResolver>(
    'DIALOG_ICON_SERVICE'
);
