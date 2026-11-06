// Writes assets/js/data-built.js: the eleven data files every page loads (data.js … data-more.js), run once here, their
// corrections applied, as one file — one download instead of eleven, and without AKT.more, the copy data-more.js stages
// its additions in before merging them, which no page reads (about 400 KB).
// What only the book, series and «حول العالم» pages read goes to assets/js/data-detail.js, which only they load (about 190 KB).
// The data is still edited in those files; this is run after every change (tools/build-sw.js runs it first).
// Run from the repo root:  node tools/build-data.js
const fs = require('fs'), path = require('path');
const load = require('./load-data.js'), root = load.root;
const FILES = ['data', 'data-issues', 'data-quotes', 'data-legacy', 'data-books-a', 'data-books-b', 'data-series-more', 'data-audio',
	'data-storytel', 'data-tributes', 'data-more'];
const A = JSON.parse(JSON.stringify(load(FILES).win.AKT));
delete A.more;
/* a few totals for pages that do not load the blog or the map (the home page's cards, the site map): his pieces in the papers and
   their outlets and the archive's articles, from the blog archive, and the places the map shows (assets/data/places.json, from the last build) */
const blog = load(['data-blog']).win.AKT.blog || {}, outlets = {};
let papers = 0;
(blog.posts || []).forEach(p => {
	if (!p.src || /^من كتاب/.test(p.src) || !/(19|20)\d\d/.test(p.src)) return;
	papers++; outlets[p.src.split(' - ')[0].trim().replace('اﻻتحاد', 'الاتحاد').replace(/^بص وطل$/, 'بص و طل').replace(/^مؤسسة هنداوي$/, 'مؤسسة هنداوي للتعليم والثقافة').replace(/^الشباب$/, 'مجلة الشباب')] = 1;
});
let places = 0;
try { places = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/places.json'), 'utf8')).length; } catch (e) {}
/* and «قاموس العرّاب»'s phrases (data-pages.js), small, for the home page's line of the day and the search on every page */
A.glossary = load(['data-pages']).win.AKT.glossary || [];
A.stats = { papers: papers, outlets: Object.keys(outlets).length, places: places, posts: (blog.posts || []).length };
/* and what only a book's, a series' and «حول العالم»'s pages read, set apart in data-detail.js, which only those pages load
   (right after this file, before shared.js reorders the editions): each edition's links and credits, and the Abjjad shop links */
const PART = ['source', 'translator', 'credit', 'isbn10', 'coverSource'], detail = { eds: {}, abjjad: A.abjjad || {} };
delete A.abjjad;
['issueInfo', 'bookInfo'].forEach(store => Object.keys(A[store] || {}).forEach(k => {
	const eds = (A[store][k] || {}).editions || [];
	const cut = eds.map(ed => {
		const o = {};
		PART.forEach(f => { if (ed[f] != null) { o[f] = ed[f]; delete ed[f]; } });
		return Object.keys(o).length ? o : 0;
	});
	if (cut.some(Boolean)) detail.eds[store[0] + ':' + k] = cut;
}));
const more = '/* Built by tools/build-data.js — do not edit here. The editions\' links and credits and the Abjjad links, put back into AKT. */\n' +
	'(function (A, D) {\n\tA.abjjad = D.abjjad;\n\tObject.keys(D.eds).forEach(function (key) {\n' +
	'\t\tvar info = (A[key[0] === \'i\' ? \'issueInfo\' : \'bookInfo\'] || {})[key.slice(2)], eds = (info && info.editions) || [];\n' +
	'\t\tD.eds[key].forEach(function (o, i) { if (o && eds[i]) for (var f in o) eds[i][f] = o[f]; });\n\t});\n' +
	'})(window.AKT, ' + JSON.stringify(detail) + ');\n';
fs.writeFileSync(path.join(root, 'assets/js/data-detail.js'), more);
/* how much «حفظ للقراءة دون اتصال» downloads (pwa.js): every local picture the data names and its small copy, as on the page */
{
	const set = {}, thumb = s => { const m = /^assets\/img\/covers\/(.+)\.(webp|jpe?g|png)$/i.exec(s); return m ? 'assets/img/covers-s/' + m[1] + '.webp' : s; };
	(function walk(o) {
		if (!o) return;
		if (typeof o === 'string') { if (/^assets\/img\/.+\.(png|jpe?g|webp|gif|svg)$/i.test(o)) { set[o] = 1; set[thumb(o)] = 1; } return; }
		if (typeof o === 'object') for (const k in o) walk(o[k]);
	})(A);
	let bytes = 0;
	Object.keys(set).forEach(f => { try { bytes += fs.statSync(path.join(root, f)).size; } catch (e) {} });
	A.stats.offlineMB = Math.max(1, Math.round(bytes / 1048576 / 5) * 5);
}
const body = '/* Built by tools/build-data.js from ' + FILES.map(f => f + '.js').join(', ') + ' — do not edit here; edit those and rebuild. */\n' +
	'window.AKT = ' + JSON.stringify(A) + ';\n';
fs.writeFileSync(path.join(root, 'assets/js/data-built.js'), body);
console.log('data-built.js', Math.round(body.length / 1024) + ' KB');
/* and data-pages.js, the pages about his world and his reading, a file a part (assets/js/pages/<part>.js): each of those pages
   loads only the parts it reads — «وحوش وأساطير» its monsters, «يوميات رفعت إسماعيل» its days — not all twelve (about 80 KB compressed) */
const parts = load(['data-pages']).win.AKT, partsDir = path.join(root, 'assets/js/pages');
fs.mkdirSync(partsDir, { recursive: true });
fs.readdirSync(partsDir).filter(f => f.endsWith('.js') && !(f.slice(0, -3) in parts)).forEach(f => fs.unlinkSync(path.join(partsDir, f)));
Object.keys(parts).forEach(k => fs.writeFileSync(path.join(partsDir, k + '.js'),
	'/* Built by tools/build-data.js from data-pages.js — do not edit here; edit that and rebuild. */\n' +
	'window.AKT = window.AKT || {};\nwindow.AKT.' + k + ' = ' + JSON.stringify(parts[k]) + ';\n'));
console.log('pages/', Object.keys(parts).length + ' parts');
module.exports = FILES;
