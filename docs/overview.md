---
tagline: An opinionated [Angular ↗](https://angular.dev) modal dialog service built on [Angular Material's MatDialog ↗](https://material.angular.dev/components/dialog/api) with severity-leveled methods (success / error / warning / information / help / default), dialog-specific UX patterns (confirm / input), pluggable severity and close icons, and rich footer controls.
---

## Overview

`@teqbench/tbx-mat-dialogs` provides modal dialogs for [Angular ↗](https://angular.dev) applications. It complements small transient notifications and persistent banners with a heavier surface for focused interactions: long copy, multi-step input, complex confirmation flows, and arbitrary projected content. Dialogs render via [Angular Material's MatDialog ↗](https://material.angular.dev/components/dialog/api), which manages overlay, backdrop, focus trap, and modal semantics.

`TbxMatDialogService` exposes nine opinionated methods. Six mirror the severity-leveled surface of [`tbx-mat-banners` ↗](https://github.com/teqbench/tbx-mat-banners) and [`tbx-mat-notifications` ↗](https://github.com/teqbench/tbx-mat-notifications) — `success`, `error`, `warning`, `information`, `help`, and `default`. Two are dialog-specific UX patterns layered on top of severity — `confirm` (Yes/No) and `input` (form content with OK/Cancel). The ninth, `show`, takes a full configuration for cases where the opinionated methods do not fit. All methods return a `Promise<TbxMatDialogResult<T, F>>` so consumers can `await` the user's choice with no subscription management.

Severity (`default`, `success`, `error`, `warning`, `information`, `help`) drives the entire dialog surface — header, body, and footer share the severity background and text. The six CSS custom-property pairs are aliased from the shared [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme) tokens, so the colored tiers stay independent of the active [M3 ↗](https://m3.material.io) theme palette while the `default` tier remains theme-responsive. Applications can opt into an inverted palette across every severity-aware `@teqbench` package by calling `provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })` at bootstrap.

The footer is a single flex row of buttons and form controls (checkboxes, toggles, radio groups, toggle groups). On dismiss, all collected control values are returned alongside the dismiss reason. Input dialogs project a consumer-defined component into the body — the component implements `TbxMatDialogData<T>` with two signals (`isValid`, `value`); the shell reads them to drive the affirm button's disabled state and to extract the form value on confirm.

The library is designed for [Angular ↗](https://angular.dev) 21+ applications, and exposes a pluggable icon resolver so consumers can use [Material Symbols ↗](https://fonts.google.com/icons) font icons or bundled SVG icons without changing component code.

## When to use

Dialogs are one of three message surfaces in the TeqBench component family. Choose based on the weight of the message and how much interaction it needs:

- [`@teqbench/tbx-mat-notifications` ↗](https://github.com/teqbench/tbx-mat-notifications) — small, transient messages with at most one action control. Ideally one line of text, two lines acceptable. Use notifications to acknowledge something without interrupting the user's flow.
- [`@teqbench/tbx-mat-banners` ↗](https://github.com/teqbench/tbx-mat-banners) — wide, persistent messages with multiple action controls. Ideally one line of message text, up to three lines still acceptable. Use a banner when the message needs the user's attention and may offer a few follow-up choices.
- **`@teqbench/tbx-mat-dialogs`** (this package) — heavier, focused interactions for arbitrary content. Use a dialog when the message is long, the choices are many, or the interaction is complex.

Reach for a dialog when a notification or a banner would be stretched past its envelope: long copy, many controls, multi-step input, or anything that demands the user's focused attention. If a banner is approaching the three-line limit or its actions group is growing beyond a handful of controls, that is the signal to promote it to a dialog.
