# PDF Header & Footer for Joplin

[![npm version](https://img.shields.io/npm/v/joplin-plugin-pdf-header-footer)](https://www.npmjs.com/package/joplin-plugin-pdf-header-footer)
[![npm downloads](https://img.shields.io/npm/dm/joplin-plugin-pdf-header-footer)](https://www.npmjs.com/package/joplin-plugin-pdf-header-footer)
[![GitHub downloads](https://img.shields.io/github/downloads/tnoahc/joplin-pdf-header-footer/total?label=GitHub%20downloads)](https://github.com/tnoahc/joplin-pdf-header-footer/releases)
[![Joplin installs](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fjoplin%2Fplugins%2Fmaster%2Fstats.json&query=%24%5B%27plugin.tnoahc.pdf-header-footer%27%5D%5B%271.0.0%27%5D.downloadCount&label=Joplin%20installs)](https://joplinapp.org/plugins/plugin/plugin.tnoahc.pdf-header-footer/)
[![Latest release](https://img.shields.io/github/v/release/tnoahc/joplin-pdf-header-footer)](https://github.com/tnoahc/joplin-pdf-header-footer/releases/latest)

A [Joplin](https://joplinapp.org/) plugin that adds a header and footer to **every page** of a note when you export it to PDF. You set the text in Joplin's settings, so you don't need to edit CSS.

- Separate left, centre and right text for both the header and the footer
- Page numbers and the date through placeholders
- Optional lines under the header and above the footer
- Adjustable font size and top and bottom page margins
- The note viewer is unchanged: the header and footer appear only in exported PDFs
<img width="3072" height="1564" alt="Screenshot From 2026-11-06 10-39-20" src="https://github.com/user-attachments/assets/6e5e851d-964f-4ceb-a762-cf42fea7e882" />

## Requirements

Joplin desktop 3.2 or later.

## Installation

In Joplin, open **Tools → Options → Plugins**, search for **PDF Header & Footer**, click **Install**, and restart Joplin.

To install it manually instead:

1. Download `plugin.tnoahc.pdf-header-footer.jpl` from the [latest release](https://github.com/tnoahc/joplin-pdf-header-footer/releases/latest).
2. In Joplin, open **Tools → Options → Plugins**, click the ⚙ button, and choose **Install from file**.
3. Select the downloaded `.jpl` file and restart Joplin.

The plugin is also published on npm as [`joplin-plugin-pdf-header-footer`](https://www.npmjs.com/package/joplin-plugin-pdf-header-footer).

## Usage

Open **Tools → Options → PDF Header & Footer** and fill in any of the six text fields:

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

## Development

The plugin is plain JavaScript in `src/`, so there's no compile step.

1. Start Joplin in [Development Mode](https://joplinapp.org/help/api/references/development_mode) with `Joplin --env dev`.
2. In **Tools → Options → Plugins → Advanced Settings**, set **Development plugins** to the full path of this repository's `src` folder.
3. Restart Joplin. After you edit a file, restart again to reload the plugin.

To build the installable package, run:

```sh
sh build.sh      # or: npm run dist
```

This writes `publish/plugin.tnoahc.pdf-header-footer.jpl` and the matching `.json` file that the Joplin plugin repository reads. See [RELEASING.md](RELEASING.md) for how to publish a new version.

## License

[MIT](LICENSE) © 2026 Noah C. Tarinyebwa
