# Changelog

## 1.1.0 - 2026-11-18 (i18n fork, test build)

Unofficial fork by akira tamcat. Not released on npm or the Joplin plugin repository.

- Settings UI translated with gettext PO files: Japanese, Chinese (Simplified and Traditional), Korean, German, French, Spanish, Italian, Portuguese (Brazil) and Russian
- The UI language follows Joplin's language setting, falling back to English
- New plugin ID `plugin.tnoahc.pdf-header-footer-i18n` and name **PDF Header & Footer i18n**, so it doesn't replace the original plugin
- The build now needs Node.js to convert the PO files

## 1.0.0 - 2026-11-06

First release.

- Header and footer on every page of notes exported to PDF, with separate left, centre and right text
- `{page}`, `{pages}` and `{date}` placeholders
- Optional separator lines under the header and above the footer
- Settings for font size and top and bottom page margins
- Known limitation: **File → Print** doesn't include the header and footer, because Joplin doesn't load plugins when printing. Export to PDF first, then print the PDF.
