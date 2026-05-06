import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TbxMatDialogSeveritySvgIconService } from './dialog-severity-svg-icon.service';

describe('TbxMatDialogSeveritySvgIconService', () => {
    let service: TbxMatDialogSeveritySvgIconService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: TbxMatDialogSeveritySvgIconService,
                    useFactory: () => new TbxMatDialogSeveritySvgIconService(),
                },
            ],
        });

        service = TestBed.inject(TbxMatDialogSeveritySvgIconService);
    });

    it('should have SVG icon type', () => {
        expect(service.iconType).toBe(TbxMatIconType.Svg);
    });

    describe('resolve()', () => {
        it('should resolve every severity level to non-empty SVG markup', () => {
            for (const level of Object.values(TbxMatSeverityLevel)) {
                const name = service.resolve(level);
                expect(name).toBeTypeOf('string');
                expect(name!.length).toBeGreaterThan(0);
            }
        });

        it('should return undefined for unknown keys', () => {
            expect(service.resolve('unknown')).toBeUndefined();
        });
    });
});
