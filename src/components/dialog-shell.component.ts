import {
    ChangeDetectionStrategy,
    Component,
    afterNextRender,
    computed,
    inject,
    signal,
    viewChild,
    ViewContainerRef,
    ComponentRef,
    type Signal,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDivider } from '@angular/material/divider';
import { MatChipSet, MatChip } from '@angular/material/chips';
import { DialogResultType } from '../types/dialog-result.type';
import { DialogEmphasisType } from '../types/dialog-emphasis.type';
import { type DialogConfig, type DialogContent } from '../models/dialog.model';
import {
    type DialogFooterButton,
    type DialogFooterCheckbox,
    type DialogFooterToggle,
    type DialogFooterRadioGroup,
    type DialogFooterToggleGroup,
} from '../models/dialog-footer.model';
import { type DialogFooterControlType } from '../types/dialog-footer-control.type';

/**
 * Emphasis CSS variable prefix mapping.
 * Maps DialogEmphasisType enum values to the --tbx-dialog-* token prefix
 * used in _dialog-panels.scss.
 */
const EMPHASIS_TOKEN_MAP: Readonly<Record<DialogEmphasisType, string>> = {
    [DialogEmphasisType.Default]: 'default',
    [DialogEmphasisType.Destructive]: 'destructive',
    [DialogEmphasisType.Warning]: 'warning',
    [DialogEmphasisType.Informational]: 'info',
};

/**
 * Internal data payload injected into DialogShellComponent via MAT_DIALOG_DATA.
 *
 * This is the shape the DialogService passes when opening the shell.
 * It extends DialogConfig with the resolved footer (service applies default
 * button presets when the caller omits footer).
 */
export interface DialogShellData {
    readonly config: DialogConfig<unknown>;
    readonly resolvedFooter: readonly DialogFooterControlType[];
}

/**
 * Common dialog chrome shared by all three dialog types (info, confirm, input).
 *
 * Renders a consistent layout using Material dialog structural directives:
 *   - Header: icon in circular container (optional), title (matDialogTitle for
 *     aria-labelledby accessibility), context badge (mat-chip, optional),
 *     subtitle (optional), close button — all vertically centered
 *   - mat-divider separator
 *   - Body (mat-dialog-content): message text or dynamically created content
 *     component, with scrollable overflow for long content
 *   - mat-divider separator (conditional — only if footer has items)
 *   - Footer (mat-dialog-actions): single flex row of buttons and controls
 *
 * The shell is internal to the dialog system — consumers never reference it directly.
 * They interact with DialogService, which opens this component via MatDialog.
 *
 * For input dialogs, the shell dynamically creates the content component from
 * config.content and reads its isValid/value signals. The affirm button's
 * disabled state is automatically driven by isValid when a content component
 * is present.
 *
 * Footer buttons use separate template elements for filled vs text variants
 * because matButton is a compile-time directive — it cannot be bound dynamically
 * via [attr.matButton]. Each emphasis maps to a static directive:
 *   - 'primary' / 'destructive' → matButton="filled" with CSS class emphasis
 *   - 'text' / undefined → matButton="text"
 *
 * Emphasis colors are driven by CSS custom properties set on :host via the
 * data-emphasis attribute. The header icon container, icon glyph, and primary/
 * destructive button classes all consume --tbx-dialog-current-accent and
 * --tbx-dialog-current-on-accent — no inline style bindings. Button emphasis
 * overrides use Angular Material's mat.button-overrides() mixin in the global
 * _dialog-panels.scss (same pattern as _snackbar-panels.scss).
 *
 * Icon position uses CSS `order` rather than template ordering — Material's
 * internal content projection overrides DOM order, and there is no
 * `iconPositionEnd` binding on `matButton`. Setting `order: 1` on the mat-icon
 * moves it visually after the label (which defaults to order: 0).
 *
 * Padding is controlled by a single CSS custom property (--dialog-padding-inline)
 * on :host, ensuring header, body, footer, and divider insets are always aligned.
 * Material directive default padding is overridden to use this property.
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'tbx-dialog-shell',
    host: {
        '[attr.data-emphasis]': 'emphasisToken',
    },
    imports: [
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatButtonToggleModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDivider,
        MatChipSet,
        MatChip,
    ],
    template: `
        <!-- ── Header ───────────────────────────────────────── -->
        <header class="dialog-header">
            <div class="header-content">
                @if (config.icon) {
                    <div class="header-icon-container">
                        <mat-icon class="header-icon">{{ config.icon }}</mat-icon>
                    </div>
                }
                <div class="header-text">
                    <div class="header-title-row">
                        <h2 matDialogTitle>{{ config.title }}</h2>
                        @if (config.contextBadge) {
                            <mat-chip-set>
                                <mat-chip disabled>{{ config.contextBadge }}</mat-chip>
                            </mat-chip-set>
                        }
                    </div>
                    @if (config.subtitle) {
                        <p class="dialog-subtitle">{{ config.subtitle }}</p>
                    }
                </div>
            </div>
            <button matIconButton (click)="close()" aria-label="Close dialog">
                <mat-icon>close</mat-icon>
            </button>
        </header>

        <mat-divider class="dialog-separator" />

        <!-- ── Body ─────────────────────────────────────────── -->
        <mat-dialog-content class="dialog-body">
            @if (config.content) {
                <ng-container #contentHost></ng-container>
            } @else if (config.message) {
                <p class="dialog-message">{{ config.message }}</p>
            }
        </mat-dialog-content>

        <!-- ── Footer ───────────────────────────────────────── -->
        @if (resolvedFooter.length > 0) {
            <mat-divider class="dialog-separator" />

            <mat-dialog-actions class="dialog-footer">
                @for (control of resolvedFooter; track control.key; let i = $index) {
                    <div [class.footer-end-start]="i === firstEndIndex()">
                        @switch (control.type) {
                            @case ('button') {
                                @let btn = asButton(control);
                                <!-- matButton is a compile-time directive and cannot be
                                bound dynamically via [attr.matButton]. Separate elements
                                for filled vs text ensure proper Material rendering.
                                Icon position uses CSS order — Material's content projection
                                overrides DOM order, so style.order is the only reliable
                                way to place icons after labels. -->
                                @if (btn.emphasis === 'primary' || btn.emphasis === 'destructive') {
                                    <button
                                        matButton="filled"
                                        [class.dialog-btn-primary]="btn.emphasis === 'primary'"
                                        [class.dialog-btn-destructive]="
                                            btn.emphasis === 'destructive'
                                        "
                                        [disabled]="isButtonDisabled(btn)"
                                        (click)="onButtonClick(btn)"
                                    >
                                        @if (btn.icon) {
                                            <mat-icon
                                                [style.order]="btn.iconPosition === 'after' ? 1 : 0"
                                                >{{ btn.icon }}</mat-icon
                                            >
                                        }
                                        {{ btn.label }}
                                    </button>
                                } @else {
                                    <button
                                        matButton="text"
                                        [disabled]="isButtonDisabled(btn)"
                                        (click)="onButtonClick(btn)"
                                    >
                                        @if (btn.icon) {
                                            <mat-icon
                                                [style.order]="btn.iconPosition === 'after' ? 1 : 0"
                                                >{{ btn.icon }}</mat-icon
                                            >
                                        }
                                        {{ btn.label }}
                                    </button>
                                }
                            }
                            @case ('checkbox') {
                                @let chk = asCheckbox(control);
                                <mat-checkbox
                                    [checked]="getFooterValue(chk.key) === true"
                                    (change)="setFooterValue(chk.key, $event.checked)"
                                    >{{ chk.label }}</mat-checkbox
                                >
                            }
                            @case ('toggle') {
                                @let tgl = asToggle(control);
                                <mat-slide-toggle
                                    [checked]="getFooterValue(tgl.key) === true"
                                    (change)="setFooterValue(tgl.key, $event.checked)"
                                    >{{ tgl.label }}</mat-slide-toggle
                                >
                            }
                            @case ('radio-group') {
                                @let rdo = asRadioGroup(control);
                                <mat-radio-group
                                    [value]="getFooterValue(rdo.key)"
                                    (change)="setFooterValue(rdo.key, $event.value)"
                                >
                                    @for (option of rdo.options; track option.value) {
                                        <mat-radio-button [value]="option.value">
                                            {{ option.label }}
                                        </mat-radio-button>
                                    }
                                </mat-radio-group>
                            }
                            @case ('toggle-group') {
                                @let tglGrp = asToggleGroup(control);
                                <mat-button-toggle-group
                                    [multiple]="tglGrp.multiple ?? false"
                                    [value]="getFooterValue(tglGrp.key)"
                                    (change)="setFooterValue(tglGrp.key, $event.value)"
                                >
                                    @for (option of tglGrp.options; track option.value) {
                                        <mat-button-toggle [value]="option.value">
                                            @if (option.icon) {
                                                <mat-icon>{{ option.icon }}</mat-icon>
                                            }
                                            @if (option.label) {
                                                {{ option.label }}
                                            }
                                        </mat-button-toggle>
                                    }
                                </mat-button-toggle-group>
                            }
                        }
                    </div>
                }
            </mat-dialog-actions>
        }
    `,
    styles: `
        :host {
            --dialog-padding-inline: 1.25rem;
        }

        /* ── Emphasis ──────────────────────────────────────── */

        /* Each emphasis sets --tbx-dialog-current-accent and --tbx-dialog-current-on-accent
         * on :host via the data-emphasis attribute. These cascade to all descendants —
         * the icon container, icon glyph, and button emphasis classes all consume them.
         * Default is the fallback when data-emphasis is not set. */
        :host,
        :host([data-emphasis='default']) {
            --tbx-dialog-current-accent: var(--tbx-dialog-default-accent);
            --tbx-dialog-current-on-accent: var(--tbx-dialog-default-on-accent);
        }

        :host([data-emphasis='destructive']) {
            --tbx-dialog-current-accent: var(--tbx-dialog-destructive-accent);
            --tbx-dialog-current-on-accent: var(--tbx-dialog-destructive-on-accent);
        }

        :host([data-emphasis='warning']) {
            --tbx-dialog-current-accent: var(--tbx-dialog-warning-accent);
            --tbx-dialog-current-on-accent: var(--tbx-dialog-warning-on-accent);
        }

        :host([data-emphasis='info']) {
            --tbx-dialog-current-accent: var(--tbx-dialog-info-accent);
            --tbx-dialog-current-on-accent: var(--tbx-dialog-info-on-accent);
        }

        /* ── Header ────────────────────────────────────────── */

        .dialog-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.25rem var(--dialog-padding-inline) 1rem;
            gap: 0.75rem;
        }

        .header-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
            min-width: 0;
        }

        /* Circular container for the header icon — matches the 2.5rem touch target
         * of the close button (matIconButton). The icon glyph is centered within.
         * Background and icon color consume the emphasis host variables set by
         * :host([data-emphasis]) — no inline style bindings needed. */
        .header-icon-container {
            flex-shrink: 0;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--tbx-dialog-current-accent);
        }

        .header-icon {
            font-size: 1.25rem;
            width: 1.25rem;
            height: 1.25rem;
            color: var(--tbx-dialog-current-on-accent);
        }

        .header-text {
            flex: 1;
            min-width: 0;
        }

        .header-title-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        /* matDialogTitle provides aria-labelledby linkage. Override Material's
         * default padding/margin/display since the header container manages its
         * own flex layout. Material sets display: block on the title which breaks
         * flex centering — inline keeps it in the flex flow. */
        [matDialogTitle] {
            font: var(--mat-sys-title-large);
            color: var(--mat-sys-on-surface);
            display: inline;
            margin: 0;
            padding: 0;
        }

        [matDialogTitle]::before {
            display: none;
        }

        .dialog-subtitle {
            font: var(--mat-sys-body-small);
            color: var(--mat-sys-on-surface-variant);
            margin: 0.25rem 0 0;
        }

        /* ── Separator ─────────────────────────────────────── */

        .dialog-separator {
            margin-left: var(--dialog-padding-inline);
            margin-right: var(--dialog-padding-inline);
            width: calc(100% - 2 * var(--dialog-padding-inline));
            opacity: 35%;
        }

        /* ── Body ──────────────────────────────────────────── */

        /* mat-dialog-content element provides scrollable overflow for long content.
         * Override Material's default padding — the shell manages its own
         * padding via --dialog-padding-inline for divider alignment. */
        mat-dialog-content.dialog-body {
            padding: 1.25rem var(--dialog-padding-inline);
            min-height: 3rem;
            max-height: 65vh;
        }

        .dialog-message {
            font: var(--mat-sys-body-medium);
            color: var(--mat-sys-on-surface);
            margin: 0;
            line-height: 1.6;
        }

        /* ── Footer ────────────────────────────────────────── */

        /* mat-dialog-actions element provides semantic action container.
         * Override Material's default padding/gap — the shell manages
         * its own layout via --dialog-padding-inline. */
        mat-dialog-actions.dialog-footer {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 1rem var(--dialog-padding-inline);
            min-height: auto;
        }

        .footer-end-start {
            margin-left: auto;
        }
    `,
})
export class DialogShellComponent {
    private readonly dialogRef = inject(MatDialogRef<DialogShellComponent>);
    private readonly shellData = inject<DialogShellData>(MAT_DIALOG_DATA);

    /** The caller's configuration (title, icon, message, emphasis, content, etc.). */
    readonly config = this.shellData.config;

    /** Resolved footer items (service applies default presets when caller omits footer). */
    readonly resolvedFooter = this.shellData.resolvedFooter;

    /**
     * Reference to the dynamically created content component (input dialogs only).
     *
     * Signal-based so Angular's reactive system picks up the change when the
     * content component is created in afterNextRender — no manual change
     * detection needed.
     */
    private readonly contentRef = signal<DialogContent<unknown> | null>(null);

    /** ViewContainerRef for the content host — used to dynamically create input dialog content. */
    readonly contentHost = viewChild('contentHost', { read: ViewContainerRef });

    /**
     * Current values of all footer controls, keyed by control.key.
     * Initialized from initialValue on each control, updated on user interaction.
     * Included in DialogOutput.footerValues when the dialog closes.
     */
    private readonly footerValues = signal<Record<string, unknown>>(
        this.buildInitialFooterValues()
    );

    /**
     * The resolved emphasis — defaults to Default when not specified.
     */
    private readonly emphasis = this.config.emphasis ?? DialogEmphasisType.Default;

    /**
     * Token suffix for the current emphasis — used by the host data-emphasis
     * attribute binding and the :host([data-emphasis]) CSS selectors.
     */
    readonly emphasisToken = EMPHASIS_TOKEN_MAP[this.emphasis];

    /**
     * Index of the first footer item with align: 'end'.
     * Used to apply margin-left: auto for the start/end split.
     * Returns -1 if all items are align: 'start'.
     */
    readonly firstEndIndex = computed(() =>
        this.resolvedFooter.findIndex((c) => c.align === 'end')
    );

    // ── Footer control type cast helpers ────────────────────────────────
    //
    // Angular's template type checker does not narrow discriminated unions
    // inside @switch/@case blocks. These one-line type assertions are used
    // with @let to create typed template variables in each @case branch,
    // restoring full type safety without $any().
    //
    // The @switch guarantees the discriminant matches — the cast is safe.

    /** Cast for @case ('button') — provides DialogFooterButton type in template. */
    protected asButton(control: DialogFooterControlType): DialogFooterButton {
        return control as DialogFooterButton;
    }

    /** Cast for @case ('checkbox') — provides DialogFooterCheckbox type in template. */
    protected asCheckbox(control: DialogFooterControlType): DialogFooterCheckbox {
        return control as DialogFooterCheckbox;
    }

    /** Cast for @case ('toggle') — provides DialogFooterToggle type in template. */
    protected asToggle(control: DialogFooterControlType): DialogFooterToggle {
        return control as DialogFooterToggle;
    }

    /** Cast for @case ('radio-group') — provides DialogFooterRadioGroup type in template. */
    protected asRadioGroup(control: DialogFooterControlType): DialogFooterRadioGroup {
        return control as DialogFooterRadioGroup;
    }

    /** Cast for @case ('toggle-group') — provides DialogFooterToggleGroup type in template. */
    protected asToggleGroup(control: DialogFooterControlType): DialogFooterToggleGroup {
        return control as DialogFooterToggleGroup;
    }

    constructor() {
        /**
         * Dynamically create the content component for input dialogs.
         *
         * afterNextRender runs after the browser paints, entirely outside
         * Angular's change detection cycle. Setting contentRef here is
         * structurally safe — NG0100 is impossible because no change
         * detection pass is in progress. The signal update triggers a
         * reactive re-evaluation of isButtonDisabled() on the next cycle.
         */
        afterNextRender(() => {
            const host = this.contentHost();

            if (this.config.content && host) {
                const ref: ComponentRef<DialogContent<unknown>> = host.createComponent(
                    this.config.content
                );
                this.contentRef.set(ref.instance);
            }
        });
    }

    /** Close the dialog with DialogResultType.Close (dismiss without choosing). */
    close(): void {
        this.dialogRef.close({
            result: DialogResultType.Close,
            footerValues: this.footerValues(),
        });
    }

    /** Handle a footer button click. If the button has a result, close the dialog. */
    onButtonClick(button: DialogFooterButton): void {
        if (button.result === undefined) {
            return;
        }

        this.dialogRef.close({
            result: button.result,
            data:
                button.result === DialogResultType.Affirm ? this.contentRef()?.value() : undefined,
            footerValues: this.footerValues(),
        });
    }

    /**
     * Resolve a button's disabled state.
     * For affirm buttons in input dialogs, also checks content.isValid.
     */
    isButtonDisabled(button: DialogFooterButton): boolean {
        const content = this.contentRef();

        if (button.result === DialogResultType.Affirm && content && !content.isValid()) {
            return true;
        }

        if (button.disabled === undefined) {
            return false;
        }

        if (typeof button.disabled === 'boolean') {
            return button.disabled;
        }

        // Signal<boolean>
        return (button.disabled as Signal<boolean>)();
    }

    /** Get the current value of a footer control by key. */
    getFooterValue(key: string): unknown {
        return this.footerValues()[key];
    }

    /** Update the value of a footer control by key. */
    setFooterValue(key: string, value: unknown): void {
        this.footerValues.update((current) => ({ ...current, [key]: value }));
    }

    /**
     * Build initial footer values from control initialValue properties.
     * Buttons are excluded — they have results, not values.
     */
    private buildInitialFooterValues(): Record<string, unknown> {
        const values: Record<string, unknown> = {};

        for (const control of this.resolvedFooter) {
            switch (control.type) {
                case 'checkbox':
                case 'toggle':
                    values[control.key] = control.initialValue ?? false;
                    break;
                case 'radio-group':
                    values[control.key] = control.initialValue ?? null;
                    break;
                case 'toggle-group':
                    values[control.key] = control.initialValue ?? (control.multiple ? [] : null);
                    break;
            }
        }

        return values;
    }
}
