import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import type { TbxMatSeverityResolver } from '@teqbench/tbx-mat-severity-theme';
import { TbxMatDialogIconService } from './dialog-icon.service';
import { TBX_MAT_DIALOG_ICON_SERVICE } from '../tokens/dialog-icon-service.token';
import { TbxMatDialogService } from './dialog.service';
import { DialogShellComponent } from '../components/dialog-shell.component';
import { TbxMatDialogDismissReason } from '../types/dialog-result.type';
import { TbxMatDialogEmphasisType } from '../types/dialog-emphasis.type';
import {
    TBX_MAT_DIALOG_BUTTONS_OK,
    TBX_MAT_DIALOG_BUTTONS_OK_CANCEL,
    TBX_MAT_DIALOG_BUTTONS_YES_NO,
    TBX_MAT_DIALOG_DEFAULT_WIDTH,
} from '../constants/dialog.constants';

describe('TbxMatDialogService', () => {
    let service: TbxMatDialogService;
    let icons: TbxMatSeverityResolver;
    let dialogSpy: { open: ReturnType<typeof vi.fn> };
    let afterClosed$: Subject<unknown>;

    function setupTestBed(): void {
        afterClosed$ = new Subject<unknown>();

        dialogSpy = {
            open: vi.fn().mockReturnValue({
                afterClosed: () => afterClosed$.asObservable(),
            }),
        };

        TestBed.configureTestingModule({
            providers: [
                TbxMatDialogService,
                { provide: MatDialog, useValue: dialogSpy },
                {
                    provide: TBX_MAT_DIALOG_ICON_SERVICE,
                    useFactory: () => new TbxMatDialogIconService('material-symbols-rounded'),
                },
            ],
        });

        service = TestBed.inject(TbxMatDialogService);
        icons = TestBed.inject(TBX_MAT_DIALOG_ICON_SERVICE);
    }

    /** Resolve the pending dialog with a result. */
    function resolveDialog<T>(value: T): void {
        afterClosed$.next(value);
        afterClosed$.complete();
    }

    /** Extract the shell data passed to MatDialog.open(). */
    function getShellData(): { config: Record<string, unknown>; resolvedFooter: unknown[] } {
        return dialogSpy.open.mock.calls[0][1].data;
    }

    describe('information()', () => {
        it('should default to info icon from TBX_MAT_DIALOG_ICON_SERVICE', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBe(icons.information());
        });

        it('should default to Informational emphasis', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['emphasis']).toBe(TbxMatDialogEmphasisType.Informational);
        });

        it('should default to TBX_MAT_DIALOG_BUTTONS_OK footer', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().resolvedFooter).toEqual(TBX_MAT_DIALOG_BUTTONS_OK);
        });

        it('should allow overriding icon', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test', icon: 'celebration' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBe('celebration');
        });

        it('should allow overriding emphasis', async () => {
            setupTestBed();
            const promise = service.information({
                title: 'Test',
                emphasis: TbxMatDialogEmphasisType.Warning,
            });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['emphasis']).toBe(TbxMatDialogEmphasisType.Warning);
        });

        it('should allow overriding footer', async () => {
            setupTestBed();
            const customFooter = [
                {
                    key: 'close',
                    type: 'button' as const,
                    label: 'Close',
                    result: TbxMatDialogDismissReason.Close,
                    align: 'end' as const,
                },
            ];
            const promise = service.information({ title: 'Test', footer: customFooter });
            resolveDialog({ result: TbxMatDialogDismissReason.Close, footerValues: {} });
            await promise;

            expect(getShellData().resolvedFooter).toEqual(customFooter);
        });

        it('should return TbxMatDialogResult when resolved', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });

            const output = await promise;
            expect(output.result).toBe(TbxMatDialogDismissReason.Affirm);
        });
    });

    describe('warning()', () => {
        it('should default to warning icon from TBX_MAT_DIALOG_ICON_SERVICE', async () => {
            setupTestBed();
            const promise = service.warning({ title: 'Caution' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBe(icons.warning());
        });

        it('should default to Warning emphasis', async () => {
            setupTestBed();
            const promise = service.warning({ title: 'Caution' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['emphasis']).toBe(TbxMatDialogEmphasisType.Warning);
        });

        it('should default to TBX_MAT_DIALOG_BUTTONS_OK footer', async () => {
            setupTestBed();
            const promise = service.warning({ title: 'Caution' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().resolvedFooter).toEqual(TBX_MAT_DIALOG_BUTTONS_OK);
        });
    });

    describe('error()', () => {
        it('should default to error icon from TBX_MAT_DIALOG_ICON_SERVICE', async () => {
            setupTestBed();
            const promise = service.error({ title: 'Failed' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBe(icons.error());
        });

        it('should default to Destructive emphasis', async () => {
            setupTestBed();
            const promise = service.error({ title: 'Failed' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['emphasis']).toBe(TbxMatDialogEmphasisType.Destructive);
        });

        it('should default to TBX_MAT_DIALOG_BUTTONS_OK footer', async () => {
            setupTestBed();
            const promise = service.error({ title: 'Failed' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().resolvedFooter).toEqual(TBX_MAT_DIALOG_BUTTONS_OK);
        });
    });

    describe('confirm()', () => {
        it('should default to help icon from TBX_MAT_DIALOG_ICON_SERVICE', async () => {
            setupTestBed();
            const promise = service.confirm({ title: 'Continue?' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBe(icons.help());
        });

        it('should default to Default emphasis', async () => {
            setupTestBed();
            const promise = service.confirm({ title: 'Continue?' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['emphasis']).toBe(TbxMatDialogEmphasisType.Default);
        });

        it('should default to TBX_MAT_DIALOG_BUTTONS_YES_NO footer', async () => {
            setupTestBed();
            const promise = service.confirm({ title: 'Continue?' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().resolvedFooter).toEqual(TBX_MAT_DIALOG_BUTTONS_YES_NO);
        });

        it('should return Affirm result when user confirms', async () => {
            setupTestBed();
            const promise = service.confirm({ title: 'Delete?' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });

            const output = await promise;
            expect(output.result).toBe(TbxMatDialogDismissReason.Affirm);
        });

        it('should return Deny result when user declines', async () => {
            setupTestBed();
            const promise = service.confirm({ title: 'Delete?' });
            resolveDialog({ result: TbxMatDialogDismissReason.Deny, footerValues: {} });

            const output = await promise;
            expect(output.result).toBe(TbxMatDialogDismissReason.Deny);
        });

        it('should return typed footer values', async () => {
            setupTestBed();
            const promise = service.confirm<{ dontAsk: boolean }>({
                title: 'Delete?',
                footer: [
                    { key: 'dontAsk', type: 'checkbox', label: "Don't ask", align: 'start' },
                    {
                        key: 'yes',
                        type: 'button',
                        label: 'Yes',
                        result: TbxMatDialogDismissReason.Affirm,
                        emphasis: 'primary',
                        align: 'end',
                    },
                ],
            });
            resolveDialog({
                result: TbxMatDialogDismissReason.Affirm,
                footerValues: { dontAsk: true },
            });

            const output = await promise;
            expect(output.footerValues.dontAsk).toBe(true);
        });
    });

    describe('input()', () => {
        it('should default to info icon from TBX_MAT_DIALOG_ICON_SERVICE', async () => {
            setupTestBed();
            const promise = service.input({ title: 'Rename' });
            resolveDialog({ result: TbxMatDialogDismissReason.Cancel, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBe(icons.information());
        });

        it('should default to Default emphasis', async () => {
            setupTestBed();
            const promise = service.input({ title: 'Rename' });
            resolveDialog({ result: TbxMatDialogDismissReason.Cancel, footerValues: {} });
            await promise;

            expect(getShellData().config['emphasis']).toBe(TbxMatDialogEmphasisType.Default);
        });

        it('should default to TBX_MAT_DIALOG_BUTTONS_OK_CANCEL footer', async () => {
            setupTestBed();
            const promise = service.input({ title: 'Rename' });
            resolveDialog({ result: TbxMatDialogDismissReason.Cancel, footerValues: {} });
            await promise;

            expect(getShellData().resolvedFooter).toEqual(TBX_MAT_DIALOG_BUTTONS_OK_CANCEL);
        });

        it('should return typed data on affirm', async () => {
            setupTestBed();
            const promise = service.input<string>({ title: 'Rename' });
            resolveDialog({
                result: TbxMatDialogDismissReason.Affirm,
                data: 'New Name',
                footerValues: {},
            });

            const output = await promise;
            expect(output.result).toBe(TbxMatDialogDismissReason.Affirm);
            expect(output.data).toBe('New Name');
        });

        it('should return undefined data on cancel', async () => {
            setupTestBed();
            const promise = service.input<string>({ title: 'Rename' });
            resolveDialog({ result: TbxMatDialogDismissReason.Cancel, footerValues: {} });

            const output = await promise;
            expect(output.result).toBe(TbxMatDialogDismissReason.Cancel);
            expect(output.data).toBeUndefined();
        });
    });

    describe('show()', () => {
        it('should pass config through with no defaults applied', async () => {
            setupTestBed();
            const promise = service.show({
                title: 'Custom',
                icon: 'build',
                emphasis: TbxMatDialogEmphasisType.Warning,
                message: 'Full control.',
            });
            resolveDialog({ result: TbxMatDialogDismissReason.Close, footerValues: {} });
            await promise;

            const shellData = getShellData();
            expect(shellData.config['title']).toBe('Custom');
            expect(shellData.config['icon']).toBe('build');
            expect(shellData.config['emphasis']).toBe(TbxMatDialogEmphasisType.Warning);
            expect(shellData.config['message']).toBe('Full control.');
        });

        it('should not apply default icon when omitted', async () => {
            setupTestBed();
            const promise = service.show({ title: 'No Icon' });
            resolveDialog({ result: TbxMatDialogDismissReason.Close, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBeUndefined();
        });

        it('should not apply default emphasis when omitted', async () => {
            setupTestBed();
            const promise = service.show({ title: 'No Emphasis' });
            resolveDialog({ result: TbxMatDialogDismissReason.Close, footerValues: {} });
            await promise;

            expect(getShellData().config['emphasis']).toBeUndefined();
        });

        it('should use empty footer when no footer provided', async () => {
            setupTestBed();
            const promise = service.show({ title: 'Bare' });
            resolveDialog({ result: TbxMatDialogDismissReason.Close, footerValues: {} });
            await promise;

            expect(getShellData().resolvedFooter).toEqual([]);
        });

        it('should use provided footer', async () => {
            setupTestBed();
            const promise = service.show({
                title: 'Custom',
                footer: [...TBX_MAT_DIALOG_BUTTONS_OK],
            });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().resolvedFooter).toEqual(TBX_MAT_DIALOG_BUTTONS_OK);
        });
    });

    describe('dialog configuration', () => {
        it('should use default width when not specified', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(
                DialogShellComponent,
                expect.objectContaining({ width: TBX_MAT_DIALOG_DEFAULT_WIDTH })
            );
        });

        it('should use custom width when specified', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test', width: '600px' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(
                DialogShellComponent,
                expect.objectContaining({ width: '600px' })
            );
        });

        it('should set disableClose to false by default', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(
                DialogShellComponent,
                expect.objectContaining({ disableClose: false })
            );
        });

        it('should pass disableClose true when specified', async () => {
            setupTestBed();
            const promise = service.confirm({ title: 'Critical', disableClose: true });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(
                DialogShellComponent,
                expect.objectContaining({ disableClose: true })
            );
        });

        it('should apply tbx-dialog-panel panelClass', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(
                DialogShellComponent,
                expect.objectContaining({ panelClass: 'tbx-dialog-panel' })
            );
        });

        it('should set autoFocus to first-tabbable', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(
                DialogShellComponent,
                expect.objectContaining({ autoFocus: 'first-tabbable' })
            );
        });

        it('should set ariaModal to true', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(
                DialogShellComponent,
                expect.objectContaining({ ariaModal: true })
            );
        });

        it('should pass title and message through to shell data', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Hello', message: 'World' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            const shellData = getShellData();
            expect(shellData.config['title']).toBe('Hello');
            expect(shellData.config['message']).toBe('World');
        });
    });

    describe('fallback icons when TBX_MAT_DIALOG_ICON_SERVICE is not provided', () => {
        function setupWithoutIconService(): void {
            afterClosed$ = new Subject<unknown>();
            dialogSpy = {
                open: vi.fn().mockReturnValue({
                    afterClosed: () => afterClosed$.asObservable(),
                }),
            };
            TestBed.configureTestingModule({
                providers: [TbxMatDialogService, { provide: MatDialog, useValue: dialogSpy }],
            });
            service = TestBed.inject(TbxMatDialogService);
        }

        it('should use fallback icon for info() when icon service is missing', async () => {
            setupWithoutIconService();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBe('info_i');
        });

        it('should use fallback icon for warning() when icon service is missing', async () => {
            setupWithoutIconService();
            const promise = service.warning({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBe('exclamation');
        });

        it('should use fallback icon for error() when icon service is missing', async () => {
            setupWithoutIconService();
            const promise = service.error({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBe('exclamation');
        });

        it('should use fallback icon for confirm() when icon service is missing', async () => {
            setupWithoutIconService();
            const promise = service.confirm({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBe('question_mark');
        });

        it('should use fallback icon for input() when icon service is missing', async () => {
            setupWithoutIconService();
            const promise = service.input({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Cancel, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBe('info_i');
        });
    });

    describe('backdrop/Escape dismissal', () => {
        it('should return Close result when afterClosed emits undefined', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog(undefined);

            const output = await promise;
            expect(output.result).toBe(TbxMatDialogDismissReason.Close);
            expect(output.footerValues).toEqual({});
        });

        it('should return Close result when afterClosed emits null', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog(null);

            const output = await promise;
            expect(output.result).toBe(TbxMatDialogDismissReason.Close);
            expect(output.footerValues).toEqual({});
        });
    });
});
