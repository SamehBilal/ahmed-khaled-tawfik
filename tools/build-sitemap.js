// Writes sitemap.xml: every page the site has, the section pages and one address per book, issue, series,
// character, writer, publisher and blog article, read from the same data and link helpers the pages use,
// with each book's and series' cover for image search. robots.txt points to it.
// Run from the repo root after changing the data:  node tools/build-sitemap.js
const fs = require('fs'), path = require('path'), cp = require('child_process');
const root = path.resolve(__dirname, '..');
const SITE = 'https://samehbilal.github.io/ahmed-khaled-tawfik/';

/* the data and helpers, loaded as the pages load them (tools/load-data.js) */
const { App, S, P, d } = require('./load-data.js')();

/* the last time a file changed, by git, for the section pages */
const lastmod = (f) => { try { return cp.execSync('git log -1 --format=%cs -- "' + f + '"', { cwd: root }).toString().trim(); } catch (e) { return ''; } };

const urls = new Map();
const add = (href, o) => {
	if (href == null || /#/.test(href) || urls.has(href)) return;
	urls.set(href, o || {});
};
const img = (src) => src && !/^https?:/.test(src) ? SITE + src : src || '';

/* the section pages (not 404, offline, the redirect authors.html, or lists.html, which holds only the reader's own lists) */
const PAGES = { 'index.html': 1, 'works.html': 0.9, 'characters.html': 0.8, 'writers.html': 0.8, 'legacy.html': 0.8, 'audio.html': 0.8, 'blog.html': 0.8,
	'quotes.html': 0.7, 'guide.html': 0.7, 'tributes.html': 0.7, 'publishers.html': 0.7, 'papers.html': 0.7, 'numbers.html': 0.6, 'quiz.html': 0.6, 'map.html': 0.6, 'world.html': 0.6, 'screen.html': 0.6, 'covers.html': 0.6, 'editions.html': 0.5, 'talks.html': 0.6, 'awards.html': 0.5, 'journey.html': 0.4, 'about.html': 0.5, 'sources.html': 0.5, 'contact.html': 0.3,
	'privacy.html': 0.2, 'terms.html': 0.2 };
Object.keys(PAGES).forEach(f => add(f === 'index.html' ? '' : f, { priority: PAGES[f], lastmod: lastmod(f) }));

/* series, his and those he wrote for, and each of their issues */
S.ownSeries().concat(S.contributedSeries()).forEach(s => {
	add(S.seriesHref(s.id), { priority: 0.8, image: img(S.seriesCover(s.id)), title: App.t(s.title) });
	S.seriesIssues(s.id).forEach((is, i) => add(App.issueHref(s.id, Object.assign({ _idx: i }, is)), { priority: 0.6, image: img(S.issueCover(s.id, is)), title: App.t(is.title) }));
});
/* his books outside the series, and the books about him or with his forewords */
(d.works || []).forEach(w => add(App.workHref(w.id), { priority: 0.7, image: img(S.coverOf((d.bookInfo || {})[w.id])), title: App.t(w.title) }));
S.entryBooks().forEach(x => add(S.entryBookHref(x.w), { priority: 0.5, image: img(x.w.cover), title: App.t(x.w.book) }));
/* the leads' pages, the writers, the publishers, the blog's articles */
(d.characters || []).filter(c => App.charHasPage(c.id)).forEach(c => add(App.charHref(c.id), { priority: 0.6 }));
P.all().forEach(p => add('writer.html?id=' + encodeURIComponent(p.id), { priority: 0.5 }));
S.publishers().forEach(c => add(S.publisherHref(c.p.id), { priority: 0.4 }));
((d.blog || {}).posts || []).forEach(p => add('blog.html?post=' + encodeURIComponent(p.id), { priority: 0.5, lastmod: /^\d{4}-\d\d-\d\d$/.test(p.d || '') ? p.d : '' }));

const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const out = ['<?xml version="1.0" encoding="UTF-8"?>',
	'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'];
urls.forEach((o, href) => {
	out.push('\t<url><loc>' + x(SITE + href) + '</loc>' + (o.lastmod ? '<lastmod>' + o.lastmod + '</lastmod>' : '') +
		'<priority>' + o.priority.toFixed(1) + '</priority>' +
		(o.image ? '<image:image><image:loc>' + x(encodeURI(o.image)) + '</image:loc></image:image>' : '') + '</url>');
});
out.push('</urlset>', '');
fs.writeFileSync(path.join(root, 'sitemap.xml'), out.join('\n'));
console.log('sitemap.xml', urls.size, 'addresses');
