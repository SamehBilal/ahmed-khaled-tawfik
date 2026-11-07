// Writes assets/data/open/: the archive's facts as plain CSV files anyone can download and use (the contact page's «البيانات
// مفتوحة»): every issue of his series, his books, every edition recorded, the quotes and «قاموس العرّاب»'s phrases, and the
// calendar's dated moments — each row with its page on the site. UTF-8 with a BOM, so Excel reads the Arabic. Not precached
// by the service worker (tools/build-sw.js leaves the folder out). Run from the repo root:  node tools/build-open.js  (build-sw.js runs it)
const fs = require('fs'), path = require('path');
const load = require('./load-data.js'), root = load.root, SITE = load.SITE;
const { App, S, d } = load(['data-built', 'data-detail', 'data-pages', 'books', 'shared', 'app']);
const out = path.join(root, 'assets/data/open');
fs.mkdirSync(out, { recursive: true });
const ar = (o) => o == null ? '' : typeof o === 'object' ? (o.ar || o.en || '') : String(o);
const en = (o) => o == null ? '' : typeof o === 'object' ? (o.en || '') : '';
const q = (v) => { const s = v == null ? '' : String(v); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const csv = (name, head, rows) => {
	fs.writeFileSync(path.join(out, name), '﻿' + [head].concat(rows).map(r => r.map(q).join(',')).join('\r\n') + '\r\n');
	return rows.length;
};
const url = (href) => href ? SITE + href : '';
const counts = {};
/* the issues of his series, and the series they belong to */
const issues = [];
S.ownSeries().concat(S.contributedSeries()).forEach(s => S.seriesIssues(s.id).forEach((is, i) => {
	issues.push([s.id, ar(s.title), en(s.title), is.n == null ? '' : is.n, is.part || '', ar(is.title), en(is.title), is.year || '', url(App.issueHref(s.id, Object.assign({ _idx: i }, is))), S.issueCover(s.id, is) ? url(S.issueCover(s.id, is)) : '']);
}));
counts.issues = csv('issues.csv', ['series', 'series_ar', 'series_en', 'number', 'part', 'title_ar', 'title_en', 'year', 'page', 'cover'], issues);
counts.books = csv('books.csv', ['id', 'title_ar', 'title_en', 'type', 'year', 'publisher', 'page'],
	(d.works || []).map(w => [w.id, ar(w.title), en(w.title), w.type || '', w.year || '', ar(w.publisher), url(S.bookHref(w.id))]));
/* every edition recorded, of an issue or a book */
const eds = [];
[['issue', d.issueInfo], ['book', d.bookInfo]].forEach(([kind, m]) => Object.keys(m || {}).forEach(k => (m[k].editions || []).forEach(ed => {
	eds.push([kind, k, ar(ed.title), ar(ed.publisher), en(ed.publisher), ar(ed.edition), ar(ed.format), ed.year || ed.date || '', ed.lang || '', ed.isbn || '', ed.pages || '', ar(ed.translator), url('book.html?id=' + encodeURIComponent(k))]);
})));
counts.editions = csv('editions.csv', ['of', 'id', 'title', 'publisher_ar', 'publisher_en', 'edition', 'format', 'year', 'language', 'isbn', 'pages', 'translator', 'page'], eds);
counts.quotes = csv('quotes.csv', ['text_ar', 'text_en', 'from', 'work', 'source', 'page'],
	(d.quotes || []).map((x, i) => [ar(x.text), en(x.text), ar(x.from) || ar((App.findWork(x.work) || {}).title), x.work || '', x.source || '', url('quotes.html#q-' + i)]));
counts.phrases = csv('phrases.csv', ['phrase', 'english', 'who', 'meaning_ar', 'meaning_en', 'where', 'source', 'page'],
	(d.glossary || []).map((x, i) => [x.phrase, x.en, x.who, ar(x.meaning), en(x.meaning), x.where || '', x.source || '', url('glossary.html#g-' + i)]));
/* the calendar's moments (assets/data/days/, tools/build-days.js, run before this) */
const days = [];
for (let m = 1; m <= 12; m++) {
	let month = {};
	try { month = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/days', (m < 10 ? '0' : '') + m + '.json'), 'utf8')); } catch (e) {}
	Object.keys(month).filter(k => k !== '_g').sort().forEach(day => month[day].forEach(x => days.push([m, +day, x[1], x[0], ar(x[2]), en(x[2]), ar(x[4] || ''), url(x[3])])));
}
counts.calendar = csv('calendar.csv', ['month', 'day', 'year', 'kind', 'title_ar', 'title_en', 'note', 'page'], days);
/* what is here, for the contact page to list with its counts and sizes */
const files = Object.keys(counts).map(k => { const f = k + '.csv'; return { file: f, rows: counts[k], kb: Math.max(1, Math.round(fs.statSync(path.join(out, f)).size / 1024)) }; });
fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify({ files: files }));
console.log('open data:', files.map(f => f.file + ' ' + f.rows).join(', '));
