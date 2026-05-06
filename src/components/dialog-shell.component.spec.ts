import { describe, it, expect, vi } from 'vitest';
import { Component, computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogShellComponent, type DialogShellData } from './dialog-shell.component';
import { TbxMatDialogDismissReason } from '../types/dialog-result.type';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
import {
    TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
    TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
} from '@teqbench/tbx-mat-icons';
import { type TbxMatDialogConfig, type TbxMatDialogData } from '../models/dialog.model';
import { type TbxMatDialogFooterButton } from '../models/dialog-footer.model';
import { type TbxMatDialogFooterControlType } from '../types/dialog-footer-control.type';
import {
    TBX_MAT_DIALOG_BUTTONS_OK,
    TBX_MAT_DIALOG_BUTTONS_OK_CANCEL,
    TBX_MAT_DIALOG_BUTTONS_YES_NO,
    TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL,
} from '../constants/dialog.constants';
import { TBX_MAT_DIALOG_PROVIDER_CONFIG } from '../tokens/dialog-provider-config.token';
import { TbxMatDialogSeverityFontIconService } from '../services/dialog-severity-font-icon.service';
import { type TbxMatDialogProviderConfig } from '../models/dialog-provider-config.model';

/**
 * Test component implementing TbxMatDialogData<string>.
 * Used to verify the shell's content component integration:
 *   - Dynamic creation via ViewContainerRef
 *   - isValid driving affirm button disabled state
 *   - value included in TbxMatDialogResult.data on affirm
 */
@Component({
    selector: 'tbx-test-input',
    template: `<input [value]="name()" (input)="name.set($any($event.target).value)" />`,
})
class TestInputComponent implements TbxMatDialogData<string> {
    readonly name = signal('');
    readonly isValid = computed(() => this.name().trim().length > 0);
    readonly value = computed(() => this.name().trim());
}

function buildDefaultProviderConfig(): TbxMatDialogProviderConfig {
    return {
        severityIconResolverService: new TbxMatDialogSeverityFontIconService(
            TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED
        ),
    };
}

function createFixture(
    config: Partial<TbxMatDialogConfig<unknown>>,
    footer?: readonly TbxMatDialogFooterControlType[],
    providerConfig: TbxMatDialogProviderConfig = buildDefaultProviderConfig()
): ComponentFixture<DialogShellComponent> {
    const fullConfig: TbxMatDialogConfig<unknown> = {
        title: 'Test Dialog',
        ...config,
    };

    const shellData: DialogShellData = {
        config: fullConfig,
        resolvedFooter: footer ?? [],
    };

    TestBed.configureTestingModule({
        imports: [DialogShellComponent, NoopAnimationsModule],
        providers: [
            { provide: MAT_DIALOG_DATA, useValue: shellData },
            { provide: MatDialogRef, useValue: { close: vi.fn() } },
            {
                provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
            },
            { provide: TBX_MAT_DIALOG_PROVIDER_CONFIG, useValue: providerConfig },
        ],
    });

    const fixture = TestBed.createComponent(DialogShellComponent);
    fixture.detectChanges();
    return fixture;
}

function getDialogRef(
    fixture: ComponentFixture<DialogShellComponent>
): MatDialogRef<DialogShellComponent> {
    return fixture.debugElement.injector.get(MatDialogRef);
}

/** Select the close button via its aria-label. */
function queryCloseButton(fixture: ComponentFixture<DialogShellComponent>) {
    return fixture.debugElement.query(By.css('button[aria-label="Close dialog"]'));
}

/** Helper to build a typed TbxMatDialogFooterButton with sensible defaults. */
function buildButton(overrides: Partial<TbxMatDialogFooterButton> = {}): TbxMatDialogFooterButton {
    return {
        key: 'test',
        type: 'button',
        label: 'Test',
        align: 'end',
        ...overrides,
    };
}

describe('DialogShellComponent', () => {
    describe('header', () => {
        it('should display the title', () => {
            const fixture = createFixture({ title: 'My Dialog' });

            const title = fixture.debugElement.query(By.css('[matDialogTitle]'));
            expect(title.nativeElement.textContent.trim()).toBe('My Dialog');
        });

        it('should display the consumer-overridden icon as a font ligature', () => {
            const fixture = createFixture({ title: 'Test', icon: 'warning' });

            const icon = fixture.debugElement.query(By.css('.tbx-mat-dialog-icon'));
            expect(icon).not.toBeNull();
            expect(icon.nativeElement.textContent.trim()).toBe('warning');
        });

        it('should display the severity-resolved icon when icon is not overridden', () => {
            // Every dialog renders a header icon — the severity resolver
            // always provides one. Consumers suppress the icon by overriding
            // the severity-icon resolver to return undefined for the level
            // (or by providing one that has no registration for the level).
            const fixture = createFixture({ title: 'Test' });

            const icon = fixture.debugElement.query(By.css('.tbx-mat-dialog-icon'));
            expect(icon).not.toBeNull();
        });

        it('should hide the icon when the resolver returns no icon for the level', () => {
            // Stub resolver with the same shape as a real severity resolver but
            // returning undefined for every level — verifies the component's
            // null-fall-through path.
            const noopMethod = (): undefined => undefined;
            const emptyResolver = {
                iconType: 0,
                resolve: noopMethod,
                default: noopMethod,
                success: noopMethod,
                error: noopMethod,
                warning: noopMethod,
                information: noopMethod,
                help: noopMethod,
            } as unknown as TbxMatDialogProviderConfig['severityIconResolverService'];
            const fixture = createFixture(
                { title: 'Test', type: TbxMatSeverityLevel.Default },
                undefined,
                { severityIconResolverService: emptyResolver }
            );

            const icon = fixture.debugElement.query(By.css('.tbx-mat-dialog-icon'));
            expect(icon).toBeNull();
        });

        it('should display the context badge when provided', () => {
            const fixture = createFixture({ title: 'Test', contextBadge: 'Beta' });

            const badge = fixture.debugElement.query(By.css('mat-chip'));
            expect(badge).not.toBeNull();
            expect(badge.nativeElement.textContent.trim()).toBe('Beta');
        });

        it('should not display the context badge when omitted', () => {
            const fixture = createFixture({ title: 'Test' });

            const badge = fixture.debugElement.query(By.css('mat-chip'));
            expect(badge).toBeNull();
        });

        it('should display the subtitle when provided', () => {
            const fixture = createFixture({ title: 'Test', subtitle: 'Some detail' });

            const subtitle = fixture.debugElement.query(By.css('.dialog-subtitle'));
            expect(subtitle).not.toBeNull();
            expect(subtitle.nativeElement.textContent.trim()).toBe('Some detail');
        });

        it('should not display the subtitle when omitted', () => {
            const fixture = createFixture({ title: 'Test' });

            const subtitle = fixture.debugElement.query(By.css('.dialog-subtitle'));
            expect(subtitle).toBeNull();
        });

        it('should have a close button with accessible aria-label', () => {
            const fixture = createFixture({ title: 'Test' });

            const closeBtn = queryCloseButton(fixture);
            expect(closeBtn).not.toBeNull();
            expect(closeBtn.nativeElement.getAttribute('aria-label')).toBe('Close dialog');
        });
    });

    describe('close button', () => {
        it('should close dialog with TbxMatDialogDismissReason.Close', () => {
            const fixture = createFixture({ title: 'Test' });
            const dialogRef = getDialogRef(fixture);

            queryCloseButton(fixture).nativeElement.click();

            expect(dialogRef.close).toHaveBeenCalledWith(
                expect.objectContaining({
                    result: TbxMatDialogDismissReason.Close,
                })
            );
        });

        it('should return empty footerValues when closing (negative action)', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                {
                    key: 'remember',
                    type: 'checkbox',
                    label: 'Remember',
                    align: 'start',
                    initialValue: true,
                },
            ];
            const fixture = createFixture({ title: 'Test' }, footer);
            const dialogRef = getDialogRef(fixture);

            queryCloseButton(fixture).nativeElement.click();

            expect(dialogRef.close).toHaveBeenCalledWith(
                expect.objectContaining({
                    result: 'close',
                    footerValues: {},
                })
            );
        });
    });

    describe('body', () => {
        it('should display the message when provided', () => {
            const fixture = createFixture({ title: 'Test', message: 'Hello world' });

            const message = fixture.debugElement.query(By.css('.dialog-message'));
            expect(message).not.toBeNull();
            expect(message.nativeElement.textContent.trim()).toBe('Hello world');
        });

        it('should not display a message when omitted', () => {
            const fixture = createFixture({ title: 'Test' });

            const message = fixture.debugElement.query(By.css('.dialog-message'));
            expect(message).toBeNull();
        });
    });

    describe('content component (input dialogs)', () => {
        it('should dynamically create content component when config.content is provided', () => {
            const fixture = createFixture({ title: 'Input', content: TestInputComponent }, [
                ...TBX_MAT_DIALOG_BUTTONS_OK_CANCEL,
            ]);

            const input = fixture.debugElement.query(By.css('tbx-test-input'));
            expect(input).not.toBeNull();
        });

        it('should not display message when content component is provided', () => {
            const fixture = createFixture(
                { title: 'Input', message: 'Ignored', content: TestInputComponent },
                [...TBX_MAT_DIALOG_BUTTONS_OK_CANCEL]
            );

            const message = fixture.debugElement.query(By.css('.dialog-message'));
            expect(message).toBeNull();
        });

        it('should disable affirm button when content isValid is false', () => {
            const fixture = createFixture({ title: 'Input', content: TestInputComponent }, [
                ...TBX_MAT_DIALOG_BUTTONS_OK_CANCEL,
            ]);

            // Content starts with empty name → isValid is false
            const affirmButton = fixture.debugElement
                .queryAll(By.css('mat-dialog-actions button'))
                .find((btn) => btn.nativeElement.textContent.trim() === 'OK');

            expect(affirmButton).not.toBeUndefined();
            expect(affirmButton!.nativeElement.disabled).toBe(true);
        });

        it('should enable affirm button when content isValid becomes true', () => {
            const fixture = createFixture({ title: 'Input', content: TestInputComponent }, [
                ...TBX_MAT_DIALOG_BUTTONS_OK_CANCEL,
            ]);

            // Set a value on the content component to make isValid true
            const testInput = fixture.debugElement.query(By.directive(TestInputComponent));
            testInput.componentInstance.name.set('hello');
            fixture.detectChanges();

            const affirmButton = fixture.debugElement
                .queryAll(By.css('mat-dialog-actions button'))
                .find((btn) => btn.nativeElement.textContent.trim() === 'OK');

            expect(affirmButton!.nativeElement.disabled).toBe(false);
        });

        it('should include content value in output on affirm', () => {
            const fixture = createFixture({ title: 'Input', content: TestInputComponent }, [
                ...TBX_MAT_DIALOG_BUTTONS_OK_CANCEL,
            ]);
            const dialogRef = getDialogRef(fixture);

            // Set a value on the content component
            const testInput = fixture.debugElement.query(By.directive(TestInputComponent));
            testInput.componentInstance.name.set('My Value');
            fixture.detectChanges();

            // Click OK
            const affirmButton = fixture.debugElement
                .queryAll(By.css('mat-dialog-actions button'))
                .find((btn) => btn.nativeElement.textContent.trim() === 'OK');
            affirmButton!.nativeElement.click();

            expect(dialogRef.close).toHaveBeenCalledWith(
                expect.objectContaining({
                    result: TbxMatDialogDismissReason.Affirm,
                    data: 'My Value',
                })
            );
        });

        it('should not include content value in output on cancel', () => {
            const fixture = createFixture({ title: 'Input', content: TestInputComponent }, [
                ...TBX_MAT_DIALOG_BUTTONS_OK_CANCEL,
            ]);
            const dialogRef = getDialogRef(fixture);

            // Set a value
            const testInput = fixture.debugElement.query(By.directive(TestInputComponent));
            testInput.componentInstance.name.set('My Value');
            fixture.detectChanges();

            // Click Cancel
            const cancelButton = fixture.debugElement
                .queryAll(By.css('mat-dialog-actions button'))
                .find((btn) => btn.nativeElement.textContent.trim() === 'Cancel');
            cancelButton!.nativeElement.click();

            expect(dialogRef.close).toHaveBeenCalledWith(
                expect.objectContaining({
                    result: TbxMatDialogDismissReason.Cancel,
                    data: undefined,
                })
            );
        });
    });

    describe('footer', () => {
        it('should not render footer when no items', () => {
            const fixture = createFixture({ title: 'Test' }, []);

            const footer = fixture.debugElement.query(By.css('mat-dialog-actions'));
            expect(footer).toBeNull();
        });

        it('should not render footer separator when no items', () => {
            const fixture = createFixture({ title: 'Test' }, []);

            const separators = fixture.debugElement.queryAll(
                By.css('mat-divider.dialog-separator')
            );
            expect(separators.length).toBe(1);
        });

        it('should render footer separator when items exist', () => {
            const fixture = createFixture({ title: 'Test' }, [...TBX_MAT_DIALOG_BUTTONS_OK]);

            const separators = fixture.debugElement.queryAll(
                By.css('mat-divider.dialog-separator')
            );
            expect(separators.length).toBe(2);
        });
    });

    describe('footer buttons', () => {
        it('should render button labels', () => {
            const fixture = createFixture({ title: 'Test' }, [...TBX_MAT_DIALOG_BUTTONS_YES_NO]);

            const buttons = fixture.debugElement.queryAll(By.css('mat-dialog-actions button'));
            expect(buttons.length).toBe(2);
            expect(buttons[0].nativeElement.textContent.trim()).toContain('No');
            expect(buttons[1].nativeElement.textContent.trim()).toContain('Yes');
        });

        it('should close dialog with button result on click', () => {
            const fixture = createFixture({ title: 'Test' }, [...TBX_MAT_DIALOG_BUTTONS_OK]);
            const dialogRef = getDialogRef(fixture);

            const button = fixture.debugElement.query(By.css('mat-dialog-actions button'));
            button.nativeElement.click();

            expect(dialogRef.close).toHaveBeenCalledWith(
                expect.objectContaining({
                    result: TbxMatDialogDismissReason.Affirm,
                })
            );
        });

        it('should not close dialog when button has no result', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({ key: 'custom', label: 'Custom', result: undefined }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);
            const dialogRef = getDialogRef(fixture);

            const button = fixture.debugElement.query(By.css('mat-dialog-actions button'));
            button.nativeElement.click();

            expect(dialogRef.close).not.toHaveBeenCalled();
        });

        it('should render button with icon', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({
                    key: 'delete',
                    label: 'Delete',
                    icon: 'delete',
                    result: TbxMatDialogDismissReason.Affirm,
                    emphasis: 'destructive',
                }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const icon = fixture.debugElement.query(By.css('mat-dialog-actions button mat-icon'));
            expect(icon).not.toBeNull();
            expect(icon.nativeElement.textContent.trim()).toBe('delete');
        });

        it('should place icon before label by default (no iconPositionEnd)', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({
                    key: 'save',
                    label: 'Save',
                    icon: 'save',
                    result: TbxMatDialogDismissReason.Affirm,
                    emphasis: 'primary',
                }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const icon = fixture.debugElement.query(By.css('mat-dialog-actions button mat-icon'));
            expect(icon.nativeElement.hasAttribute('iconpositionend')).toBe(false);
        });

        it('should place icon after label when iconPosition is after (iconPositionEnd)', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({
                    key: 'next',
                    label: 'Next',
                    icon: 'arrow_forward',
                    iconPosition: 'after',
                    result: TbxMatDialogDismissReason.Affirm,
                    emphasis: 'primary',
                }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const icon = fixture.debugElement.query(By.css('mat-dialog-actions button mat-icon'));
            expect(icon.nativeElement.hasAttribute('iconpositionend')).toBe(true);
        });

        it('should disable button when disabled is true', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({
                    key: 'ok',
                    label: 'OK',
                    result: TbxMatDialogDismissReason.Affirm,
                    disabled: true,
                }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const button = fixture.debugElement.query(By.css('mat-dialog-actions button'));
            expect(button.nativeElement.disabled).toBe(true);
        });

        it('should not disable button when disabled is false', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({
                    key: 'ok',
                    label: 'OK',
                    result: TbxMatDialogDismissReason.Affirm,
                    disabled: false,
                }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const button = fixture.debugElement.query(By.css('mat-dialog-actions button'));
            expect(button.nativeElement.disabled).toBe(false);
        });

        it('should disable button when disabled is a Signal returning true', () => {
            const disabledSignal = signal(true);
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({
                    key: 'ok',
                    label: 'OK',
                    result: TbxMatDialogDismissReason.Affirm,
                    disabled: disabledSignal,
                }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const button = fixture.debugElement.query(By.css('mat-dialog-actions button'));
            expect(button.nativeElement.disabled).toBe(true);
        });

        it('should enable button when disabled Signal returns false', () => {
            const disabledSignal = signal(false);
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({
                    key: 'ok',
                    label: 'OK',
                    result: TbxMatDialogDismissReason.Affirm,
                    disabled: disabledSignal,
                }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const button = fixture.debugElement.query(By.css('mat-dialog-actions button'));
            expect(button.nativeElement.disabled).toBe(false);
        });
    });

    describe('footer controls', () => {
        it('should render checkbox with label', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                { key: 'remember', type: 'checkbox', label: 'Remember me', align: 'start' },
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));
            expect(checkbox).not.toBeNull();
            expect(checkbox.nativeElement.textContent.trim()).toContain('Remember me');
        });

        it('should initialize checkbox from initialValue', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                {
                    key: 'opt',
                    type: 'checkbox',
                    label: 'Opt in',
                    align: 'start',
                    initialValue: true,
                },
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            expect(fixture.componentInstance.getFooterValue('opt')).toBe(true);
        });

        it('should default checkbox to false when initialValue omitted', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                { key: 'opt', type: 'checkbox', label: 'Opt in', align: 'start' },
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            expect(fixture.componentInstance.getFooterValue('opt')).toBe(false);
        });

        it('should render slide toggle with label', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                { key: 'dark', type: 'toggle', label: 'Dark mode', align: 'start' },
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const toggle = fixture.debugElement.query(By.css('mat-slide-toggle'));
            expect(toggle).not.toBeNull();
            expect(toggle.nativeElement.textContent.trim()).toContain('Dark mode');
        });

        it('should initialize radio-group from initialValue', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                {
                    key: 'size',
                    type: 'radio-group',
                    align: 'start',
                    options: [
                        { label: 'Small', value: 'sm' },
                        { label: 'Large', value: 'lg' },
                    ],
                    initialValue: 'lg',
                },
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            expect(fixture.componentInstance.getFooterValue('size')).toBe('lg');
        });

        it('should default radio-group to null when initialValue omitted', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                {
                    key: 'size',
                    type: 'radio-group',
                    align: 'start',
                    options: [
                        { label: 'Small', value: 'sm' },
                        { label: 'Large', value: 'lg' },
                    ],
                },
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            expect(fixture.componentInstance.getFooterValue('size')).toBeNull();
        });

        it('should initialize toggle-group from initialValue', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                {
                    key: 'view',
                    type: 'toggle-group',
                    align: 'end',
                    options: [
                        { label: 'Grid', value: 'grid' },
                        { label: 'List', value: 'list' },
                    ],
                    initialValue: 'grid',
                },
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            expect(fixture.componentInstance.getFooterValue('view')).toBe('grid');
        });

        it('should default single-select toggle-group to null when initialValue omitted', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                {
                    key: 'view',
                    type: 'toggle-group',
                    align: 'end',
                    options: [
                        { label: 'Grid', value: 'grid' },
                        { label: 'List', value: 'list' },
                    ],
                },
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            expect(fixture.componentInstance.getFooterValue('view')).toBeNull();
        });

        it('should default multi-select toggle-group to empty array when initialValue omitted', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                {
                    key: 'tags',
                    type: 'toggle-group',
                    align: 'end',
                    multiple: true,
                    options: [
                        { label: 'A', value: 'a' },
                        { label: 'B', value: 'b' },
                    ],
                },
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            expect(fixture.componentInstance.getFooterValue('tags')).toEqual([]);
        });

        it('should include updated footer values when button closes dialog', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                {
                    key: 'dontAsk',
                    type: 'checkbox',
                    label: "Don't ask again",
                    align: 'start',
                },
                ...TBX_MAT_DIALOG_BUTTONS_OK,
            ];
            const fixture = createFixture({ title: 'Test' }, footer);
            const dialogRef = getDialogRef(fixture);

            fixture.componentInstance.setFooterValue('dontAsk', true);
            fixture.detectChanges();

            const okButton = fixture.debugElement.queryAll(By.css('mat-dialog-actions button'));
            const lastButton = okButton[okButton.length - 1];
            lastButton.nativeElement.click();

            expect(dialogRef.close).toHaveBeenCalledWith(
                expect.objectContaining({
                    result: TbxMatDialogDismissReason.Affirm,
                    footerValues: { dontAsk: true },
                })
            );
        });
    });

    describe('footer layout', () => {
        it('should apply margin-left auto to first end-aligned item', () => {
            const fixture = createFixture({ title: 'Test' }, [
                ...TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL,
            ]);

            expect(fixture.componentInstance.firstEndIndex()).toBe(1);
        });

        it('should return -1 when all items are start-aligned', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                { key: 'a', type: 'checkbox', label: 'A', align: 'start' },
                { key: 'b', type: 'checkbox', label: 'B', align: 'start' },
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            expect(fixture.componentInstance.firstEndIndex()).toBe(-1);
        });

        it('should return 0 when all items are end-aligned', () => {
            const fixture = createFixture({ title: 'Test' }, [...TBX_MAT_DIALOG_BUTTONS_YES_NO]);

            expect(fixture.componentInstance.firstEndIndex()).toBe(0);
        });
    });

    describe('severity', () => {
        // Severity-driven color tokens are now applied via the per-severity
        // panel class on the MatDialog overlay (set by `TbxMatDialogService`),
        // not via a host attribute on the shell component. The component
        // surfaces severity only through `severityIcon` resolution. The
        // panelClass-per-severity behavior is covered in dialog.service.spec.

        it('should not bind a data-emphasis attribute on the host', () => {
            const fixture = createFixture({
                title: 'Test',
                icon: 'info',
                type: TbxMatSeverityLevel.Error,
            });

            const host = fixture.nativeElement as HTMLElement;
            expect(host.hasAttribute('data-emphasis')).toBe(false);
        });

        it('should render the icon container when an icon is resolved', () => {
            const fixture = createFixture({
                title: 'Test',
                icon: 'info',
                type: TbxMatSeverityLevel.Error,
            });

            const icon = fixture.debugElement.query(By.css('.tbx-mat-dialog-icon'));
            expect(icon).not.toBeNull();
        });
    });

    describe('button emphasis rendering', () => {
        it('should render primary button as filled', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({ emphasis: 'primary', result: TbxMatDialogDismissReason.Affirm }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const button = fixture.debugElement.query(
                By.css('mat-dialog-actions button[matButton="filled"]')
            );
            expect(button).not.toBeNull();
        });

        it('should render destructive button as filled', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({ emphasis: 'destructive', result: TbxMatDialogDismissReason.Affirm }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const button = fixture.debugElement.query(
                By.css('mat-dialog-actions button[matButton="filled"]')
            );
            expect(button).not.toBeNull();
        });

        it('should render text button as text', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({ emphasis: 'text', result: TbxMatDialogDismissReason.Cancel }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const button = fixture.debugElement.query(
                By.css('mat-dialog-actions button[matButton="text"]')
            );
            expect(button).not.toBeNull();
        });

        it('should render button without emphasis as text', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({ result: TbxMatDialogDismissReason.Cancel }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const button = fixture.debugElement.query(
                By.css('mat-dialog-actions button[matButton="text"]')
            );
            expect(button).not.toBeNull();
        });

        // Primary buttons no longer carry a dedicated class — Material's
        // filled-container/label tokens are overridden at the panel level
        // by `_severity-panel` in `_tbx-mat-dialogs.scss` (mirroring how
        // banners/notifications style their action buttons), so any
        // `matButton="filled"` button on the dialog inherits the severity
        // styling automatically. Only `destructive` keeps an explicit
        // class because it forces the Error severity tokens regardless of
        // the dialog's own type.

        it('should apply tbx-mat-dialog-btn-destructive class to destructive button', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({ emphasis: 'destructive', result: TbxMatDialogDismissReason.Affirm }),
            ];
            const fixture = createFixture(
                { title: 'Test', type: TbxMatSeverityLevel.Default },
                footer
            );

            const button = fixture.debugElement.query(By.css('mat-dialog-actions button'));
            expect(button.nativeElement.classList.contains('tbx-mat-dialog-btn-destructive')).toBe(
                true
            );
        });

        it('should not apply destructive class to a primary button', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({ emphasis: 'primary', result: TbxMatDialogDismissReason.Affirm }),
            ];
            const fixture = createFixture(
                { title: 'Test', type: TbxMatSeverityLevel.Warning },
                footer
            );

            const button = fixture.debugElement.query(By.css('mat-dialog-actions button'));
            expect(button.nativeElement.classList.contains('tbx-mat-dialog-btn-destructive')).toBe(
                false
            );
        });

        it('should not apply destructive class to a text button', () => {
            const footer: TbxMatDialogFooterControlType[] = [
                buildButton({ emphasis: 'text', result: TbxMatDialogDismissReason.Cancel }),
            ];
            const fixture = createFixture({ title: 'Test' }, footer);

            const button = fixture.debugElement.query(By.css('mat-dialog-actions button'));
            expect(button.nativeElement.classList.contains('tbx-mat-dialog-btn-destructive')).toBe(
                false
            );
        });
    });
});
