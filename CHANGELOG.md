# Changelog

## [1.0.1](https://github.com/teqbench/tbx-mat-dialogs/compare/v1.0.0...v1.0.1) (2026-05-06)


### Bug Fixes

* **claude+docs:** forward-port Markdown Tables section, publish docs assets, sharpen APF parenthetical ([00ac084](https://github.com/teqbench/tbx-mat-dialogs/commit/00ac08408cca0bdcb5dc5076b5198cb34b22c08e))
* **claude:** add Markdown Tables Convention section ([d00cb22](https://github.com/teqbench/tbx-mat-dialogs/commit/d00cb223fd4a1018864891443838bc022b1b25c6))
* **claude:** describe actual APF exports shape in Publishing section ([e954907](https://github.com/teqbench/tbx-mat-dialogs/commit/e95490719bdda05b078c7cfadaec2b8c2c0c690f))
* **docs:** publish docs/ assets and align CLAUDE.md description ([349b122](https://github.com/teqbench/tbx-mat-dialogs/commit/349b1229fcfd601396fb263bac325a7fda04454f))

## [1.0.0](https://github.com/teqbench/tbx-mat-dialogs/compare/v0.1.1...v1.0.0) (2026-05-06)


### ⚠ BREAKING CHANGES

* **styles:** rewrite SCSS to use shared severity-theme mixin and six panel classes ([#46](https://github.com/teqbench/tbx-mat-dialogs/issues/46))
* **api:** The TBX_MAT_DIALOG_ICON_SERVICE injection token and TbxMatDialogIconService class are removed. Consumers must provide TBX_MAT_DIALOG_PROVIDER_CONFIG with a severityIconResolverService — either TbxMatDialogSeverityFontIconService (font icons) or TbxMatDialogSeveritySvgIconService (SVG icons). Icon resolution is now required (no fallback): if no resolver registers an icon for a given severity, no header icon is rendered.
* **api:** TbxMatDialogEmphasisType is removed; consumers must use TbxMatSeverityLevel from @teqbench/tbx-mat-severity-theme. The TbxMatDialogConfig.emphasis field is renamed to type. New service methods success(), help(), default() are additive.
* **api:** rename all public exports to TbxMat* prefix ([#42](https://github.com/teqbench/tbx-mat-dialogs/issues/42))
* **deps:** peer dependency on @teqbench/tbx-mat-severity-icons is removed. Consumers must install @teqbench/tbx-mat-severity-theme (^8.0.0) and @teqbench/tbx-mat-icons (^4.0.0) and update any custom DIALOG_ICON_SERVICE implementations to import from the new packages.

### Features

* **api:** adopt TbxMatSeverityLevel; add success/help/default service methods ([#44](https://github.com/teqbench/tbx-mat-dialogs/issues/44)) ([0497d81](https://github.com/teqbench/tbx-mat-dialogs/commit/0497d811cb2ab677768b5288ec8c53e0e40d88cd))
* **api:** introduce TBX_MAT_DIALOG_PROVIDER_CONFIG with three pluggable icon services ([#45](https://github.com/teqbench/tbx-mat-dialogs/issues/45)) ([6bea684](https://github.com/teqbench/tbx-mat-dialogs/commit/6bea684505885d8c482e03adcb31cf3f8e2ac230))
* **api:** rename all public exports to TbxMat* prefix ([#42](https://github.com/teqbench/tbx-mat-dialogs/issues/42)) ([e3c554d](https://github.com/teqbench/tbx-mat-dialogs/commit/e3c554dbe1e8e7990138855ec5e5d4dfed3d2648))
* **community:** adopt org-default community health files ([4d616d0](https://github.com/teqbench/tbx-mat-dialogs/commit/4d616d0f9d420129fa7ff9abcfc7e1774449faf3))
* **component, styles, storybook:** align dialog severity styling end-to-end with banners/notifications ([c8caeec](https://github.com/teqbench/tbx-mat-dialogs/commit/c8caeec810e76ed582c6ec710949bea52aec71b6))
* **deps:** replace tbx-mat-severity-icons with tbx-mat-severity-theme 8.0.2 ([4d84832](https://github.com/teqbench/tbx-mat-dialogs/commit/4d848326b43519a1e004d69060656298a43da316))
* **storybook:** add narrative docs-mode stories for confirm, input, and custom ([#62](https://github.com/teqbench/tbx-mat-dialogs/issues/62)) ([1975a8e](https://github.com/teqbench/tbx-mat-dialogs/commit/1975a8e1e47868d29d1a1660156db04a8e949e84))
* **storybook:** split dev + docs stories into the banners/notifications scaffolding pattern ([#47](https://github.com/teqbench/tbx-mat-dialogs/issues/47)) ([fb4ebc4](https://github.com/teqbench/tbx-mat-dialogs/commit/fb4ebc47e1d2c8a3f779381979f0e34d320ca184))
* **storybook:** split into dev and docs flavors via STORYBOOK_MODE ([f451615](https://github.com/teqbench/tbx-mat-dialogs/commit/f45161592c472789297ed9bffb10ebf58e9404f2))


### Bug Fixes

* **dialogs:** keep close button out of initial focus ([bb326d2](https://github.com/teqbench/tbx-mat-dialogs/commit/bb326d20ffb45d044f3e589023bf3639c976ec90))
* **dialogs:** use 'dialog' autoFocus only when no actionable target exists ([4b8e8ff](https://github.com/teqbench/tbx-mat-dialogs/commit/4b8e8ffd6bb1ac99077452ee25e3887af0a40979))
* **storybook:** correct narrative dialog story fixes flagged on review ([84410b3](https://github.com/teqbench/tbx-mat-dialogs/commit/84410b36c4c37be339fbcffba85b7cd1712589c0))
* **storybook:** let destructive story resolve its severity icon ([b3b0481](https://github.com/teqbench/tbx-mat-dialogs/commit/b3b0481c5c8cb3f94c55172445ec535438361e4e))
* **storybook:** preload Material Symbols font to prevent initial icon delay ([809ac94](https://github.com/teqbench/tbx-mat-dialogs/commit/809ac94a4aae7b8dccb8b46d82d85b0a3d29689a))
* **storybook:** reorder severity buttons in the dialog harness to match banners/notifications (default first) ([8ec8ac3](https://github.com/teqbench/tbx-mat-dialogs/commit/8ec8ac36119fcd69081dc9403c476b2de5c0b471))


### Code Refactoring

* **styles:** rewrite SCSS to use shared severity-theme mixin and six panel classes ([#46](https://github.com/teqbench/tbx-mat-dialogs/issues/46)) ([e66216b](https://github.com/teqbench/tbx-mat-dialogs/commit/e66216b9df574f83a07064964ea3d781a8b91996))

## [0.1.1](https://github.com/teqbench/tbx-mat-dialogs/compare/v0.1.0...v0.1.1) (2026-04-10)


### Bug Fixes

* **deps:** migrate to @teqbench/tbx-mat-severity-icons v7 API ([6a4dd4f](https://github.com/teqbench/tbx-mat-dialogs/commit/6a4dd4f55bd59fc9d5722fa1c787a48a56df0c08))
* **deps:** migrate to @teqbench/tbx-mat-severity-icons v7 API ([3dbf733](https://github.com/teqbench/tbx-mat-dialogs/commit/3dbf73387d6117a7414cc4387691d4c7d8f19d09))

## 0.1.0 (2026-03-27)


### Features

* **dialogs:** configure @teqbench/tbx-mat-dialogs package ([844b62a](https://github.com/teqbench/tbx-mat-dialogs/commit/844b62aaf72294d5ed31a1929e62775ded25799c))
* **dialogs:** implement dialog service, shell component, and supporting types ([d8372d7](https://github.com/teqbench/tbx-mat-dialogs/commit/d8372d72325b768a0f33fdc8e9a2f80c4f4e0b22))
* **dialogs:** implement dialog service, shell component, and supporting types ([9171962](https://github.com/teqbench/tbx-mat-dialogs/commit/9171962d8fa34968a0b885149dd099e0d2d4aa43))
* **storybook:** add Storybook with dialog harness and light/dark theme support ([00f7842](https://github.com/teqbench/tbx-mat-dialogs/commit/00f784279a79666127cc55fd6f63c4d1fde34395))
* **storybook:** add Storybook with dialog harness and theme support ([52a5768](https://github.com/teqbench/tbx-mat-dialogs/commit/52a57688eb7cffd69cd224a98e9d41da3f2c20c1))


### Bug Fixes

* **deps:** move tbx-mat-severity-icons to peerDependencies ([6d5a904](https://github.com/teqbench/tbx-mat-dialogs/commit/6d5a904971143586f36f831ac1522b2a2e06226b))
* **deps:** regenerate package-lock.json for npm ci compatibility ([e488394](https://github.com/teqbench/tbx-mat-dialogs/commit/e488394272abd87d229443a373e1459a33363ef4))
* **dialogs:** only return footerValues on affirm ([6e02d28](https://github.com/teqbench/tbx-mat-dialogs/commit/6e02d28400c7d6814240711377242a14ffd08e38))
* **dialogs:** use Material icon projection, fix focus, add ariaModal ([4bc96d7](https://github.com/teqbench/tbx-mat-dialogs/commit/4bc96d73f17f20b5053e8f42b40619f2583f3452))
* **docs:** correct README imports, export icon token, add Storybook to CLAUDE.md ([9e94000](https://github.com/teqbench/tbx-mat-dialogs/commit/9e940005abc3ef1899e8816e573564c6c0a41774))

## Changelog
