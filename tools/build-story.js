// «قصة الموقع» (story.html): the site's own history from git, told as a story rather than a log — the day it began, each page on
// the day it was born (its name from its own <title> and JSON-LD), the covers added day by day, and how many changes each day
// saw and of what kind (from assets/data/changelog.json, built just before). Written to assets/data/story.json.
// Run by tools/build-sw.js; on its own:  node tools/build-story.js
const fs = require('fs'), path = require('path'), cp = require('child_process');
const root = path.resolve(__dirname, '..');
const git = (args) => cp.execSync('git ' + args, { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20 });
let ok = true;
try { git('rev-parse HEAD'); } catch (e) { ok = false; console.log('story: no git history here, kept as it was'); }
if (ok) {
	let log = [];
	try { log = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/changelog.json'), 'utf8')); } catch (e) {}
	const days = {};
	const day = (d) => (days[d] = days[d] || { d: d, n: 0, k: {}, pages: [], covers: 0 });
	log.forEach(x => { const o = day(x.d); o.n++; x.k.forEach(k => { o.k[k] = (o.k[k] || 0) + 1; }); });
	/* and each day's headline changes: the two that did the most (a new page first, then data and pictures, then the longest), in both words */
	const cut = (t) => t.length > 230 ? t.slice(0, 228).replace(/\s+\S*$/, '') + '…' : t;
	const score = (x) => (x.k.indexOf('page') >= 0 ? 3 : 0) + (x.k.indexOf('data') >= 0 ? 1 : 0) + (x.k.indexOf('pics') >= 0 ? 1 : 0) + Math.min((x.a || x.s).length, 400) / 400;
	Object.keys(days).forEach(d => {
		days[d].top = log.filter(x => x.d === d && !/^Rebuild /.test(x.s)).sort((a, b) => score(b) - score(a)).slice(0, 2)
			.map(x => ({ h: x.h, ar: cut(x.a || x.s), en: cut(x.s) }));
	});
	/* the pages drawn from the data, one for each of its kind, by what they hold */
	const KIND = { 'book.html': ['صفحة لكل كتاب وعدد', 'A page for every book and issue'], 'series.html': ['صفحة لكل سلسلة', 'A page for every series'],
		'character.html': ['صفحة لكل شخصية', 'A page for every character'], 'writer.html': ['صفحة لكل كاتب', 'A page for every writer'],
		'publisher.html': ['صفحة لكل دار نشر', 'A page for every publisher'], 'index.html': ['الصفحة الرئيسية', 'The home page'] };
	/* each page the site still has (not the redirects left where a page became a part of another), on the day it was first added */
	fs.readdirSync(root).filter(f => /\.html$/.test(f) && !/^(404|offline)\.html$/.test(f)).forEach(f => {
		const html = fs.readFileSync(path.join(root, f), 'utf8');
		if (/http-equiv="refresh"|location\.replace/.test(html)) return;
		const first = git('log --diff-filter=A --no-renames --format=%ad --date=short -- ' + f).trim().split('\n').pop();
		if (!first) return;
		const ar = ((/<title>([^<]*)<\/title>/.exec(html) || [])[1] || f).split(' — ')[0].trim();
		const en = ((/"alternateName":"([^"]*) — Ahmed Khaled Tawfik"/.exec(html) || [])[1] || '').trim();
		day(first).pages.push({ f: f, ar: KIND[f] ? KIND[f][0] : ar, en: KIND[f] ? KIND[f][1] : en || ar });
	});
	/* the covers, on the day each was added */
	let at = '';
	git('log --diff-filter=A --name-only --format=@%ad --date=short -- assets/img/covers').split('\n').forEach(l => {
		if (l[0] === '@') at = l.slice(1); else if (l.trim() && at) day(at).covers++;
	});
	const list = Object.keys(days).sort().map(k => days[k]);
	let pages = 0, covers = 0, changes = 0;
	list.forEach(o => { pages += o.pages.length; covers += o.covers; changes += o.n; o.total = { pages: pages, covers: covers, changes: changes }; });
	const out = { start: list.length ? list[0].d : '', end: list.length ? list[list.length - 1].d : '', changes: changes, pages: pages, covers: covers, days: list };
	fs.writeFileSync(path.join(root, 'assets/data/story.json'), JSON.stringify(out));
	console.log('story.json', list.length, 'days,', pages, 'pages,', covers, 'covers,', changes, 'changes');
}
