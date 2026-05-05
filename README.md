# @teqbench/tbx-mat-dialogs

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-dialogs-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-dialogs-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-dialogs-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-dialogs-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-dialogs-main-build-number.json)

> An opinionated [Angular ↗](https://angular.dev) modal dialog service with severity-leveled chrome, signal-based input validation, and rich footer controls. Built on [Angular Material's MatDialog ↗](https://material.angular.dev/components/dialog/api).

<details>
<summary><strong>Table of contents</strong></summary>

- [Overview](#overview)
- [At a glance](#at-a-glance)
- [When to use](#when-to-use)
- [Installation](#installation)
- [Usage](#usage)
- [Concepts](#concepts)
- [API Reference](#api-reference)
- [Styling](#styling)
- [Accessibility](#accessibility)
- [Compatibility](#compatibility)
- [Related packages](#related-packages)
- [Versioning & releases](#versioning--releases)
- [Contributing](#contributing)
- [Security](#security)
- [Feedback](#feedback)
- [License](#license)

</details>

## Overview

`@teqbench/tbx-mat-dialogs` provides modal dialogs for [Angular ↗](https://angular.dev) applications. It complements small transient notifications and persistent banners with a heavier surface for focused interactions: long copy, multi-step input, complex confirmation flows, and arbitrary projected content. Dialogs render via [Angular Material's MatDialog ↗](https://material.angular.dev/components/dialog/api), which manages overlay, backdrop, focus trap, and modal semantics.

`TbxMatDialogService` exposes nine opinionated methods. Six mirror the severity-leveled surface of [`tbx-mat-banners` ↗](https://github.com/teqbench/tbx-mat-banners) and [`tbx-mat-notifications` ↗](https://github.com/teqbench/tbx-mat-notifications) — `success`, `error`, `warning`, `information`, `help`, and `default`. Two are dialog-specific UX patterns layered on top of severity — `confirm` (Yes/No) and `input` (form content with OK/Cancel). The ninth, `show`, takes a full configuration for cases where the opinionated methods do not fit. All methods return a `Promise<TbxMatDialogResult<T, F>>` so consumers can `await` the user's choice with no subscription management.

Severity (`default`, `success`, `error`, `warning`, `information`, `help`) drives the header icon and the primary action button color. The dialog surface itself stays neutral — modal overlays are conventionally a Material theme background with severity-colored _accents_ rather than a fully severity-colored panel. The six CSS custom-property pairs are aliased from the shared [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme) tokens, so the colored tiers stay independent of the active [M3 ↗](https://m3.material.io) theme palette while the `default` tier remains theme-responsive. Applications can opt into an inverted palette across every severity-aware `@teqbench` package by calling `provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })` at bootstrap.

The footer is a single flex row of buttons and form controls (checkboxes, toggles, radio groups, toggle groups). On dismiss, all collected control values are returned alongside the dismiss reason. Input dialogs project a consumer-defined component into the body — the component implements `TbxMatDialogData<T>` with two signals (`isValid`, `value`); the shell reads them to drive the affirm button's disabled state and to extract the form value on confirm.

## At a glance

- **Severity-leveled API** — `success` / `error` / `warning` / `information` / `help` / `default` mirror the surface used by `tbx-mat-banners` and `tbx-mat-notifications`.
- **Dialog-only UX patterns** — `confirm` (Yes/No) and `input` (projected form content with OK/Cancel) layered on top of severity.
- **Async by default** — every method returns `Promise<TbxMatDialogResult<T, F>>`; use `await`, no subscription management.
- **Typed input dialogs** — `TbxMatDialogData<T>` contract with `isValid: Signal<boolean>` and `value: Signal<T>`; the affirm button's disabled state is automatically driven by `isValid`.
- **Rich footer controls** — buttons (text / filled / icon-position) and form controls (checkbox, toggle, radio group, toggle group) collected and returned on dismiss.
- **Pluggable icons** — three icon services ship out of the box (`TbxMatDialogSeverityFontIconService`, `TbxMatDialogSeveritySvgIconService`, `TbxMatDialogCloseFontIconService`); consumers can subclass any of them or supply their own resolver.
- **Theming via CSS custom properties** — six severity background/text token pairs aliased from `@teqbench/tbx-mat-severity-theme`, plus centralized opacity tokens for action button variants.
- **Inverted palette flip** — `provideTbxMatSeverityTheme({ invert: true })` swaps background and text values app-wide; banners, notifications, and dialogs invert simultaneously.
- **Modal semantics** — backdrop, focus trap, escape-to-close, and `aria-modal` come from `MatDialog`; this package adds the chrome and the typed result surface.

## When to use

Dialogs are one of three message surfaces in the TeqBench component family. Choose based on the weight of the message and how much interaction it needs:

- [`@teqbench/tbx-mat-notifications` ↗](https://github.com/teqbench/tbx-mat-notifications) — small, transient messages with at most one action control. Ideally one line of text, two lines acceptable. Use notifications to acknowledge something without interrupting the user's flow.
- [`@teqbench/tbx-mat-banners` ↗](https://github.com/teqbench/tbx-mat-banners) — wide, persistent messages with multiple action controls. Ideally one line of message text, up to three lines still acceptable. Use a banner when the message needs the user's attention and may offer a few follow-up choices.
- **`@teqbench/tbx-mat-dialogs`** (this package) — heavier, focused interactions for arbitrary content. Use a dialog when the message is long, the choices are many, or the interaction is complex.

Reach for a dialog when a notification or a banner would be stretched past its envelope: long copy, many controls, multi-step input, or anything that demands the user's focused attention. If a banner is approaching the three-line limit or its actions group is growing beyond a handful of controls, that is the signal to promote it to a dialog.

## Installation

Configure [npm ↗](https://www.npmjs.com) to use [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) for the `@teqbench` scope:

```bash
echo "@teqbench:registry=https://npm.pkg.github.com" >> .npmrc
```

Install the package:

```bash
npm install @teqbench/tbx-mat-dialogs
```

### Prerequisites

This package uses [Angular Material's MatDialog ↗](https://material.angular.dev/components/dialog/api) for overlay management and [Angular Material ↗](https://material.angular.dev) components for buttons, checkboxes, toggles, and other footer controls. An active [M3 ↗](https://m3.material.io) theme is required for typography, shape, and interactive states.

Dialog severity colors (success = green, error = red, etc.) are **not** tied to the theme palette — they use dedicated CSS custom properties resolved from [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme) and remain consistent regardless of which theme is active.

Import the global dialog styles in your application's stylesheet:

```scss
@use '@teqbench/tbx-mat-dialogs/styles/tbx-mat-dialogs';
```

## Usage

### Severity methods — fire-and-forget

```typescript
import { TbxMatDialogService, TbxMatDialogDismissReason } from '@teqbench/tbx-mat-dialogs';

private readonly dialog = inject(TbxMatDialogService);

await this.dialog.success({ title: 'Saved', message: 'Your changes are saved.' });
await this.dialog.error({ title: 'Save Failed', message: 'Could not save changes.' });
await this.dialog.warning({ title: 'Caution', message: 'This may take a while.' });
await this.dialog.information({ title: 'FYI', message: 'New version available.' });
await this.dialog.help({ title: 'How it works', message: 'Tap any control for details.' });
await this.dialog.default({ title: 'Notice', message: 'Neutral surface.' });
```

### Confirmation — Yes/No flow

```typescript
const output = await this.dialog.confirm({
    title: 'Delete Project?',
    message: 'This action cannot be undone.',
});

if (output.result === TbxMatDialogDismissReason.Affirm) {
    // user confirmed
}
```

### Input — projected form content

```typescript
import { TbxMatDialogData } from '@teqbench/tbx-mat-dialogs';

@Component({
    selector: 'app-rename-form',
    template: `
        <mat-form-field>
            <input matInput cdkFocusInitial [ngModel]="name()" (ngModelChange)="name.set($event)" />
        </mat-form-field>
    `,
})
class RenameFormComponent implements TbxMatDialogData<string> {
    readonly name = signal('');
    readonly isValid = computed(() => this.name().trim().length > 0);
    readonly value = computed(() => this.name().trim());
}

const output = await this.dialog.input<string>({
    title: 'Rename',
    content: RenameFormComponent,
});

if (output.result === TbxMatDialogDismissReason.Affirm) {
    console.log(output.data); // typed: string
}
```

### Footer controls — collect form values alongside the dismiss

```typescript
const output = await this.dialog.confirm<{ dontAskAgain: boolean }>({
    title: 'Enable Notifications?',
    message: 'Would you like to receive notifications for this project?',
    footer: [
        { key: 'dontAskAgain', type: 'checkbox', label: "Don't ask again", align: 'start' },
        { key: 'no', type: 'button', label: 'No', result: TbxMatDialogDismissReason.Deny, align: 'end' },
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

if (output.result === TbxMatDialogDismissReason.Affirm) {
    const dontAskAgain = output.footerValues.dontAskAgain;
}
```

### Full control via `show()`

```typescript
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';

const output = await this.dialog.show({
    title: 'Custom Dialog',
    icon: 'build',
    type: TbxMatSeverityLevel.Warning,
    subtitle: 'Optional secondary line',
    contextBadge: 'Beta',
    message: 'Full control over every option.',
    footer: [
        { key: 'cancel', type: 'button', label: 'Cancel', result: TbxMatDialogDismissReason.Cancel, align: 'end' },
        {
            key: 'proceed',
            type: 'button',
            label: 'Proceed',
            result: TbxMatDialogDismissReason.Affirm,
            emphasis: 'primary',
            align: 'end',
        },
    ],
});
```

### Icon Configuration

Icons are configured via the `TBX_MAT_DIALOG_PROVIDER_CONFIG` injection token, which is required.

#### Font icons with `MAT_ICON_DEFAULT_OPTIONS`

```typescript
// app.config.ts
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { TBX_MAT_DIALOG_PROVIDER_CONFIG, TbxMatDialogSeverityFontIconService } from '@teqbench/tbx-mat-dialogs';

providers: [
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } },
    {
        provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatDialogSeverityFontIconService(),
        }),
    },
];
```

#### Font icons with explicit fontSet

```typescript
providers: [
    {
        provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatDialogSeverityFontIconService('material-symbols-rounded'),
        }),
    },
];
```

#### SVG icons

```typescript
providers: [
    {
        provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatDialogSeveritySvgIconService(),
        }),
    },
];
```

#### Custom close icon

The close button uses a package-default `'close'` Material Symbols ligature. Override it by supplying a `closeIconResolverService`:

```typescript
providers: [
    {
        provide: TBX_MAT_DIALOG_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatDialogSeverityFontIconService(),
            closeIconResolverService: new MyCustomCloseIconService(),
        }),
    },
];
```

`MyCustomCloseIconService` must extend `TbxMatFontIconService<string>` (font) or `TbxMatSvgIconService<string>` (SVG) and register an entry under the `'close'` key.

## Concepts

- **Severity level** — a classification (default, success, error, warning, information, help) that selects the icon and color scheme applied to a dialog. Identical to the severity model used by `tbx-mat-banners` and `tbx-mat-notifications`.
- **Dialog patterns** — `confirm` and `input` are dialog-specific UX wrappers around the severity model. `confirm` defaults to Help severity with Yes/No buttons; `input` defaults to Information severity with a projected content component and OK/Cancel buttons.
- **Footer item** — every footer entry has a `key` (used in the returned `footerValues` record) and an `align` (`'start'` flows left, `'end'` flows right). The first `align: 'end'` item gets `margin-left: auto`, separating start- and end-aligned items.
- **Footer button emphasis** — `'primary'` (filled, severity-colored), `'destructive'` (filled, always Error-colored regardless of dialog severity), or `'text'` / undefined (text, no fill).
- **Dismiss reason** — `Affirm`, `Deny`, `Cancel`, or `Close`. Footer buttons declare a `result` to map their click; backdrop click and Escape both emit `Close` with empty footer values.
- **Provider config** — the DI-provided configuration (`TBX_MAT_DIALOG_PROVIDER_CONFIG`) that supplies the severity icon resolver and an optional close icon resolver. Required.
- **Content component** — a consumer-defined `@Component` that implements `TbxMatDialogData<T>`. Used in the body of input dialogs; the shell reads `isValid` to drive the affirm button's disabled state and `value` to extract data on confirm.

## API Reference

### TbxMatDialogService

<dl>
    <dt><code>show&lt;T, F&gt;(config)</code> → <code>Promise&lt;TbxMatDialogResult&lt;T, F&gt;&gt;</code></dt>
    <dd>Open a dialog with full config — no defaults applied.</dd>
    <dt><code>success&lt;F&gt;(config)</code> → <code>Promise&lt;TbxMatDialogResult&lt;void, F&gt;&gt;</code></dt>
    <dd>Open a success dialog (success icon + severity, OK button).</dd>
    <dt><code>error&lt;F&gt;(config)</code> → <code>Promise&lt;TbxMatDialogResult&lt;void, F&gt;&gt;</code></dt>
    <dd>Open an error dialog (error icon + severity, OK button).</dd>
    <dt><code>warning&lt;F&gt;(config)</code> → <code>Promise&lt;TbxMatDialogResult&lt;void, F&gt;&gt;</code></dt>
    <dd>Open a warning dialog (warning icon + severity, OK button).</dd>
    <dt><code>information&lt;F&gt;(config)</code> → <code>Promise&lt;TbxMatDialogResult&lt;void, F&gt;&gt;</code></dt>
    <dd>Open an informational dialog (info icon + severity, OK button).</dd>
    <dt><code>help&lt;F&gt;(config)</code> → <code>Promise&lt;TbxMatDialogResult&lt;void, F&gt;&gt;</code></dt>
    <dd>Open a help dialog (help icon + severity, OK button).</dd>
    <dt><code>default&lt;F&gt;(config)</code> → <code>Promise&lt;TbxMatDialogResult&lt;void, F&gt;&gt;</code></dt>
    <dd>Open a default-severity (neutral) dialog (default icon + severity, OK button).</dd>
    <dt><code>confirm&lt;F&gt;(config)</code> → <code>Promise&lt;TbxMatDialogResult&lt;void, F&gt;&gt;</code></dt>
    <dd>Open a confirmation dialog (help icon + Help severity, Yes/No buttons).</dd>
    <dt><code>input&lt;T, F&gt;(config)</code> → <code>Promise&lt;TbxMatDialogResult&lt;T, F&gt;&gt;</code></dt>
    <dd>Open an input dialog (info icon + Information severity, OK/Cancel buttons, projected content component).</dd>
</dl>

### TbxMatDialogResult&lt;T, F&gt;

<dl>
    <dt><code>result</code> (<code>TbxMatDialogDismissReason</code>)</dt>
    <dd>Which action closed the dialog.</dd>
    <dt><code>data</code> (<code>T | undefined</code>)</dt>
    <dd>Value returned by the projected content component on Affirm. Undefined for non-input dialogs and for non-Affirm dismissals.</dd>
    <dt><code>footerValues</code> (<code>F</code>)</dt>
    <dd>Values from footer controls, keyed by control <code>key</code>. Empty object on Cancel / Deny / Close.</dd>
</dl>

### TbxMatDialogDismissReason

<dl>
    <dt><code>Affirm</code></dt>
    <dd>User confirmed (OK / Yes / Save / Delete).</dd>
    <dt><code>Deny</code></dt>
    <dd>User explicitly declined (No).</dd>
    <dt><code>Cancel</code></dt>
    <dd>User aborted (Cancel button).</dd>
    <dt><code>Close</code></dt>
    <dd>User dismissed without choosing (close button, Escape, backdrop).</dd>
</dl>

### TbxMatDialogConfig&lt;T&gt;

<dl>
    <dt><code>title</code> (<code>string</code>)</dt>
    <dd>Dialog title (required).</dd>
    <dt><code>icon</code> (<code>string</code>)</dt>
    <dd>Material icon name override (font ligature). When omitted, the icon is resolved from <code>type</code> via the configured severity icon resolver.</dd>
    <dt><code>subtitle</code> (<code>string</code>)</dt>
    <dd>Secondary text shown below the title.</dd>
    <dt><code>contextBadge</code> (<code>string</code>)</dt>
    <dd>Compact chip shown next to the title (e.g. "Beta", "v2").</dd>
    <dt><code>message</code> (<code>string</code>)</dt>
    <dd>Body text. Ignored when <code>content</code> is provided.</dd>
    <dt><code>type</code> (<code>TbxMatSeverityLevel</code>)</dt>
    <dd>Severity level — drives icon, header chip color, primary button color, and the per-severity panel class.</dd>
    <dt><code>content</code> (<code>Type&lt;TbxMatDialogData&lt;T&gt;&gt;</code>)</dt>
    <dd>Component class projected into the body for input dialogs.</dd>
    <dt><code>footer</code> (<code>readonly TbxMatDialogFooterControlType[]</code>)</dt>
    <dd>Footer items (buttons + form controls). When omitted, the service applies the method's default preset.</dd>
    <dt><code>width</code>, <code>minWidth</code>, <code>maxWidth</code>, <code>minHeight</code>, <code>maxHeight</code> (<code>string</code>)</dt>
    <dd>Sizing — passed through to <a href="https://material.angular.dev/components/dialog/api">MatDialogConfig ↗</a>.</dd>
    <dt><code>disableClose</code> (<code>boolean</code>)</dt>
    <dd>When <code>true</code>, blocks Escape and backdrop dismissal. The user must interact with a footer button to close. Default: <code>false</code>.</dd>
</dl>

### TbxMatDialogProviderConfig

<dl>
    <dt><code>severityIconResolverService</code> (<code>TbxMatSeverityResolver &amp; TbxMatIconResolver&lt;TbxMatSeverityLevel&gt; &amp; { iconType }</code>)</dt>
    <dd>Severity icon resolver (required).</dd>
    <dt><code>closeIconResolverService</code> (<code>TbxMatDialogIconResolver</code>)</dt>
    <dd>Close button icon resolver. Default: package-provided <code>TbxMatDialogCloseFontIconService</code>.</dd>
</dl>

### TbxMatDialogData&lt;T&gt;

Implemented by components projected into the body of input dialogs.

<dl>
    <dt><code>isValid</code> (<code>Signal&lt;boolean&gt;</code>)</dt>
    <dd>Whether the form is in a valid state. Drives the affirm button's disabled state.</dd>
    <dt><code>value</code> (<code>Signal&lt;T&gt;</code>)</dt>
    <dd>Current value of the form. Included in <code>TbxMatDialogResult.data</code> on Affirm.</dd>
</dl>

### TbxMatDialogConfigArgs&lt;T&gt;

`{ title: string } & Partial<Omit<TbxMatDialogConfig<T>, 'title'>>` — convenience type for the opinionated methods. Requires `title`; all other fields are optional.

### Footer types

`TbxMatDialogFooterControlType` is a discriminated union over `TbxMatDialogFooterButton`, `TbxMatDialogFooterCheckbox`, `TbxMatDialogFooterToggle`, `TbxMatDialogFooterRadioGroup`, and `TbxMatDialogFooterToggleGroup`. Every item has `key` and `align: 'start' | 'end'`. Buttons additionally take `label`, `icon` / `iconPosition`, `emphasis: 'primary' | 'destructive' | 'text'`, `result: TbxMatDialogDismissReason`, and an optional `disabled: boolean | Signal<boolean>`.

Convenience presets are exported alongside:

- `TBX_MAT_DIALOG_BUTTONS_OK` — single OK (Affirm, primary, end-aligned).
- `TBX_MAT_DIALOG_BUTTONS_OK_CANCEL` — Cancel (start) + OK (end).
- `TBX_MAT_DIALOG_BUTTONS_YES_NO` — both end-aligned, Yes primary.
- `TBX_MAT_DIALOG_BUTTONS_YES_NO_CANCEL` — Cancel left, No + Yes right.

## Styling

Dialog appearance is driven by [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme). Importing `tbx-mat-dialogs` styles emits `--tbx-mat-dialog-{level}-{background,text}` aliases for all six severity tiers, plus per-package opacity tokens used by the severity-aware action button variants. The dialog overlay's `panelClass` includes a per-severity class (`.tbx-mat-dialog-panel-{level}`) that exposes the active severity's tokens as `--tbx-mat-dialog-current-{background,text}` for the header icon container and the primary action button.

### Color tokens

The shared severity-theme mixin emits per-level pairs. Themes can override the dialog-prefixed aliases (affects only dialogs) or the underlying `--tbx-mat-severity-{level}-*` tokens (affects every severity-aware `@teqbench` package).

<dl>
    <dt><code>--tbx-mat-dialog-default-background</code> / <code>--tbx-mat-dialog-default-text</code></dt>
    <dd>Default tier (theme-responsive — aliases the M3 surface tokens).</dd>
    <dt><code>--tbx-mat-dialog-success-background</code> / <code>--tbx-mat-dialog-success-text</code></dt>
    <dd>Success tier.</dd>
    <dt><code>--tbx-mat-dialog-error-background</code> / <code>--tbx-mat-dialog-error-text</code></dt>
    <dd>Error tier (also used by the always-Error <code>destructive</code> button emphasis).</dd>
    <dt><code>--tbx-mat-dialog-warning-background</code> / <code>--tbx-mat-dialog-warning-text</code></dt>
    <dd>Warning tier.</dd>
    <dt><code>--tbx-mat-dialog-information-background</code> / <code>--tbx-mat-dialog-information-text</code></dt>
    <dd>Information tier.</dd>
    <dt><code>--tbx-mat-dialog-help-background</code> / <code>--tbx-mat-dialog-help-text</code></dt>
    <dd>Help tier.</dd>
</dl>

### Inverted palette

Inverted (white backgrounds with colored text) flips at the [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme) layer. Wire it once at bootstrap; banners, notifications, and dialogs invert simultaneously:

```typescript
// app.config.ts
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';

providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })];
```

### Action button opacity tokens

Mirrors the `@teqbench/tbx-mat-banners` and `@teqbench/tbx-mat-notifications` set verbatim — defined globally so consumers can override without touching individual severity classes.

<dl>
    <dt><code>--tbx-mat-dialog-action-text-opacity</code></dt>
    <dd>Default: <code>0.8</code>.</dd>
    <dt><code>--tbx-mat-dialog-action-filled-container-opacity</code> / <code>--tbx-mat-dialog-action-tonal-container-opacity</code></dt>
    <dd>Default: text-opacity / <code>0.55</code>.</dd>
    <dt><code>--tbx-mat-dialog-action-outlined-opacity</code> / <code>--tbx-mat-dialog-action-elevated-opacity</code> / <code>--tbx-mat-dialog-action-icon-opacity</code> / <code>--tbx-mat-dialog-close-icon-opacity</code></dt>
    <dd>Default: text-opacity.</dd>
    <dt><code>--tbx-mat-dialog-action-filled-hover-state-layer-opacity</code> / <code>--tbx-mat-dialog-action-tonal-hover-state-layer-opacity</code></dt>
    <dd>Default: <code>0.3</code> / filled-hover-state-layer.</dd>
</dl>

### Surface

The dialog overlay panel uses `MatDialog`'s surface element. The package's global SCSS scopes a small set of structural overrides:

- `.tbx-mat-dialog-panel .mat-mdc-dialog-container .mat-mdc-dialog-surface` — removes Material's default padding (the shell manages its own via `--dialog-padding-inline`) and rounds the corners to `1rem`.

Beyond that, the overlay surface is a regular Material theme background — `tbx-mat-dialogs` does not theme it.

## Accessibility

- **Modal semantics.** Dialogs render via [Angular Material's MatDialog ↗](https://material.angular.dev/components/dialog/api), which sets `aria-modal="true"`, manages the backdrop, and traps keyboard focus inside the overlay until dismissal. The title is the dialog's `aria-labelledby` target via `matDialogTitle`.
- **Focus.** Initial focus uses Material's default `'first-tabbable'`. For input dialogs, content components should apply the `cdkFocusInitial` HTML attribute to the element that should receive initial focus — this is recognized by the [CDK FocusTrap ↗](https://material.angular.dev/cdk/a11y/api#FocusTrap) without any directive import. Without it, the first tabbable element in DOM order receives focus (typically the close button).
- **Keyboard.** `Escape` dismisses the dialog with `Close` unless `disableClose: true` is set. `Tab` cycles through focusable elements within the dialog. Footer buttons activate on `Enter` and `Space`; form controls use their native [Angular Material ↗](https://material.angular.dev) keyboard behavior.
- **Reduced motion.** [Angular Material's MatDialog ↗](https://material.angular.dev/components/dialog/api) honors `prefers-reduced-motion: reduce` for its open/close animation.
- **Color contrast.** The default severity palette meets [WCAG ↗](https://www.w3.org/WAI/standards-guidelines/wcag/) AA contrast for text on each severity background. Overriding the severity CSS custom properties is the consumer's responsibility to re-verify.
- **Icons.** Severity and close icons are decorative and marked `aria-hidden`; meaning is carried by the title and message text and by the close button's `aria-label`.

## Compatibility

<!-- Kept as a pipe table until teqbench/.github#22 lands; the centralized CI README version-check regex extracts versions from this exact shape. -->

| Dependency                                                                               | Version  |
| ---------------------------------------------------------------------------------------- | -------- |
| [Angular ↗](https://angular.dev)                                                         | >=21.0.0 |
| [Angular CDK ↗](https://material.angular.dev/cdk)                                        | >=21.0.0 |
| [Angular Material ↗](https://material.angular.dev)                                       | >=21.0.0 |
| [@teqbench/tbx-mat-icons ↗](https://github.com/teqbench/tbx-mat-icons)                   | >=4.0.0  |
| [@teqbench/tbx-mat-severity-theme ↗](https://github.com/teqbench/tbx-mat-severity-theme) | >=8.0.0  |
| [TypeScript ↗](https://www.typescriptlang.org)                                           | ~5.9.0   |
| [Node.js ↗](https://nodejs.org)                                                          | >=24.0.0 |

## Related packages

- [`@teqbench/tbx-mat-notifications` ↗](https://github.com/teqbench/tbx-mat-notifications) — transient, single-action messages for lightweight acknowledgements.
- [`@teqbench/tbx-mat-banners` ↗](https://github.com/teqbench/tbx-mat-banners) — wide, persistent messages with multiple action controls for situations between notifications and dialogs.
- [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme) — severity enum, abstract icon-service bases, default icon sets, shared SCSS color tokens, and the inverted-palette provider helper consumed by this package.
- [`@teqbench/tbx-mat-icons` ↗](https://github.com/teqbench/tbx-mat-icons) — shared icon resolver contracts and base services.

## Versioning & releases

This package follows [Semantic Versioning ↗](https://semver.org). Versions and changelog entries are produced automatically by [Release Please ↗](https://github.com/googleapis/release-please) from [Conventional Commits ↗](https://www.conventionalcommits.org) on `main`. See [CHANGELOG.md](CHANGELOG.md) for the full release history.

## Contributing

Contributions are welcome. See the [contributing guide ↗](https://github.com/teqbench/.github/blob/main/CONTRIBUTING.md) for local setup, [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) authentication, branch conventions, commit format, and the PR workflow.

## Security

See the [security policy ↗](https://github.com/teqbench/.github/blob/main/SECURITY.md) for the supported-version policy and how to report a vulnerability privately.

## Feedback

- [Report a bug ↗](https://github.com/teqbench/tbx-mat-dialogs/issues/new?template=bug_report.md)
- [Request a feature ↗](https://github.com/teqbench/tbx-mat-dialogs/issues/new?template=feature_request.md)

## License

[AGPL-3.0](LICENSE) — Copyright 2026 TeqBench
