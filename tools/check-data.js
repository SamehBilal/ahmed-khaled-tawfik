// Checks the site's data for what breaks quietly: pictures it names that are not in the repo, links to books, series,
// characters, writers or publishers the site does not have, details kept for issues or books that do not exist,
// characters tied to a missing work, duplicate ids, and sources that are not web addresses. Prints a report; exits 1 on errors.
// Run from the repo root:  node tools/check-data.js  [--en]  (--en adds the text that has Arabic but no English)
const fs = require('fs'), path = require('path');
const load = require('./load-data.js'), root = load.root;
const { App, S, P, d } = load();
/* AKT.more is where data-more.js stages its additions before merging them; the pages never read it (build-data.js drops it) */
delete d.more;
const report = {};
const add = (kind, what) => { (report[kind] = report[kind] || []).push(what); };

/* every string in the data, with where it sits */
const seen = new Set();
const walk = (o, at, fn) => {
	if (o == null) return;
	if (typeof o === 'string') return fn(o, at);
	if (typeof o !== 'object' || seen.has(o)) return;
	seen.add(o);
	for (const k in o) walk(o[k], at + (Array.isArray(o) ? '[' + k + ']' : '.' + k), fn);
};

/* pictures and pages of the site's own */
const exists = {};
const has = (rel) => exists[rel] != null ? exists[rel] : (exists[rel] = fs.existsSync(path.join(root, decodeURIComponent(rel.split(/[?#]/)[0]))));
const pageOk = (href) => {
	const m = /^(book|series|character|writer|publisher)\.html\?id=([^&#]+)/.exec(href);
	if (!m) return true;
	const id = decodeURIComponent(m[2]);
	if (m[1] === 'book') return !!S.resolveBook(id);
	if (m[1] === 'series') return !!S.anySeries(id);
	if (m[1] === 'character') return !!App.byId(d.characters, id);
	if (m[1] === 'writer') return !!P.byId(id);
	return S.publishers().some(c => c.p.id === id);
};
walk(d, 'AKT', (s, at) => {
	if (/^assets\/[^\s"']+\.(webp|jpe?g|png|gif|svg|avif|mp3|pdf)$/i.test(s)) { if (!has(s)) add('missing file', at + ' → ' + s); }
	else if (/^(book|series|character|writer|publisher)\.html\?id=/.test(s)) { if (!pageOk(s)) add('broken link', at + ' → ' + s); }
	/* (the blog's addresses are relative to the blog itself, and its «src» names where an article first ran) */
	else if (!/^AKT\.blog\./.test(at) && /(^|\.)(source|sources|url|src)(\[\d+\])?$/.test(at) &&!/^(https?:|assets\/|[a-z-]+\.html)/.test(s) && s) add('odd source', at + ' → ' + s.slice(0, 80));
});

/* details kept for an issue or a book the site does not have */
Object.keys(d.issueInfo || {}).forEach(k => { if (!S.resolveBook(k) && !/^[a-z]+-\d+$/.test(k) && !S.anySeries(k.split('-')[0])) add('orphan issueInfo', k); });
Object.keys(d.issueInfo || {}).forEach(k => { const m = /^([a-z0-9]+)-(\d+)(?:-(\d))?$/.exec(k); if (m && S.anySeries(m[1]) && !S.resolveBook(k) && !(d.issueInfo[k].editions || []).some(e => e.part)) add('orphan issueInfo', k); });
Object.keys(d.bookInfo || {}).forEach(k => { if (!App.byId(d.works, k) && !App.byId(d.aboutBooks, k) && !S.resolveBook(k)) add('orphan bookInfo', k); });

/* blog excerpts where a line break was lost and two lines ran together after a full stop, colon or question mark («مقتضبة.رسوم») */
((d.blog || {}).posts || []).forEach(p => {
	const m = (p.ex || '').match(/[ء-ي][.:؟!،][ء-ي]/g);
	if (m) add('blog excerpt run together', p.id + ' «' + p.t + '»: ' + m.join(' '));
});

/* characters tied to a work the site does not have */
(d.characters || []).forEach(c => { if (c.work && !App.findWork(c.work) && !S.anySeries(c.work)) add('character without work', c.id + ' → ' + c.work); });

/* duplicate ids */
['works', 'series', 'otherSeries', 'characters', 'aboutBooks', 'publishers'].forEach(k => {
	const ids = {};
	(d[k] || []).forEach(x => { if (x && x.id) { if (ids[x.id]) add('duplicate id', k + ': ' + x.id); ids[x.id] = 1; } });
});

/* text with Arabic but no English (with --en) */
if (process.argv.includes('--en')) {
	seen.clear();
	/* the back-cover blurbs, and a series page's «On the back cover» block, are the printed text, shown in Arabic as printed */
	const printed = (at, parent) => /^AKT\.blurbs\.|\.blurb$/.test(at) || /back cover/i.test(String(((parent || {}).title || {}).en || ''));
	const walkObj = (o, at, parent) => {
		if (!o || typeof o !== 'object' || seen.has(o)) return;
		seen.add(o);
		if (typeof o.ar === 'string' && o.ar.trim() && !String(o.en || '').trim() && !printed(at, parent)) add('no English', at);
		/* «English» that is the Arabic again */
		else if (typeof o.en === 'string' && /[ء-ي]/.test(o.en) && !printed(at, parent)) add('Arabic in the English', at + ' → ' + o.en.slice(0, 60));
		for (const k in o) walkObj(o[k], at + (Array.isArray(o) ? '[' + k + ']' : '.' + k), o);
	};
	walkObj(d, 'AKT');
	/* the audiobooks' narrators ([…, minutes, narrator, …] on Storytel and Iqraaly) need their name in Latin letters too */
	const au = d.audio || {}, names = au.narratorsEn || {};
	[au.storytel, au.iqraaly, au.storiapod].forEach(src => Object.values((src || {}).items || {}).forEach(eps => (eps || []).forEach(ep => {
		if (ep && typeof ep[2] === 'string' && /[ء-ي]/.test(ep[2]) && !names[ep[2]]) add('narrator without English', ep[2]);
	})));
}

const kinds = Object.keys(report);
if (!kinds.length) { console.log('All clear.'); process.exit(0); }
kinds.forEach(k => {
	console.log('\n' + k + ' (' + report[k].length + ')');
	report[k].slice(0, process.argv.includes('--all') ? 1e9 : 25).forEach(x => console.log('  ' + x));
	if (report[k].length > 25 && !process.argv.includes('--all')) console.log('  … ' + (report[k].length - 25) + ' more (--all)');
});
process.exit(kinds.some(k => k !== 'no English') ? 1 : 0);
