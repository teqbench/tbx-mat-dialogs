import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatDialogService } from '../services/dialog.service';
import { TbxMatDialogEmphasisType } from '../types/dialog-emphasis.type';
import { TbxMatDialogDismissReason } from '../types/dialog-result.type';
import {
    TBX_MAT_DIALOG_BUTTONS_OK,
    TBX_MAT_DIALOG_BUTTONS_YES_NO,
    TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL,
} from '../constants/dialog.constants';
import { type TbxMatDialogFooterControlType } from '../types/dialog-footer-control.type';
import { type TbxMatDialogData } from '../models/dialog.model';

/**
 * Demo input component implementing TbxMatDialogData<StoryInputData>.
 *
 * Lives inside the stories file (not exported from the package) so the
 * Input story can demonstrate the input dialog flow without exposing a
 * sample/reference component on the public API surface — matching how
 * tbx-mat-banners and tbx-mat-notifications keep example UI inside their
 * stories files.
 */
interface StoryInputData {
    readonly firstName: string;
    readonly lastName: string;
    readonly address: string;
}

@Component({
    selector: 'tbx-story-input',
    imports: [FormsModule, MatFormFieldModule, MatInputModule],
    template: `
        <div class="story-input-form">
            <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input
                    matInput
                    cdkFocusInitial
                    required
                    [ngModel]="firstName()"
                    (ngModelChange)="firstName.set($event)"
                    placeholder="Enter first name"
                />
            </mat-form-field>
            <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input
                    matInput
                    required
                    [ngModel]="lastName()"
                    (ngModelChange)="lastName.set($event)"
                    placeholder="Enter last name"
                />
            </mat-form-field>
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
                <mat-label>Address</mat-label>
                <input
                    matInput
                    [ngModel]="address()"
                    (ngModelChange)="address.set($event)"
                    placeholder="Enter address (optional)"
                />
            </mat-form-field>
        </div>
    `,
    styles: `
        .story-input-form {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .story-input-form mat-form-field {
            width: 100%;
        }
    `,
})
class StoryInputComponent implements TbxMatDialogData<StoryInputData> {
    readonly firstName = signal('');
    readonly lastName = signal('');
    readonly address = signal('');

    readonly isValid = computed(
        () => this.firstName().trim().length > 0 && this.lastName().trim().length > 0
    );

    readonly value = computed<StoryInputData>(() => ({
        firstName: this.firstName().trim(),
        lastName: this.lastName().trim(),
        address: this.address().trim(),
    }));
}

/**
 * Wrapper component that exposes buttons to trigger dialogs.
 * Dialogs render in the CDK overlay (outside the component tree),
 * so we trigger them programmatically via TbxMatDialogService.
 */
@Component({
    selector: 'tbx-dialog-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            <p class="theme-note">
                Theme: Angular Material prebuilt <strong>Azure Blue</strong>. Dialog emphasis colors
                are independent of the M3 theme palette.
            </p>

            <h3>Dialog Types</h3>
            <div class="button-group">
                <button mat-flat-button (click)="showInformation()">Information</button>
                <button mat-flat-button (click)="showWarning()">Warning</button>
                <button mat-flat-button (click)="showError()">Error</button>
                <button mat-flat-button (click)="showConfirm()">Confirm</button>
                <button mat-flat-button (click)="showInput()">Input</button>
            </div>

            <h3>Variations</h3>
            <div class="button-group">
                <button mat-flat-button (click)="showWithSubtitle()">With Subtitle</button>
                <button mat-flat-button (click)="showWithContextBadge()">With Badge</button>
                <button mat-flat-button (click)="showConfirmWithCancel()">Yes / No / Cancel</button>
                <button mat-flat-button (click)="showDestructive()">Destructive</button>
            </div>

            <h3>Footer Controls</h3>
            <div class="button-group">
                <button mat-flat-button (click)="showWithCheckbox()">With Checkbox</button>
                <button mat-flat-button (click)="showWithToggle()">With Toggle</button>
                <button mat-flat-button (click)="showWithRadio()">With Radio</button>
            </div>

            <h3>Custom</h3>
            <div class="button-group">
                <button mat-flat-button (click)="showCustom()">Full Control (show)</button>
            </div>

            @if (lastResult()) {
                <p class="state">Last result: {{ lastResult() }}</p>
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

        .button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .theme-note {
            font-size: 0.8125rem;
            color: var(--mat-sys-on-surface-variant);
            border-left: 3px solid var(--mat-sys-outline-variant);
            padding: 0.25rem 0.75rem;
            margin: 0 0 1rem;
        }

        .state {
            margin-top: 1rem;
            font-size: 0.875rem;
            color: var(--mat-sys-on-surface-variant);
        }
    `,
})
class DialogHarnessComponent {
    private readonly dialog = inject(TbxMatDialogService);
    readonly lastResult = signal('');

    async showInformation(): Promise<void> {
        const output = await this.dialog.information({
            title: 'Session Expired',
            message: 'Your session has expired. Please sign in again to continue working.',
        });
        this.lastResult.set(output.result);
    }

    async showWarning(): Promise<void> {
        const output = await this.dialog.warning({
            title: 'Unsaved Changes',
            message:
                'You have unsaved changes that will be lost if you navigate away. Are you sure you want to leave this page?',
        });
        this.lastResult.set(output.result);
    }

    async showError(): Promise<void> {
        const output = await this.dialog.error({
            title: 'Save Failed',
            message:
                'Could not save your changes. The server returned an unexpected error. Please try again or contact support if the problem persists.',
        });
        this.lastResult.set(output.result);
    }

    async showConfirm(): Promise<void> {
        const output = await this.dialog.confirm({
            title: 'Delete Project?',
            message:
                'This action cannot be undone. All data associated with this project will be permanently removed.',
        });
        this.lastResult.set(output.result);
    }

    async showInput(): Promise<void> {
        const output = await this.dialog.input<StoryInputData>({
            title: 'Enter Details',
            content: StoryInputComponent,
        });
        this.lastResult.set(
            output.result === TbxMatDialogDismissReason.Affirm
                ? `${output.result}: ${JSON.stringify(output.data)}`
                : output.result
        );
    }

    async showWithSubtitle(): Promise<void> {
        const output = await this.dialog.information({
            title: 'System Update',
            subtitle: 'Version 2.4.0 is now available',
            message:
                'A new version is available with performance improvements and bug fixes. The update will be applied automatically during the next maintenance window.',
        });
        this.lastResult.set(output.result);
    }

    async showWithContextBadge(): Promise<void> {
        const output = await this.dialog.information({
            title: 'Feature Preview',
            contextBadge: 'Beta',
            message:
                'This feature is currently in beta. Some functionality may change before the final release.',
        });
        this.lastResult.set(output.result);
    }

    async showConfirmWithCancel(): Promise<void> {
        const output = await this.dialog.confirm({
            title: 'Discard Draft?',
            message: 'You have an unsaved draft. Would you like to save it before closing?',
            footer: TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL,
        });
        this.lastResult.set(output.result);
    }

    async showDestructive(): Promise<void> {
        const destructiveButtons: readonly TbxMatDialogFooterControlType[] = [
            {
                key: 'cancel',
                type: 'button',
                label: 'Cancel',
                result: TbxMatDialogDismissReason.Cancel,
                emphasis: 'text',
                align: 'start',
            },
            {
                key: 'delete',
                type: 'button',
                label: 'Delete',
                icon: 'delete',
                iconPosition: 'before',
                result: TbxMatDialogDismissReason.Affirm,
                emphasis: 'destructive',
                align: 'end',
            },
        ];
        const output = await this.dialog.show({
            title: 'Delete Account',
            icon: 'error',
            emphasis: TbxMatDialogEmphasisType.Destructive,
            message:
                'This will permanently delete your account and all associated data. This action cannot be undone.',
            footer: destructiveButtons,
        });
        this.lastResult.set(output.result);
    }

    async showWithCheckbox(): Promise<void> {
        const footer: readonly TbxMatDialogFooterControlType[] = [
            {
                key: 'dontAskAgain',
                type: 'checkbox',
                label: "Don't ask me again",
                align: 'start',
            },
            ...TBX_MAT_DIALOG_BUTTONS_YES_NO,
        ];
        const output = await this.dialog.confirm({
            title: 'Enable Notifications?',
            message: 'Would you like to receive notifications for this project?',
            footer,
        });
        this.lastResult.set(`${output.result} (footer: ${JSON.stringify(output.footerValues)})`);
    }

    async showWithToggle(): Promise<void> {
        const footer: readonly TbxMatDialogFooterControlType[] = [
            {
                key: 'verbose',
                type: 'toggle',
                label: 'Verbose output',
                align: 'start',
            },
            ...TBX_MAT_DIALOG_BUTTONS_OK,
        ];
        const output = await this.dialog.information({
            title: 'Export Settings',
            message: 'Export your current configuration to a file.',
            footer,
        });
        this.lastResult.set(`${output.result} (footer: ${JSON.stringify(output.footerValues)})`);
    }

    async showWithRadio(): Promise<void> {
        const footer: readonly TbxMatDialogFooterControlType[] = [
            {
                key: 'format',
                type: 'radio-group',
                options: [
                    { label: 'JSON', value: 'json' },
                    { label: 'CSV', value: 'csv' },
                    { label: 'XML', value: 'xml' },
                ],
                initialValue: 'json',
                align: 'start',
            },
            ...TBX_MAT_DIALOG_BUTTONS_OK,
        ];
        const output = await this.dialog.information({
            title: 'Export Format',
            message: 'Choose the format for your export.',
            footer,
        });
        this.lastResult.set(`${output.result} (footer: ${JSON.stringify(output.footerValues)})`);
    }

    async showCustom(): Promise<void> {
        const output = await this.dialog.show({
            title: 'Custom Dialog',
            icon: 'build',
            subtitle: 'Using show() for full control',
            contextBadge: 'v2',
            emphasis: TbxMatDialogEmphasisType.Warning,
            message:
                'This dialog was opened via the show() method with all options configured manually.',
            footer: [
                {
                    key: 'acknowledge',
                    type: 'checkbox',
                    label: 'I understand',
                    align: 'start',
                },
                {
                    key: 'cancel',
                    type: 'button',
                    label: 'Cancel',
                    result: TbxMatDialogDismissReason.Cancel,
                    emphasis: 'text',
                    align: 'end',
                },
                {
                    key: 'proceed',
                    type: 'button',
                    label: 'Proceed',
                    icon: 'arrow_forward',
                    iconPosition: 'after',
                    result: TbxMatDialogDismissReason.Affirm,
                    emphasis: 'primary',
                    align: 'end',
                },
            ],
        });
        this.lastResult.set(`${output.result} (footer: ${JSON.stringify(output.footerValues)})`);
    }
}

const meta: Meta<DialogHarnessComponent> = {
    title: 'Dialogs',
    component: DialogHarnessComponent,
    decorators: [
        moduleMetadata({
            imports: [DialogHarnessComponent],
        }),
    ],
};

export default meta;
type Story = StoryObj<DialogHarnessComponent>;

export const Default: Story = {};
