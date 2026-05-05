import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TbxMatDialogIconService } from './dialog-icon.service';

describe('TbxMatDialogIconService', () => {
    let service: TbxMatDialogIconService;

    function setupTestBed(): void {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: TbxMatDialogIconService,
                    useFactory: () => new TbxMatDialogIconService('material-symbols-rounded'),
                },
            ],
        });

        service = TestBed.inject(TbxMatDialogIconService);
    }

    it('should be created', () => {
        setupTestBed();
        expect(service).toBeTruthy();
    });

    it('should use material-symbols-rounded font set', () => {
        setupTestBed();
        expect(service.fontSet).toBe('material-symbols-rounded');
    });

    it('should resolve "check" for success', () => {
        setupTestBed();
        expect(service.success()).toBe('check');
    });

    it('should resolve "exclamation" for error', () => {
        setupTestBed();
        expect(service.error()).toBe('exclamation');
    });

    it('should resolve "exclamation" for warning', () => {
        setupTestBed();
        expect(service.warning()).toBe('exclamation');
    });

    it('should resolve "info_i" for information', () => {
        setupTestBed();
        expect(service.information()).toBe('info_i');
    });

    it('should resolve "question_mark" for help', () => {
        setupTestBed();
        expect(service.help()).toBe('question_mark');
    });
});
