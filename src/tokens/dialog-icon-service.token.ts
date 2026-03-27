import { InjectionToken } from '@angular/core';
import type { SeverityIconService } from '@teqbench/tbx-mat-severity-icons';

/**
 * Optional injection token for customizing dialog icons.
 *
 * Provide a SeverityIconService implementation to override the default
 * hardcoded Material Icons ligatures used by DialogComponent.
 *
 * ```typescript
 * providers: [
 *     { provide: DIALOG_ICON_SERVICE, useClass: DialogIconService },
 * ]
 * ```
 */
export const DIALOG_ICON_SERVICE = new InjectionToken<SeverityIconService>('DIALOG_ICON_SERVICE');
