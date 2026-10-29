// Writes assets/data/places.json for «الخريطة» (map.html): the places the site's own texts name — each issue's and book's
// title, description, back-cover blurb and synopsis — from the list in tools/places.js, each with the books that name it and
// the sentence that does, so every pin can be checked. The data says nothing of where a story is set beyond these words.
// Run by tools/build-sw.js.
const fs = require('fs'), path = require('path');
const load = require('./load-data.js'), root = load.root;
const { App, S, d } = load();
delete d.more;
const PLACES = require('./places.js');
const t = (o) => !o ? '' : typeof o === 'string' ? o : (o.ar || '');

/* every text: [href, title, kind, cover, text, series id] */
const docs = [];
S.ownSeries().concat(S.contributedSeries()).forEach(s => {
	S.seriesIssues(s.id).forEach((is, i) => {
		const href = App.issueHref(s.id, Object.assign({ _idx: i }, is)), key = decodeURIComponent(href.replace(/^book\.html\?id=/, ''));
		const info = (d.issueInfo || {})[key] || {};
		docs.push([href, t(is.title), t(S.anySeries(s.id).s.title) + (is.n != null ? ' #' + is.n : ''), S.issueCover(s.id, is),
			[t(is.title), t(info.description), t((d.blurbs || {})[key]), t(info.blurb), t(is.synopsis)].join('\n'), s.id]);
	});
});
(d.works || []).forEach(w => {
	const info = (d.bookInfo || {})[w.id] || {};
	docs.push([App.workHref(w.id), t(w.title), '', S.coverOf(info), [t(w.title), t(info.description), t(w.synopsis), t((d.blurbs || {})[w.id])].join('\n'), '']);
});

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, (c) => '\\' + c);
/* a name as a whole word, with a joined «و/ف/ب/ل/ك» before it, and «ال» exactly when the name takes it («للهند» too):
   never an adjective's ending — «الإنجليزية» is a language, «الصقلية» a chess opening */
const STOP = '(?=$|[\\s»)،.:؛!؟"\'\\-])';
const nameRe = (p) => {
	const alts = [p[0]].concat(p[5] || []).map(n => {
		const al = p[4] || /^ال/.test(n), core = esc(n.replace(/^ال/, ''));
		return al ? '(?:[وفبك]{0,2}ال|[وف]?لل)' + core : '(?:[وفبلك]{0,2})' + core;
	});
	return new RegExp('(^|[\\s«(،.:"\'\\-])(?:' + alts.join('|') + ')' + STOP);
};
/* a sentence about where the book came out, not where it is set */
const PUBLISHED = /صدر|صدرت|معرض|للنشر|مؤسسة|دار /;
const out = [];
PLACES.forEach(p => {
	const re = nameRe(p), items = [];
	docs.forEach(dc => {
		const m = re.exec(dc[4]);
		if (!m) return;
		/* the sentence around the name */
		const at = m.index, text = dc[4];
		const a = Math.max(text.lastIndexOf('.', at), text.lastIndexOf('\n', at), text.lastIndexOf('؟', at), text.lastIndexOf('!', at)) + 1;
		let b = text.slice(at).search(/[.\n؟!]/); b = b < 0 ? text.length : at + b + 1;
		let snip = text.slice(a, b).trim();
		/* (only the few words just before the name: «صدر عن … في الكويت», «معرض القاهرة») */
		if (PUBLISHED.test(text.slice(Math.max(a, at - 40), at + 1))) return;
		if (snip.length > 220) { const c = Math.max(0, at - a - 90); snip = (c ? '…' : '') + snip.slice(c, c + 200).trim() + '…'; }
		items.push({ h: dc[0], t: dc[1], k: dc[2], c: dc[3] || '', s: snip, sid: dc[5] });
	});
	/* a sentence the issues of one series all share (its description, copied onto each) is the series', once */
	const bySnip = {};
	items.forEach(it => { const k = it.sid + '|' + it.s; (bySnip[k] = bySnip[k] || []).push(it); });
	const kept = [];
	Object.keys(bySnip).forEach(k => {
		const group = bySnip[k], sid = group[0].sid;
		if (sid && group.length >= 3) {
			const ser = S.anySeries(sid);
			if (!kept.some(x => x.h === S.seriesHref(sid))) kept.push({ h: S.seriesHref(sid), t: t(ser.s.title), k: 'سلسلة', c: S.seriesCover(sid) || '', s: group[0].s });
		} else group.forEach(it => kept.push(it));
	});
	kept.forEach(it => { delete it.sid; });
	if (kept.length) out.push({ ar: (p[4] ? 'ال' : '') + p[0], en: p[1], lat: p[2], lon: p[3], items: kept });
});
/* a place counted once even when two spellings name it (Antarctica) */
const merged = [];
out.forEach(p => {
	const same = merged.filter(q => q.en === p.en)[0];
	if (!same) return merged.push(p);
	p.items.forEach(it => { if (!same.items.some(x => x.h === it.h)) same.items.push(it); });
});
merged.sort((a, b) => b.items.length - a.items.length);
const dir = path.join(root, 'assets/data');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, 'places.json'), body = JSON.stringify(merged);
let old = null; try { old = fs.readFileSync(file, 'utf8'); } catch (e) {}
if (old !== body) fs.writeFileSync(file, body);
console.log('places:', merged.length, 'places named in', new Set([].concat(...merged.map(p => p.items.map(i => i.h)))).size, 'books, issues and series');
if (require.main === module) merged.forEach(p => console.log(' ', p.ar, p.en, p.items.length, p.items.slice(0, 3).map(i => i.t + ': ' + i.s.slice(0, 60)).join(' | ')));
