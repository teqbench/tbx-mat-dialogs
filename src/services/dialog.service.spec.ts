import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
import { TbxMatDialogService } from './dialog.service';
import { DialogShellComponent } from '../components/dialog-shell.component';
import { TbxMatDialogDismissReason } from '../types/dialog-result.type';
import { TBX_MAT_DIALOG_BUTTONS_OK, TBX_MAT_DIALOG_BUTTONS_OK_CANCEL, TBX_MAT_DIALOG_BUTTONS_YES_NO, TBX_MAT_DIALOG_DEFAULT_WIDTH } from '../constants/dialog.constants';

/**
 * Service-level tests focus on what the service is responsible for:
 *   - applying severity-type defaults via mergeDefaults()
 *   - applying footer presets per dialog method
 *   - passing the correct config + dialog options to MatDialog.open()
 *   - returning a Close result when the dialog is dismissed without a value
 *
 * Icon resolution is no longer the service's concern — `DialogShellComponent`
 * resolves both the severity icon and the close icon via
 * `TBX_MAT_DIALOG_PROVIDER_CONFIG`. Icon-related assertions live in the
 * component spec.
 */
describe('TbxMatDialogService', () => {
    let service: TbxMatDialogService;
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
            providers: [TbxMatDialogService, { provide: MatDialog, useValue: dialogSpy }],
        });

        service = TestBed.inject(TbxMatDialogService);
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

    describe('show()', () => {
        it('should pass config through with no defaults applied', async () => {
            setupTestBed();
            const promise = service.show({
                title: 'Custom',
                icon: 'build',
                type: TbxMatSeverityLevel.Warning,
                message: 'Full control.',
            });
            resolveDialog({ result: TbxMatDialogDismissReason.Close, footerValues: {} });
            await promise;

            const shellData = getShellData();
            expect(shellData.config['title']).toBe('Custom');
            expect(shellData.config['icon']).toBe('build');
            expect(shellData.config['type']).toBe(TbxMatSeverityLevel.Warning);
            expect(shellData.config['message']).toBe('Full control.');
        });

        it('should not apply default icon when omitted', async () => {
            setupTestBed();
            const promise = service.show({ title: 'No Icon' });
            resolveDialog({ result: TbxMatDialogDismissReason.Close, footerValues: {} });
            await promise;

            expect(getShellData().config['icon']).toBeUndefined();
        });

        it('should not apply default type when omitted', async () => {
            setupTestBed();
            const promise = service.show({ title: 'No Type' });
            resolveDialog({ result: TbxMatDialogDismissReason.Close, footerValues: {} });
            await promise;

            expect(getShellData().config['type']).toBeUndefined();
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

    describe('severity methods', () => {
        const cases = [
            { method: 'success', severity: TbxMatSeverityLevel.Success },
            { method: 'error', severity: TbxMatSeverityLevel.Error },
            { method: 'warning', severity: TbxMatSeverityLevel.Warning },
            { method: 'information', severity: TbxMatSeverityLevel.Information },
            { method: 'help', severity: TbxMatSeverityLevel.Help },
            { method: 'default', severity: TbxMatSeverityLevel.Default },
        ] as const;

        for (const { method, severity } of cases) {
            describe(`${method}()`, () => {
                it(`should default to ${severity} severity`, async () => {
                    setupTestBed();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const promise = (service as any)[method]({ title: 'Test' });
                    resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
                    await promise;

                    expect(getShellData().config['type']).toBe(severity);
                });

                it('should default to TBX_MAT_DIALOG_BUTTONS_OK footer', async () => {
                    setupTestBed();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const promise = (service as any)[method]({ title: 'Test' });
                    resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
                    await promise;

                    expect(getShellData().resolvedFooter).toEqual(TBX_MAT_DIALOG_BUTTONS_OK);
                });

                it('should not pre-compute icon when no override is given', async () => {
                    setupTestBed();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const promise = (service as any)[method]({ title: 'Test' });
                    resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
                    await promise;

                    expect(getShellData().config['icon']).toBeUndefined();
                });

                it('should preserve a caller-provided icon override', async () => {
                    setupTestBed();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const promise = (service as any)[method]({
                        title: 'Test',
                        icon: 'celebration',
                    });
                    resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
                    await promise;

                    expect(getShellData().config['icon']).toBe('celebration');
                });

                it('should preserve a caller-provided type override', async () => {
                    setupTestBed();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const promise = (service as any)[method]({
                        title: 'Test',
                        type: TbxMatSeverityLevel.Warning,
                    });
                    resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
                    await promise;

                    expect(getShellData().config['type']).toBe(TbxMatSeverityLevel.Warning);
                });
            });
        }
    });

    describe('confirm()', () => {
        it('should default to Help severity', async () => {
            setupTestBed();
            const promise = service.confirm({ title: 'Continue?' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(getShellData().config['type']).toBe(TbxMatSeverityLevel.Help);
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
        it('should default to Information severity', async () => {
            setupTestBed();
            const promise = service.input({ title: 'Rename' });
            resolveDialog({ result: TbxMatDialogDismissReason.Cancel, footerValues: {} });
            await promise;

            expect(getShellData().config['type']).toBe(TbxMatSeverityLevel.Information);
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

    describe('dialog configuration', () => {
        it('should use default width when not specified', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(DialogShellComponent, expect.objectContaining({ width: TBX_MAT_DIALOG_DEFAULT_WIDTH }));
        });

        it('should use custom width when specified', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test', width: '600px' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(DialogShellComponent, expect.objectContaining({ width: '600px' }));
        });

        it('should set disableClose to false by default', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(DialogShellComponent, expect.objectContaining({ disableClose: false }));
        });

        it('should pass disableClose true when specified', async () => {
            setupTestBed();
            const promise = service.confirm({ title: 'Critical', disableClose: true });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(DialogShellComponent, expect.objectContaining({ disableClose: true }));
        });

        it('should apply tbx-mat-dialog-panel and per-severity panel classes', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(
                DialogShellComponent,
                expect.objectContaining({
                    panelClass: ['tbx-mat-dialog-panel', 'tbx-mat-dialog-panel-information'],
                })
            );
        });

        it('should apply default-severity panel class when type is omitted on show()', async () => {
            setupTestBed();
            const promise = service.show({ title: 'Bare' });
            resolveDialog({ result: TbxMatDialogDismissReason.Close, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(
                DialogShellComponent,
                expect.objectContaining({
                    panelClass: ['tbx-mat-dialog-panel', 'tbx-mat-dialog-panel-default'],
                })
            );
        });

        it('should set autoFocus to first-tabbable', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(DialogShellComponent, expect.objectContaining({ autoFocus: 'first-tabbable' }));
        });

        it('should set ariaModal to true', async () => {
            setupTestBed();
            const promise = service.information({ title: 'Test' });
            resolveDialog({ result: TbxMatDialogDismissReason.Affirm, footerValues: {} });
            await promise;

            expect(dialogSpy.open).toHaveBeenCalledWith(DialogShellComponent, expect.objectContaining({ ariaModal: true }));
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
