import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DialogIconService } from './dialog-icon.service';

describe('DialogIconService', () => {
    let service: DialogIconService;

    function setupTestBed(): void {
        TestBed.configureTestingModule({
            providers: [DialogIconService],
        });

        service = TestBed.inject(DialogIconService);
    }

    it('should be created', () => {
        setupTestBed();
        expect(service).toBeTruthy();
    });

    it('should use material-symbols-rounded font set', () => {
        setupTestBed();
        expect(service.fontSet).toBe('material-symbols-rounded');
    });

    it('should return "check" for success()', () => {
        setupTestBed();
        expect(service.success()).toBe('check');
    });

    it('should return "exclamation" for error()', () => {
        setupTestBed();
        expect(service.error()).toBe('exclamation');
    });

    it('should return "exclamation" for warning()', () => {
        setupTestBed();
        expect(service.warning()).toBe('exclamation');
    });

    it('should return "info_i" for information()', () => {
        setupTestBed();
        expect(service.information()).toBe('info_i');
    });

    it('should return "question_mark" for help()', () => {
        setupTestBed();
        expect(service.help()).toBe('question_mark');
    });
});
