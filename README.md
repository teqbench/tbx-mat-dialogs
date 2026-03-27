# @teqbench/tbx-mat-dialogs

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-dialogs-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-dialogs-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-dialogs-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-dialogs-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-dialogs-main-build-number.json)

> Opinionated Angular dialog service built on Angular Material dialog. Typed methods for info, warning, error, confirm, and input dialogs returning `Promise<DialogOutput<T, F>>`. Features emphasis-driven styling, rich footer controls, signal-based input validation via `DialogContent`, and pluggable icon resolution. Angular 21+.

## Installation

Configure npm to use GitHub Packages for the `@teqbench` scope:

```bash
echo "@teqbench:registry=https://npm.pkg.github.com" >> .npmrc
```

Install the package:

```bash
npm install @teqbench/tbx-mat-dialogs
```

## Usage

```typescript
import { DialogService, DialogResultType } from '@teqbench/tbx-mat-dialogs';

const dialog = inject(DialogService);

// Informational — info icon, blue emphasis, OK button
await dialog.information({ title: 'Session Expired', message: 'Please sign in again.' });

// Warning — warning icon, amber emphasis, OK button
await dialog.warning({ title: 'Unsaved Changes', message: 'Changes will be lost.' });

// Error — error icon, red emphasis, OK button
await dialog.error({ title: 'Save Failed', message: 'Could not save changes.' });

// Confirmation — help icon, default emphasis, Yes/No buttons
const output = await dialog.confirm({ title: 'Delete?', message: 'This cannot be undone.' });
if (output.result === DialogResultType.Affirm) {
    /* user confirmed */
}

// Input — default emphasis, OK/Cancel, content component for form
const output = await dialog.input<MyData>({ title: 'Enter Details', content: MyFormComponent });
if (output.result === DialogResultType.Affirm) {
    console.log(output.data);
}

// Full control — no defaults applied
await dialog.show({ title: 'Custom', icon: 'build', emphasis: DialogEmphasisType.Warning, message: '...' });
```

### Pluggable icon resolution

Provide a custom icon service to override the default Material Symbols Rounded icons:

```typescript
import { DIALOG_ICON_SERVICE } from '@teqbench/tbx-mat-dialogs';

// In app.config.ts providers:
{ provide: DIALOG_ICON_SERVICE, useClass: MyCustomIconService }
```

### Input dialog focus management

Content components should apply the `cdkFocusInitial` attribute to the element that should receive initial focus. This is a plain HTML attribute recognized by the CDK focus trap — no directive import needed. See `SampleInputComponent` for a reference implementation.

## Compatibility

| Dependency | Version  |
| ---------- | -------- |
| Angular    | >=21.0.0 |
| TypeScript | ~5.9.0   |
| Node.js    | >=24.0.0 |

## License

[Apache-2.0](LICENSE) — Copyright 2025 TeqBench
