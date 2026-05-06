import { Component, effect, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
import { TbxMatDialogService, TbxMatDialogDismissReason, type TbxMatDialogFooterControlType } from '../../index';

// Document-level token override blocks. Dialogs render in a CDK overlay outside
// the component tree, so per-component styling does not reach the dialog
// surface. Token overrides scoped to a body class are injected once and applied
// for the lifetime of a story selection.
const TOKEN_OVERRIDE_CSS = `
  .tbx-demo-wide-radius .mat-mdc-dialog-surface {
    border-radius: 0;
  }
  .tbx-demo-tight-padding {
    --dialog-padding-inline: 0.5rem;
  }
  .tbx-demo-loose-padding {
    --dialog-padding-inline: 2.5rem;
  }
  .tbx-demo-large-icon {
    --tbx-mat-dialog-icon-size: 4rem;
  }
`;

@Component({
    selector: 'tbx-dialog-custom-harness',
    imports: [MatButtonModule, JsonPipe],
    template: `
        <div class="harness">
            <div class="instructions">
                <p><strong>Custom dialogs</strong> use <code>TbxMatDialogService.show()</code> to opt out of every opinionated default. Pass a full <code>TbxMatDialogConfig</code> with explicit severity, icon, footer composition, and sizing — no method-level merging. This is the right choice when none of the severity-leveled methods (<code>success</code>, <code>error</code>, etc.) or dialog-specific patterns (<code>confirm</code>, <code>input</code>) fit.</p>
                <p>The demos below cover the full range: custom width and dimensional sizing, <code>disableClose</code> to block backdrop and <kbd>Escape</kbd> dismissal, custom icon overrides, document-level token overrides for radius and padding, and complex footer compositions. Token overrides are scoped to <code>document.body</code> classes that are toggled per story so they don't bleed into other dialog stories.</p>
            </div>

            <h3>Sizing &amp; Layout</h3>
            <p class="theme-note"><code>width</code>, <code>minWidth</code>, <code>maxWidth</code>, <code>minHeight</code>, and <code>maxHeight</code> pass through directly to <a href="https://material.angular.dev/components/dialog/api" target="_blank" rel="noopener">MatDialogConfig</a>.</p>
            <div class="button-group">
                <button mat-flat-button (click)="showWide()">Wide (50rem)</button>
                <button mat-flat-button (click)="showNarrow()">Narrow (20rem)</button>
                <button mat-flat-button (click)="showLongContent()">Long Content (scrollable)</button>
            </div>

            <h3>Disable Close</h3>
            <p class="theme-note">With <code>disableClose: true</code>, backdrop click and <kbd>Escape</kbd> are blocked. The user must interact with a footer button to close — useful for irreversible actions or required acknowledgements.</p>
            <div class="button-group">
                <button mat-flat-button (click)="showDisableClose()">Disable Close</button>
            </div>

            <h3>Custom Icon Override</h3>
            <p class="theme-note">Pass <code>icon</code> on the config to override the icon resolved from <code>type</code>. The override is rendered as a Material Symbols font ligature and takes precedence over the configured severity icon resolver.</p>
            <div class="button-group">
                <button mat-flat-button (click)="showCustomIcon()">Custom Icon (rocket)</button>
                <button mat-flat-button (click)="showLargeIcon()">Larger Icon (4rem)</button>
            </div>

            <h3>Surface &amp; Padding Tokens</h3>
            <p class="theme-note">CSS custom properties on the dialog surface are overridable via document-level rules. Squared corners zero out the surface <code>border-radius</code>; padding tokens reshape the inset between header / body / footer and the surface edge.</p>
            <div class="button-group">
                <button mat-flat-button (click)="showSquaredCorners()">Squared Corners</button>
                <button mat-flat-button (click)="showTightPadding()">Tight Padding</button>
                <button mat-flat-button (click)="showLoosePadding()">Loose Padding</button>
            </div>

            <h3>Complex Footer</h3>
            <p class="theme-note">A mixed footer with start-aligned acknowledgement checkbox plus end-aligned Cancel + Proceed buttons. The Proceed button uses <code>iconPosition: 'after'</code> with a forward-arrow icon.</p>
            <div class="button-group">
                <button mat-flat-button (click)="showComplexFooter()">Complex Footer</button>
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
        .instructions a {
            color: #4338ca;
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
        .theme-note a {
            color: #4338ca;
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
class DialogCustomHarnessComponent {
    private readonly dialog = inject(TbxMatDialogService);
    readonly lastResult = signal<unknown>(null);

    private readonly bodyClass = signal<string | null>(null);

    constructor() {
        // Inject the demo override CSS once at the document level so it reaches
        // the CDK overlay surface (which renders outside the component tree).
        const STYLE_ID = 'tbx-dialog-story-custom-tokens';
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = TOKEN_OVERRIDE_CSS;
            document.head.appendChild(style);
        }

        // Toggle a body class to scope token overrides per story interaction.
        // The previous class is removed before applying the next one.
        let previous: string | null = null;
        effect(() => {
            if (previous) document.body.classList.remove(previous);
            const current = this.bodyClass();
            if (current) document.body.classList.add(current);
            previous = current;
        });
    }

    private async open(config: Parameters<TbxMatDialogService['show']>[0], scope?: string): Promise<void> {
        this.bodyClass.set(scope ?? null);
        try {
            const output = await this.dialog.show(config);
            this.lastResult.set({ result: output.result, footerValues: output.footerValues });
        } finally {
            this.bodyClass.set(null);
        }
    }

    async showWide(): Promise<void> {
        await this.open({
            title: 'Wide Dialog',
            type: TbxMatSeverityLevel.Information,
            width: '50rem',
            message: 'Width set to 50rem via the width config option. Default is 30rem (TBX_MAT_DIALOG_DEFAULT_WIDTH).',
        });
    }

    async showNarrow(): Promise<void> {
        await this.open({
            title: 'Narrow',
            type: TbxMatSeverityLevel.Information,
            width: '20rem',
            message: 'Width set to 20rem.',
        });
    }

    async showLongContent(): Promise<void> {
        const longMessage = Array.from({ length: 12 }, (_, i) => `Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`).join('\n\n');
        await this.open({
            title: 'Long Content',
            type: TbxMatSeverityLevel.Information,
            maxHeight: '60vh',
            message: longMessage,
        });
    }

    async showDisableClose(): Promise<void> {
        await this.open({
            title: 'Required Acknowledgement',
            type: TbxMatSeverityLevel.Warning,
            disableClose: true,
            message: 'Backdrop click and Escape are blocked. You must click Acknowledge to close.',
            footer: [{ key: 'ack', type: 'button', label: 'Acknowledge', emphasis: 'primary', result: TbxMatDialogDismissReason.Affirm, align: 'end' }],
        });
    }

    async showCustomIcon(): Promise<void> {
        await this.open({
            title: 'Launch',
            icon: 'rocket_launch',
            type: TbxMatSeverityLevel.Information,
            message: 'The icon override takes precedence over the icon resolved from the severity type.',
        });
    }

    async showLargeIcon(): Promise<void> {
        await this.open(
            {
                title: 'Larger Icon',
                type: TbxMatSeverityLevel.Help,
                message: 'Icon size is overridable via --tbx-mat-dialog-icon-size at the document level. This dialog uses 4rem.',
            },
            'tbx-demo-large-icon'
        );
    }

    async showSquaredCorners(): Promise<void> {
        await this.open(
            {
                title: 'Squared Corners',
                type: TbxMatSeverityLevel.Information,
                message: 'border-radius zeroed on .mat-mdc-dialog-surface via a custom CSS rule scoped to a body class.',
            },
            'tbx-demo-wide-radius'
        );
    }

    async showTightPadding(): Promise<void> {
        await this.open(
            {
                title: 'Tight Padding',
                type: TbxMatSeverityLevel.Information,
                message: '--dialog-padding-inline reduced to 0.5rem; header, body, and footer all share the tightened inset.',
            },
            'tbx-demo-tight-padding'
        );
    }

    async showLoosePadding(): Promise<void> {
        await this.open(
            {
                title: 'Loose Padding',
                type: TbxMatSeverityLevel.Information,
                message: '--dialog-padding-inline increased to 2.5rem.',
            },
            'tbx-demo-loose-padding'
        );
    }

    async showComplexFooter(): Promise<void> {
        const footer: readonly TbxMatDialogFooterControlType[] = [
            { key: 'acknowledge', type: 'checkbox', label: 'I understand', align: 'start' },
            { key: 'cancel', type: 'button', label: 'Cancel', result: TbxMatDialogDismissReason.Cancel, align: 'end' },
            {
                key: 'proceed',
                type: 'button',
                label: 'Proceed',
                icon: 'arrow_forward',
                iconPosition: 'after',
                emphasis: 'primary',
                result: TbxMatDialogDismissReason.Affirm,
                align: 'end',
            },
        ];
        await this.open({
            title: 'Apply Migration',
            subtitle: 'This will modify your data',
            contextBadge: 'v2',
            type: TbxMatSeverityLevel.Warning,
            message: 'Check the acknowledgement and click Proceed to continue. Cancel returns without applying changes.',
            footer,
        });
    }
}

const meta: Meta<DialogCustomHarnessComponent> = {
    title: 'Dialogs',
    tags: ['dialogs'],
    component: DialogCustomHarnessComponent,
    decorators: [moduleMetadata({ imports: [DialogCustomHarnessComponent] })],
};

export default meta;
type Story = StoryObj<DialogCustomHarnessComponent>;

export const Custom: Story = {
    parameters: {
        docs: {
            description: {
                story: '`TbxMatDialogService.show()` for full control — no severity defaults, no footer preset. Demonstrates custom sizing, `disableClose`, icon overrides, document-level CSS token overrides for surface radius and padding, and complex footer compositions.',
            },
        },
    },
};
