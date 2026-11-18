#!/usr/bin/env node
// Runs the built dist/index.js against a mock `joplin` global for several
// Joplin locales and checks which language the settings UI is registered in.
// Run `sh build.sh` first. Usage: node tools/test-i18n.js

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const code = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.js'), 'utf8');

async function register(locale, { failLocale = false } = {}) {
	const result = {};
	let onStart;
	const joplin = {
		plugins: { register: plugin => { onStart = plugin.onStart; } },
		settings: {
			globalValue: async key => {
				assert.strictEqual(key, 'locale');
				if (failLocale) throw new Error('no locale');
				return locale;
			},
			registerSection: async (name, section) => { result.section = section; },
			registerSettings: async settings => { result.settings = settings; },
		},
		contentScripts: { register: async () => {} },
	};
	vm.runInNewContext(code, { joplin, console: { warn: () => {} } });
	await onStart();
	return result;
}

const cases = [
	['ja_JP', 'PDF ヘッダー・フッター', 'ヘッダー - 左'],
	['zh_CN', 'PDF 页眉和页脚', '页眉 - 左'],
	['zh_TW', 'PDF 頁首和頁尾', '頁首 - 左'],
	['zh_HK', 'PDF 頁首和頁尾', '頁首 - 左'],
	['ko_KR', 'PDF 머리글 및 바닥글', '머리글 - 왼쪽'],
	['de_DE', 'PDF-Kopf- und Fußzeile', 'Kopfzeile - links'],
	['fr_FR', 'En-tête et pied de page PDF', 'En-tête - gauche'],
	['es_ES', 'Encabezado y pie de página PDF', 'Encabezado - izquierda'],
	['it_IT', 'Intestazione e piè di pagina PDF', 'Intestazione - sinistra'],
	['pt_BR', 'Cabeçalho e rodapé do PDF', 'Cabeçalho - esquerda'],
	['pt_PT', 'Cabeçalho e rodapé do PDF', 'Cabeçalho - esquerda'],
	['ru_RU', 'Колонтитулы PDF', 'Верхний колонтитул - слева'],
	['en_GB', 'PDF Header & Footer', 'Header - left'],
	['xx_YY', 'PDF Header & Footer', 'Header - left'],
	['', 'PDF Header & Footer', 'Header - left'],
];

(async () => {
	for (const [locale, section, headerLeft] of cases) {
		const { section: s, settings } = await register(locale);
		assert.strictEqual(s.label, section, `${locale}: section label`);
		assert.strictEqual(settings.headerLeft.label, headerLeft, `${locale}: headerLeft label`);
		// The footer default is printed in the PDF and must stay untranslated.
		assert.strictEqual(settings.footerRight.value, 'Page {page} of {pages}', `${locale}: footer default`);
		for (const [key, item] of Object.entries(settings)) {
			assert.ok(item.label, `${locale}: ${key} has no label`);
		}
		console.log(`ok ${locale || '(empty)'}: ${s.label} / ${settings.headerLeft.label}`);
	}
	const { section } = await register('ja_JP', { failLocale: true });
	assert.strictEqual(section.label, 'PDF Header & Footer', 'locale error falls back to English');
	console.log('ok locale error falls back to English');
	console.log('All i18n tests passed.');
})().catch(error => {
	console.error(error.message);
	process.exit(1);
});
