import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { type DialogContent } from '../models/dialog.model';

/**
 * Data returned by the sample input dialog.
 */
export interface SampleInputData {
    readonly firstName: string;
    readonly lastName: string;
    readonly address: string;
}

/**
 * Sample input component demonstrating the DialogContent<T> contract.
 *
 * Used in the theme preview page to demonstrate input dialogs. Also serves
 * as a reference implementation for downstream apps building their own
 * input dialog content components.
 *
 * Implements DialogContent<SampleInputData>:
 *   - isValid: true when both first name and last name are non-empty
 *   - value: the current form data as a SampleInputData object
 *
 * The dialog shell reads these signals to:
 *   - Drive the affirm button's disabled state (disabled when isValid is false)
 *   - Include value in DialogOutput.data when the user confirms
 *
 * Validation demonstrates mat-error spacing within a dialog body:
 *   - Required fields (first name, last name) use default subscript sizing
 *     so space is always reserved for the error message — prevents layout
 *     shift when errors appear or disappear.
 *   - Optional fields (address) use subscriptSizing="dynamic" since they
 *     have no validation messages to display.
 */
@Component({
    selector: 'tbx-sample-input',
    imports: [FormsModule, MatFormFieldModule, MatInputModule],
    template: `
        <div class="sample-input-form">
            <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input
                    matInput
                    required
                    [ngModel]="firstName()"
                    (ngModelChange)="firstName.set($event)"
                    placeholder="Enter first name"
                    #firstNameField="ngModel"
                />
                @if (firstNameField.invalid && firstNameField.touched) {
                    <mat-error>First name is required</mat-error>
                }
            </mat-form-field>
            <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input
                    matInput
                    required
                    [ngModel]="lastName()"
                    (ngModelChange)="lastName.set($event)"
                    placeholder="Enter last name"
                    #lastNameField="ngModel"
                />
                @if (lastNameField.invalid && lastNameField.touched) {
                    <mat-error>Last name is required</mat-error>
                }
            </mat-form-field>
            <!-- Dynamic: only takes space when hint/error is actually present -->
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
        .sample-input-form {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .sample-input-form mat-form-field {
            width: 100%;
        }
    `,
})
export class SampleInputComponent implements DialogContent<SampleInputData> {
    readonly firstName = signal('');
    readonly lastName = signal('');
    readonly address = signal('');

    readonly isValid = computed(
        () => this.firstName().trim().length > 0 && this.lastName().trim().length > 0
    );

    readonly value = computed<SampleInputData>(() => ({
        firstName: this.firstName().trim(),
        lastName: this.lastName().trim(),
        address: this.address().trim(),
    }));
}
