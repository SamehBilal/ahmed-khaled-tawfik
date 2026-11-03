// The site's news as Atom feeds, for readers who follow it in a feed reader: feed.xml in Arabic and feed-en.xml in English, the
// newest 60 changes of «سجل التحديثات» (assets/data/changelog.json, so run after build-changelog.js), each with its kinds and,
// for a fact put right, «تصحيح» first. Every page's <head> is given the feeds' links, so a reader finds them from any page.
// Run by tools/build-sw.js; on its own:  node tools/build-feed.js
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const SITE = 'https://samehbilal.github.io/ahmed-khaled-tawfik/';
const log = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/changelog.json'), 'utf8')).filter(x => !/^Rebuild /.test(x.s)).slice(0, 60);
const KIND = { page: ['صفحة جديدة', 'New page'], pics: ['صور', 'Pictures'], audio: ['مسموع', 'Audio'], data: ['بيانات', 'Data'], design: ['تصميم', 'Design'], fix: ['تصحيح', 'Fix'] };
const xml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* a title: the change's first clause, cut at a word near 110 letters */
const title = s => {
	const first = s.split(/(?<=[.:;؛])\s|\s—\s/)[0];
	if (first.length <= 110) return first.replace(/[.:;؛]$/, '');
	const cut = first.slice(0, 110), sp = cut.lastIndexOf(' ');
	return (sp > 60 ? cut.slice(0, sp) : cut).replace(/[،,;:]$/, '') + '…';
};
/* only a day is known for each change: the day's changes are spaced a minute apart, newest last, so a reader keeps their order */
const stamp = (() => {
	const seen = {};
	return d => { seen[d] = (seen[d] || 0) + 1; return new Date(Date.parse(d + 'T21:00:00Z') - seen[d] * 60000).toISOString().replace(/\.000Z$/, 'Z'); };
})();
const times = log.map(x => stamp(x.d));

const feed = (lang) => {
	const ar = lang === 'ar', file = ar ? 'feed.xml' : 'feed-en.xml';
	const entries = log.map((x, i) => {
		const text = ar ? (x.a || x.s) : (x.c && x.c.en && x.c.en !== x.s ? x.c.en + ' — ' + x.s : x.s);
		const fix = x.c && !/^تصحيح/.test(text) ? (ar ? 'تصحيح: ' : 'Correction: ') : '';
		return '\t<entry>\n' +
			'\t\t<id>tag:samehbilal.github.io,2026:ahmed-khaled-tawfik/' + x.h + '</id>\n' +
			'\t\t<title>' + xml(fix + title(text)) + '</title>\n' +
			'\t\t<updated>' + times[i] + '</updated>\n' +
			'\t\t<link rel="alternate" type="text/html" href="' + SITE + 'changelog.html"/>\n' +
			x.k.map(k => '\t\t<category term="' + k + '" label="' + xml(KIND[k][ar ? 0 : 1]) + '"/>\n').join('') +
			'\t\t<content type="text">' + xml(fix + text) + '</content>\n' +
			'\t</entry>\n';
	}).join('');
	const out = '<?xml version="1.0" encoding="utf-8"?>\n' +
		'<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="' + lang + '">\n' +
		'\t<id>' + SITE + file + '</id>\n' +
		'\t<title>' + xml(ar ? 'العرّاب: ما الجديد في أرشيف أحمد خالد توفيق' : 'The Godfather: what’s new in the Ahmed Khaled Tawfik archive') + '</title>\n' +
		'\t<subtitle>' + xml(ar ? 'كل ما أُضيف إلى الموقع أو تغيّر فيه: صفحات جديدة وأغلفة وتسجيلات وتصحيحات.' : 'Everything added to the site or changed in it: new pages, covers, recordings and corrections.') + '</subtitle>\n' +
		'\t<link rel="self" type="application/atom+xml" href="' + SITE + file + '"/>\n' +
		'\t<link rel="alternate" type="text/html" href="' + SITE + 'changelog.html"/>\n' +
		'\t<icon>' + SITE + 'favicon.ico</icon>\n' +
		'\t<author><name>' + xml(ar ? 'العرّاب' : 'The Godfather') + '</name><uri>' + SITE + '</uri></author>\n' +
		'\t<updated>' + (times[0] || new Date().toISOString()) + '</updated>\n' + entries + '</feed>\n';
	const p = path.join(root, file);
	if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== out) fs.writeFileSync(p, out);
};
feed('ar');
feed('en');

/* every page's head names the feeds, after its manifest */
const LINKS = '\t<link rel="alternate" type="application/atom+xml" href="feed.xml" title="ما الجديد في الموقع">\n' +
	'\t<link rel="alternate" type="application/atom+xml" href="feed-en.xml" title="What’s new on the site" hreflang="en">\n';
let pages = 0;
fs.readdirSync(root).filter(f => /\.html$/.test(f)).forEach(f => {
	const p = path.join(root, f), s = fs.readFileSync(p, 'utf8');
	if (s.indexOf('href="feed.xml"') >= 0) return;
	const t = s.replace(/(\t<link rel="manifest"[^>]*>\n)/, '$1' + LINKS);
	if (t !== s) { fs.writeFileSync(p, t); pages++; }
});
console.log('feed.xml, feed-en.xml', log.length, 'changes' + (pages ? ', linked from ' + pages + ' more pages' : ''));
