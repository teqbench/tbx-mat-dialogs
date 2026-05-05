import { Injectable } from '@angular/core';
import {
    TbxMatSeverityFontIconService,
    TbxMatSeverityLevel,
} from '@teqbench/tbx-mat-severity-theme';

/**
 * Default dialog icon service using Material Symbols font icons.
 *
 * Provides icon ligatures for each severity level. Consumers can use this
 * implementation directly or provide their own service via the
 * DIALOG_ICON_SERVICE injection token.
 */
@Injectable()
export class DialogIconService extends TbxMatSeverityFontIconService {
    constructor(fontSet?: string) {
        super(fontSet);
    }

    protected override initialize(): void {
        super.initialize();
        this.register(TbxMatSeverityLevel.Success, 'check');
        this.register(TbxMatSeverityLevel.Error, 'exclamation');
        this.register(TbxMatSeverityLevel.Warning, 'exclamation');
        this.register(TbxMatSeverityLevel.Information, 'info_i');
        this.register(TbxMatSeverityLevel.Help, 'question_mark');
    }
}
