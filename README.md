# PDF Header & Footer i18n for Joplin

[![Latest release](https://img.shields.io/github/v/release/akiratamcat/joplin-pdf-header-footer?include_prereleases)](https://github.com/akiratamcat/joplin-pdf-header-footer/releases)

> **Unofficial test build.** This is a personal fork of [PDF Header & Footer](https://github.com/tnoahc/joplin-pdf-header-footer) by Noah C. Tarinyebwa. It adds translations of the settings UI (gettext PO files) and follows Joplin's language setting automatically. It has its own plugin ID (`plugin.tnoahc.pdf-header-footer-i18n`), so don't enable it together with the original plugin, or the header and footer are printed twice. It isn't published to npm or the Joplin plugin repository.
>
> **非公式のテスト版です。** Noah C. Tarinyebwa 氏の [PDF Header & Footer](https://github.com/tnoahc/joplin-pdf-header-footer) を個人的に fork し、設定画面の UI 翻訳（gettext PO ファイル）を追加したものです。表示言語は Joplin の言語設定に合わせて自動で切り替わります。プラグイン ID（`plugin.tnoahc.pdf-header-footer-i18n`）が原版と異なるため、原版と同時に有効にしないでください（ヘッダーとフッターが二重に印字されます）。npm と Joplin のプラグインリポジトリには公開していません。

A [Joplin](https://joplinapp.org/) plugin that adds a header and footer to **every page** of a note when you export it to PDF. You set the text in Joplin's settings, so you don't need to edit CSS.

- Separate left, centre and right text for both the header and the footer
- Page numbers and the date through placeholders
- Optional lines under the header and above the footer
- Adjustable font size and top and bottom page margins
- The note viewer is unchanged: the header and footer appear only in exported PDFs
- Settings UI in English, Japanese, Chinese (Simplified and Traditional), Korean, German, French, Spanish, Italian, Portuguese (Brazil) and Russian, following Joplin's language setting
<img width="3072" height="1564" alt="Screenshot From 2026-11-06 10-39-20" src="https://github.com/user-attachments/assets/6e5e851d-964f-4ceb-a762-cf42fea7e882" />

## Requirements

Joplin desktop 3.2 or later.

## Installation

1. Download `plugin.tnoahc.pdf-header-footer-i18n.jpl` from the [releases page](https://github.com/akiratamcat/joplin-pdf-header-footer/releases).
2. In Joplin, open **Tools → Options → Plugins**, click the ⚙ button, and choose **Install from file**.
3. Select the downloaded `.jpl` file and restart Joplin.

## Usage

Open **Tools → Options → PDF Header & Footer** (the section name is translated with the UI) and fill in any of the six text fields:

| Setting | Position on the page |
| --- | --- |
| Header - left / centre / right | Top margin |
| Footer - left / centre / right | Bottom margin |

Leave a field empty to print nothing in that position. You can use these placeholders in any field:

| Placeholder | Replaced with |
| --- | --- |
| `{page}` | Current page number |
| `{pages}` | Total number of pages |
| `{date}` | Export date, in your system's date format |

For example, `Page {page} of {pages}` prints "Page 2 of 5".

Then export a note as usual with **File → Export → PDF**.

If your custom stylesheet already adds a header or footer, for example with `.exported-note::before` or `::after`, remove those rules so the text doesn't appear twice.

## Known limitations

- **File → Print doesn't include the header and footer.** Joplin doesn't load plugins when it prints directly. Export to PDF first, then print the PDF.
- The note title can't be used as a placeholder. Joplin already prints the title at the top of the note.

## How it works

The plugin registers a Markdown-it content script. The script adds a CSS [`@page`](https://developer.mozilla.org/docs/Web/CSS/@page) rule with page margin boxes to the rendered note, built from your settings. Joplin's PDF export prints that rendered HTML, so the header and footer repeat on every page. `@page` rules only apply when printing, which is why the viewer doesn't change.

## Translations

The settings UI is translated with gettext PO files in `src/locales/`:

- `messages.pot` is the template. Its msgids are the English strings in `src/index.js`.
- `<locale>.po` holds one language, named after Joplin's locale codes: `ja`, `zh_CN`, `zh_TW`, `ko`, `de`, `fr`, `es`, `it`, `pt_BR`, `ru`.

When the plugin starts, it reads Joplin's language setting and picks the catalog for the exact locale (`zh_TW`), then the language (`ja_JP` → `ja`), then another region of the same language (`pt_PT` → `pt_BR`). Anything else falls back to English. After you change Joplin's language, restart Joplin.

To add a language, copy `messages.pot` to `<locale>.po`, set the `Language` header and fill in the `msgstr` lines. To add a string, wrap it in `_()` in `src/index.js` and add its msgid to `messages.pot` and to every `.po` file. Keep the `{page}`, `{pages}` and `{date}` placeholders unchanged. The build fails if a `.po` file is missing a msgid or changes a placeholder. Untranslated (empty or fuzzy) entries fall back to English.

The default footer text, `Page {page} of {pages}`, is printed in the PDF and is deliberately not translated.

## Development

The plugin is plain JavaScript. The build converts the PO files to JavaScript and prepends them to `index.js` in `dist/`, so it needs [Node.js](https://nodejs.org/).

```sh
sh build.sh      # or: npm run dist
npm test         # builds, then checks the UI language for several Joplin locales
```

This writes `publish/plugin.tnoahc.pdf-header-footer-i18n.jpl` and the matching `.json` file.

To try your changes in Joplin:

1. Run `sh build.sh`.
2. Start Joplin in [Development Mode](https://joplinapp.org/help/api/references/development_mode) with `Joplin --env dev`.
3. In **Tools → Options → Plugins → Advanced Settings**, set **Development plugins** to the full path of this repository's `dist` folder. If you point it at `src` instead, the UI stays in English.
4. Restart Joplin. After you edit a file, build and restart again.

## License

[MIT](LICENSE) © 2026 Noah C. Tarinyebwa. i18n fork © 2026 akira tamcat.
