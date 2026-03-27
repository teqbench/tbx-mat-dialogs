import { Injectable } from '@angular/core';
import { SeverityIconService } from '@teqbench/tbx-mat-severity-icons';

/**
 * Default dialog icon service using Material Symbols Rounded.
 *
 * Provides icon ligatures for each severity level. Consumers can use this
 * implementation directly or provide their own SeverityIconService subclass
 * via the DIALOG_ICON_SERVICE injection token.
 */
@Injectable()
export class DialogIconService extends SeverityIconService {
    constructor() {
        super('material-symbols-rounded');
    }

    success(): string {
        return 'check';
    }

    error(): string {
        return 'exclamation';
    }

    warning(): string {
        return 'exclamation';
    }

    information(): string {
        return 'info_i';
    }

    help(): string {
        return 'question_mark';
    }
}
