// Plain-JS Joplin plugin: Joplin provides the `joplin` global in the plugin sandbox.

const SECTION = 'pdfHeaderFooter';

// SettingItemType enum values from the plugin API (Int = 1, String = 2, Bool = 3).
const TYPE_INT = 1;
const TYPE_STRING = 2;
const TYPE_BOOL = 3;

// UI translations. build.sh prepends PO_TRANSLATIONS, generated from
// src/locales/*.po; when src/ is loaded directly it is undefined and the UI
// stays in English.
const TRANSLATIONS = typeof PO_TRANSLATIONS !== 'undefined' ? PO_TRANSLATIONS : {};
let catalog = {};

function _(text) {
	return catalog[text] || text;
}

// Picks the catalog for a Joplin locale such as "ja_JP", "zh_TW" or "pt_BR":
// exact match first, then the language alone, then another region of the same
// language. Hong Kong and Macau use the Traditional Chinese catalog.
function findCatalog(locale) {
	const normalized = String(locale || '').replace('-', '_');
	const lang = normalized.split('_')[0].toLowerCase();
	if (!lang) return {};
	if (TRANSLATIONS[normalized]) return TRANSLATIONS[normalized];
	if (lang === 'zh' && /_(HK|MO|Hant)/i.test(normalized) && TRANSLATIONS.zh_TW) return TRANSLATIONS.zh_TW;
	if (TRANSLATIONS[lang]) return TRANSLATIONS[lang];
	const sameLang = Object.keys(TRANSLATIONS).find(key => key.split('_')[0].toLowerCase() === lang);
	return sameLang ? TRANSLATIONS[sameLang] : {};
}

async function loadCatalog() {
	try {
		catalog = findCatalog(await joplin.settings.globalValue('locale'));
	} catch (error) {
		console.warn('PDF Header & Footer i18n: could not read the Joplin locale', error);
		catalog = {};
	}
}

function textSetting(label, value) {
	return {
		value, type: TYPE_STRING, section: SECTION, public: true, label,
		description: _('Placeholders: {page}, {pages}, {date}. Leave empty for nothing.'),
	};
}

joplin.plugins.register({
	onStart: async function () {
		await loadCatalog();

		await joplin.settings.registerSection(SECTION, {
			label: _('PDF Header & Footer'),
			iconName: 'fas fa-file-pdf',
			description: _('Text printed at the top and bottom of every page when a note is exported to PDF.'),
		});

		await joplin.settings.registerSettings({
			headerLeft: textSetting(_('Header - left'), ''),
			headerCenter: textSetting(_('Header - centre'), ''),
			headerRight: textSetting(_('Header - right'), ''),
			footerLeft: textSetting(_('Footer - left'), ''),
			footerCenter: textSetting(_('Footer - centre'), ''),
			// The default text is printed in the PDF and is intentionally not translated.
			footerRight: textSetting(_('Footer - right'), 'Page {page} of {pages}'),
			showLines: {
				value: true, type: TYPE_BOOL, section: SECTION, public: true,
				label: _('Draw a line under the header and above the footer'),
			},
			fontSize: {
				value: 8, type: TYPE_INT, section: SECTION, public: true, minimum: 5, maximum: 20,
				label: _('Font size (pt)'),
			},
			marginTop: {
				value: 20, type: TYPE_INT, section: SECTION, public: true, minimum: 5, maximum: 60,
				label: _('Top page margin (mm)'),
				description: _('Space reserved for the header.'),
			},
			marginBottom: {
				value: 20, type: TYPE_INT, section: SECTION, public: true, minimum: 5, maximum: 60,
				label: _('Bottom page margin (mm)'),
				description: _('Space reserved for the footer.'),
			},
		});

		await joplin.contentScripts.register('markdownItPlugin', 'pdfHeaderFooter', './contentScript.js');
	},
});
