import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatDialogService, TbxMatDialogDismissReason, TBX_MAT_DIALOG_BUTTONS_YES_NO, TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL, type TbxMatDialogFooterControlType } from '../../index';

@Component({
    selector: 'tbx-dialog-confirm-harness',
    imports: [MatButtonModule, JsonPipe],
    template: `
        <div class="harness">
            <div class="instructions">
                <p><strong>Confirm dialogs</strong> are the dialog-specific UX wrapper for binary "are you sure?" interactions, layered on top of the severity model. <code>TbxMatDialogService.confirm()</code> defaults to <code>TbxMatSeverityLevel.Help</code> with the <code>TBX_MAT_DIALOG_BUTTONS_YES_NO</code> preset; pass a <code>footer</code> override to swap in a different button preset (e.g. <code>TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL</code>) or to add form controls (checkbox, toggle, radio group, toggle group) whose values are returned alongside the dismiss reason in <code>TbxMatDialogResult.footerValues</code>.</p>
                <p>Click any button below to open the corresponding confirm dialog. The result panel at the bottom shows the dismiss reason returned to the caller; for confirms with footer controls, the panel also shows the collected form values. Backdrop click and <kbd>Escape</kbd> both emit <code>Close</code> with empty <code>footerValues</code> — negative dismissals never carry form state that implies confirmation.</p>
            </div>

            <h3>Basic — Yes / No</h3>
            <p class="theme-note">Default footer preset (<code>TBX_MAT_DIALOG_BUTTONS_YES_NO</code>): both buttons right-aligned, Yes is primary.</p>
            <div class="button-group">
                <button mat-flat-button (click)="confirmYesNo()">Confirm Yes / No</button>
            </div>

            <h3>With Cancel — Yes / No / Cancel</h3>
            <p class="theme-note">Pass <code>footer: TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL</code> when the user needs a third "back out without committing" option.</p>
            <div class="button-group">
                <button mat-flat-button (click)="confirmYesNoCancel()">Confirm Yes / No / Cancel</button>
            </div>

            <h3>With Don't-Ask-Again Checkbox</h3>
            <p class="theme-note">A start-aligned checkbox alongside the buttons. The checkbox value is keyed on <code>dontAskAgain</code> and returned in <code>footerValues</code>.</p>
            <div class="button-group">
                <button mat-flat-button (click)="confirmWithCheckbox()">Confirm with Checkbox</button>
            </div>

            <h3>With Verbose Logging Toggle</h3>
            <p class="theme-note">A slide toggle is visually distinct from a checkbox — use it when the option is a clear on/off switch rather than a one-shot acknowledgement.</p>
            <div class="button-group">
                <button mat-flat-button (click)="confirmWithToggle()">Confirm with Toggle</button>
            </div>

            <h3>With Format Selection Radio Group</h3>
            <p class="theme-note">Single-select from a small set of options. The selected value is returned as a string under the radio group's <code>key</code>.</p>
            <div class="button-group">
                <button mat-flat-button (click)="confirmWithRadioGroup()">Confirm with Radio Group</button>
            </div>

            <h3>With Channel Toggle Group (Multi-Select)</h3>
            <p class="theme-note">Multi-select toggle group with <code>multiple: true</code>. The result is a <code>string[]</code> of the selected option values.</p>
            <div class="button-group">
                <button mat-flat-button (click)="confirmWithToggleGroup()">Confirm with Toggle Group</button>
            </div>

            <h3>With Mixed Controls</h3>
            <p class="theme-note">Multiple form controls collected together. Each control declares its own <code>key</code>, so the returned <code>footerValues</code> object has one property per control.</p>
            <div class="button-group">
                <button mat-flat-button (click)="confirmWithMixed()">Confirm with Mixed Controls</button>
            </div>

            @if (lastResult()) {
                <div class="result-panel">
                    <h3>Last Result</h3>
                    <pre>{{ lastResult() | json }}</pre>
                </div>
            }
        </div>
    `,
    styles: `
        :host {
            display: block;
            background: var(--mat-sys-surface);
            color: var(--mat-sys-on-surface);
            min-height: 100vh;
        }
        .harness {
            font-family: Roboto, sans-serif;
            padding: 1.5rem;
        }
        h3 {
            margin: 1.5rem 0 0.5rem;
        }
        h3:first-of-type {
            margin-top: 0;
        }
        .instructions {
            font-size: 0.875rem;
            color: #555;
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 0.75rem 1rem;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        .instructions code {
            background: #eef2ff;
            color: #4338ca;
            padding: 0.1em 0.35em;
            border-radius: 3px;
            font-size: 0.9em;
        }
        .instructions p {
            margin: 0 0 0.5rem;
        }
        .instructions p:last-child {
            margin-bottom: 0;
        }
        .button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .theme-note {
            font-size: 0.8125rem;
            color: #666;
            border-left: 3px solid #ddd;
            padding: 0.25rem 0.75rem;
            margin: 0 0 0.75rem;
        }
        .theme-note code {
            background: #eef2ff;
            color: #4338ca;
            padding: 0.1em 0.35em;
            border-radius: 3px;
            font-size: 0.9em;
        }
        .result-panel {
            margin-top: 1.5rem;
            background: #f0f4ff;
            border-left: 3px solid #1565c0;
            padding: 0.5rem 0.75rem;
        }
        .result-panel pre {
            font-size: 0.8125rem;
            margin: 0.25rem 0 0;
            white-space: pre-wrap;
        }
    `,
})
class DialogConfirmHarnessComponent {
    private readonly dialog = inject(TbxMatDialogService);
    readonly lastResult = signal<unknown>(null);

    async confirmYesNo(): Promise<void> {
        const output = await this.dialog.confirm({
            title: 'Delete Project?',
            message: 'This action cannot be undone. All data associated with this project will be permanently removed.',
        });
        this.lastResult.set({ result: output.result, footerValues: output.footerValues });
    }

    async confirmYesNoCancel(): Promise<void> {
        const output = await this.dialog.confirm({
            title: 'Discard Draft?',
            message: 'You have an unsaved draft. Would you like to save it before closing, or cancel and stay on this page?',
            footer: TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL,
        });
        this.lastResult.set({ result: output.result, footerValues: output.footerValues });
    }

    async confirmWithCheckbox(): Promise<void> {
        const footer: readonly TbxMatDialogFooterControlType[] = [{ key: 'dontAskAgain', type: 'checkbox', label: "Don't ask me again", align: 'start' }, ...TBX_MAT_DIALOG_BUTTONS_YES_NO];
        const output = await this.dialog.confirm<{ dontAskAgain: boolean }>({
            title: 'Enable Notifications?',
            message: 'Would you like to receive notifications for this project?',
            footer,
        });
        this.lastResult.set({ result: output.result, footerValues: output.footerValues });
    }

    async confirmWithToggle(): Promise<void> {
        const footer: readonly TbxMatDialogFooterControlType[] = [{ key: 'verbose', type: 'toggle', label: 'Verbose logging', align: 'start' }, ...TBX_MAT_DIALOG_BUTTONS_YES_NO];
        const output = await this.dialog.confirm<{ verbose: boolean }>({
            title: 'Run Diagnostics?',
            message: 'Run a full system diagnostic. Verbose logging captures additional debug information for support tickets.',
            footer,
        });
        this.lastResult.set({ result: output.result, footerValues: output.footerValues });
    }

    async confirmWithRadioGroup(): Promise<void> {
        const footer: readonly TbxMatDialogFooterControlType[] = [
            {
                key: 'format',
                type: 'radio-group',
                align: 'start',
                options: [
                    { label: 'JSON', value: 'json' },
                    { label: 'CSV', value: 'csv' },
                    { label: 'XML', value: 'xml' },
                ],
                initialValue: 'json',
            },
            ...TBX_MAT_DIALOG_BUTTONS_YES_NO,
        ];
        const output = await this.dialog.confirm<{ format: string }>({
            title: 'Export Project?',
            message: 'Choose an export format and confirm. The selected option is returned alongside the dismiss reason.',
            footer,
        });
        this.lastResult.set({ result: output.result, footerValues: output.footerValues });
    }

    async confirmWithToggleGroup(): Promise<void> {
        const footer: readonly TbxMatDialogFooterControlType[] = [
            {
                key: 'channels',
                type: 'toggle-group',
                align: 'start',
                multiple: true,
                options: [
                    { label: 'Email', value: 'email' },
                    { label: 'SMS', value: 'sms' },
                    { label: 'Push', value: 'push' },
                ],
                initialValue: ['email'],
            },
            ...TBX_MAT_DIALOG_BUTTONS_YES_NO,
        ];
        const output = await this.dialog.confirm<{ channels: string[] }>({
            title: 'Subscribe to Updates?',
            message: 'Choose one or more notification channels. The selection is returned as a string array.',
            footer,
        });
        this.lastResult.set({ result: output.result, footerValues: output.footerValues });
    }

    async confirmWithMixed(): Promise<void> {
        const footer: readonly TbxMatDialogFooterControlType[] = [
            { key: 'autoUpdate', type: 'checkbox', label: 'Auto-update', align: 'start', initialValue: true },
            {
                key: 'channel',
                type: 'radio-group',
                align: 'start',
                options: [
                    { label: 'Stable', value: 'stable' },
                    { label: 'Beta', value: 'beta' },
                ],
                initialValue: 'stable',
            },
            { key: 'cancel', type: 'button', label: 'Cancel', result: TbxMatDialogDismissReason.Cancel, align: 'end' },
            { key: 'apply', type: 'button', label: 'Apply', emphasis: 'primary', result: TbxMatDialogDismissReason.Affirm, align: 'end' },
        ];
        const output = await this.dialog.confirm<{ autoUpdate: boolean; channel: string }>({
            title: 'Update Preferences',
            message: 'Choose how often updates are applied and which release channel to follow.',
            // Widened from the 30rem default so the four-item footer (checkbox + radio
            // group + Cancel + Apply) fits on a single row without wrapping. With
            // wrapping enabled, the first end-aligned button (Cancel) gets stranded
            // on the controls row by `margin-left: auto` while the primary Apply
            // button drops alone to a second row — visually awkward.
            width: '42rem',
            footer,
        });
        this.lastResult.set({ result: output.result, footerValues: output.footerValues });
    }
}

const meta: Meta<DialogConfirmHarnessComponent> = {
    title: 'Dialogs',
    tags: ['dialogs'],
    component: DialogConfirmHarnessComponent,
    decorators: [moduleMetadata({ imports: [DialogConfirmHarnessComponent] })],
};

export default meta;
type Story = StoryObj<DialogConfirmHarnessComponent>;

export const Confirm: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Dialog-specific UX patterns for binary "are you sure?" interactions, layered on top of the severity model. `confirm()` defaults to Help severity with Yes/No buttons; pass a `footer` override to swap presets or add form controls (checkbox, toggle, radio group, toggle group) whose values are returned in `TbxMatDialogResult.footerValues`.',
            },
        },
    },
};
