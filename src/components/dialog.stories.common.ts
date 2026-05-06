import { Component, computed, inject, Injectable, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { applicationConfig } from '@storybook/angular';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
import { TbxMatFontIconService } from '@teqbench/tbx-mat-icons';
import { TbxMatDialogService } from '../services/dialog.service';
import { TbxMatDialogDismissReason } from '../types/dialog-result.type';
import {
    TBX_MAT_DIALOG_BUTTONS_OK,
    TBX_MAT_DIALOG_BUTTONS_YES_NO,
    TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL,
} from '../constants/dialog.constants';
import { type TbxMatDialogFooterControlType } from '../types/dialog-footer-control.type';
import { type TbxMatDialogData } from '../models/dialog.model';
import { TBX_MAT_DIALOG_PROVIDER_CONFIG } from '../tokens/dialog-provider-config.token';
import { TbxMatDialogSeverityFontIconService } from '../services/dialog-severity-font-icon.service';
import { TbxMatDialogSeveritySvgIconService } from '../services/dialog-severity-svg-icon.service';

/* ─── Demo input component ──────────────────────────────────────────────────
 *
 * Implements `TbxMatDialogData<StoryInputData>`. Lives inside the stories
 * common file (not exported from the package) so the Input flow story can
 * demonstrate the input dialog UX without exposing a sample/reference
 * component on the public API surface — matching how `tbx-mat-banners`
 * and `tbx-mat-notifications` keep example UI inside their stories files.
 */

export interface StoryInputData {
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
export class StoryInputComponent implements TbxMatDialogData<StoryInputData> {
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

/* ─── Demo close-icon resolver ──────────────────────────────────────────────
 *
 * A consumer-defined alternate close icon resolver used by the
 * "custom close icon" story. Registers `'cancel'` (a Material Symbols
 * X-in-circle ligature) instead of the default `'close'` ligature.
 */

@Injectable()
export class StoryAlternateCloseIconService extends TbxMatFontIconService<string> {
    constructor(fontSet?: string) {
        super(fontSet);
    }

    protected override initialize(): void {
        super.initialize();
        this.register('close', 'cancel');
    }
}

/* ─── Wrapper harness ───────────────────────────────────────────────────────
 *
 * Buttons that trigger every dialog API surface. Dialogs render in the
 * CDK overlay (outside the component tree) so we trigger them
 * programmatically via `TbxMatDialogService`.
 */

@Component({
    selector: 'tbx-dialog-harness',
    imports: [MatButtonModule],
    styleUrls: ['./story-harness.css'],
    template: `
        <div class="harness">
            @if (description) {
                <p class="story-description">{{ description }}</p>
            }
            <p class="theme-note">
                Theme: Angular Material prebuilt <strong>Azure Blue</strong>. Dialog severity colors
                are driven by <code>@teqbench/tbx-mat-severity-theme</code>; dialog UX patterns
                (confirm/input) layer on top of severity.
            </p>

            <h3>Severity Methods</h3>
            <div class="button-group">
                <button mat-flat-button (click)="showDefault()">Default</button>
                <button mat-flat-button (click)="showSuccess()">Success</button>
                <button mat-flat-button (click)="showError()">Error</button>
                <button mat-flat-button (click)="showWarning()">Warning</button>
                <button mat-flat-button (click)="showInformation()">Information</button>
                <button mat-flat-button (click)="showHelp()">Help</button>
            </div>

            <h3>Dialog Patterns</h3>
            <div class="button-group">
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
    `,
})
export class DialogHarnessComponent {
    private readonly dialog = inject(TbxMatDialogService);
    readonly lastResult = signal('');

    /** Optional description rendered above the button grid (used by docs stories). */
    description = '';

    async showSuccess(): Promise<void> {
        const output = await this.dialog.success({
            title: 'Saved',
            message: 'Your changes have been saved successfully.',
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

    async showWarning(): Promise<void> {
        const output = await this.dialog.warning({
            title: 'Unsaved Changes',
            message:
                'You have unsaved changes that will be lost if you navigate away. Are you sure you want to leave this page?',
        });
        this.lastResult.set(output.result);
    }

    async showInformation(): Promise<void> {
        const output = await this.dialog.information({
            title: 'Session Expired',
            message: 'Your session has expired. Please sign in again to continue working.',
        });
        this.lastResult.set(output.result);
    }

    async showHelp(): Promise<void> {
        const output = await this.dialog.help({
            title: 'How it works',
            message:
                'This panel shows tips and guidance for completing your task. Tap any control for more details.',
        });
        this.lastResult.set(output.result);
    }

    async showDefault(): Promise<void> {
        const output = await this.dialog.default({
            title: 'Notice',
            message: 'A neutral, severity-agnostic dialog surface for general announcements.',
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
            type: TbxMatSeverityLevel.Error,
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
            type: TbxMatSeverityLevel.Warning,
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

/* ─── Reusable decorators ───────────────────────────────────────────────────
 *
 * Each decorator overrides the dialog provider config for the scope of a
 * single story. Mirrors the `withSvgIcons()` pattern in
 * `tbx-mat-banners/src/components/banner-overlay.stories.common.ts`.
 */

/** Swap the severity icon resolver to the SVG variant. */
export function withSvgIcons() {
    return applicationConfig({
        providers: [
            {
                provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new TbxMatDialogSeveritySvgIconService(),
                }),
            },
        ],
    });
}

/** Override the close icon resolver with a story-defined alternate. */
export function withAlternateCloseIcon() {
    return applicationConfig({
        providers: [
            {
                provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new TbxMatDialogSeverityFontIconService(
                        'material-symbols-rounded'
                    ),
                    closeIconResolverService: new StoryAlternateCloseIconService(
                        'material-symbols-rounded'
                    ),
                }),
            },
        ],
    });
}
