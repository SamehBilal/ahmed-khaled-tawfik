// Writes share/<kind>/<id>.html: one small page per book, issue, series, character, writer, publisher and blog article,
// carrying its own title, description and picture in the tags that WhatsApp, Facebook, X and Telegram read (they run no
// scripts, so the real pages, drawn from the data, all look alike to them), then opening the real page at once.
// The «شارك» buttons hand out these addresses (App.shareUrl). Not for search engines: noindex, and canonical to the real page.
// Run from the repo root after changing the data:  node tools/build-share.js  (tools/build-sw.js runs it too)
const fs = require('fs'), path = require('path');
const load = require('./load-data.js'), SITE = load.SITE, root = load.root;
const { App, S, P, d } = load();
const t = (o) => !o ? '' : typeof o === 'string' ? o : (o.ar || o.en || '');
const clean = (v) => t(v).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const cut = (s, n) => s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s;
const abs = (u) => !u ? '' : /^https?:/.test(u) ? u : SITE + u.replace(/^\.?\//, '');
const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const NAME = 'أحمد خالد توفيق';

const out = path.join(root, 'share');
/* a page is rewritten only when it changed, and one whose item is gone is removed (the folder syncs with OneDrive, which locks files) */
const made = new Set();
let count = 0, written = 0;
function page(kind, id, real, o) {
	const title = cut(clean(o.title), 90) + ' — ' + (o.suffix || NAME);
	const desc = cut(clean(o.desc) || o.fallback, 200);
	const img = abs(o.image) || SITE + 'assets/img/og/' + (o.og || 'index') + '.jpg';
	const own = SITE + 'share/' + kind + '/' + id + '.html', to = SITE + real;
	const html = '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
		'<title>' + x(title) + '</title>\n<meta name="description" content="' + x(desc) + '">\n<meta name="robots" content="noindex, follow">\n' +
		'<link rel="canonical" href="' + x(to) + '">\n<link rel="icon" href="../../assets/img/favicon.svg" type="image/svg+xml">\n' +
		'<meta property="og:type" content="' + (o.type || 'article') + '">\n<meta property="og:site_name" content="العرّاب — The Godfather">\n' +
		'<meta property="og:locale" content="ar_EG">\n<meta property="og:title" content="' + x(title) + '">\n<meta property="og:description" content="' + x(desc) + '">\n' +
		'<meta property="og:url" content="' + x(own) + '">\n<meta property="og:image" content="' + x(img) + '">\n<meta property="og:image:alt" content="' + x(clean(o.title)) + '">\n' +
		/* a cover or a portrait reads better as the small card than cropped wide */
		'<meta name="twitter:card" content="' + (o.image && !o.wide ? 'summary' : 'summary_large_image') + '">\n<meta name="twitter:title" content="' + x(title) + '">\n' +
		'<meta name="twitter:description" content="' + x(desc) + '">\n<meta name="twitter:image" content="' + x(img) + '">\n' +
		'<meta http-equiv="refresh" content="0; url=../../' + x(real) + '">\n<script>location.replace(\'../../' + real.replace(/'/g, '%27') + '\' + location.hash);</script>\n' +
		'</head>\n<body style="background:#0e0f13;color:#efe6d2;font-family:sans-serif;text-align:center;padding:40px 16px">\n' +
		'<p><a style="color:#e0633a" href="../../' + x(real) + '">' + x(clean(o.title)) + '</a></p>\n</body>\n</html>\n';
	const file = path.join(out, kind, id + '.html');
	made.add(file);
	count++;
	let old = null; try { old = fs.readFileSync(file, 'utf8'); } catch (e) {}
	if (old === html) return;
	fs.mkdirSync(path.join(out, kind), { recursive: true });
	fs.writeFileSync(file, html);
	written++;
}

/* books and issues: the blurb on the back, else its description; its cover */
const books = new Set();
const book = (id) => {
	if (books.has(id)) return; books.add(id);
	const r = S.resolveBook(id); if (!r) return;
	const it = r.item, info = r.info || {}, blurb = (d.blurbs || {})[id] || info.blurb;
	const by = r.about ? t(it.by) : NAME;
	page('book', id, 'book.html?id=' + id, {
		title: it.title, og: 'book', type: 'book',
		/* an issue says which series and number first: «روايات عالمية للجيب #70 · «ماتيلدا» — رولد دال» */
		desc: [r.kind === 'issue' ? clean(r.series.s.title) + (it.n != null ? ' #' + it.n : '') : '', clean((blurb && blurb.ar) || info.description || it.synopsis || it.original)].filter(Boolean).join(' · '),
		fallback: (r.kind === 'issue' ? t(r.series.s.title) + (it.n != null ? ' #' + it.n : '') + ' — ' : '') + 'كتاب ' + (r.about ? 'عن ' + NAME : 'لـ' + by) + '.',
		image: S.coverOf(info) || (r.kind === 'issue' ? S.issueCover(r.series.s.id, it) : '')
	});
};
S.ownSeries().concat(S.contributedSeries()).forEach(s => {
	const ser = S.anySeries(s.id), info = (ser && ser.info) || {};
	page('series', s.id, 'series.html?id=' + s.id, { title: s.title, desc: info.description || s.description || s.synopsis, og: 'series',
		fallback: 'سلسلة ' + clean(s.title) + ': كل أعدادها وأغلفتها.', image: S.seriesCover(s.id), type: 'website' });
	S.seriesIssues(s.id).forEach((is, i) => { const m = /id=([^&#]+)/.exec(App.issueHref(s.id, Object.assign({ _idx: i }, is))); if (m) book(decodeURIComponent(m[1])); });
});
(d.works || []).forEach(w => { const m = /^book\.html\?id=(.+)$/.exec(App.workHref(w.id)); if (m) book(decodeURIComponent(m[1])); });
S.entryBooks().forEach(eb => book(eb.id));

(d.characters || []).filter(c => App.charHasPage(c.id)).forEach(c => page('character', c.id, 'character.html?id=' + c.id, {
	title: c.name, desc: ((d.heroes || {})[c.id] || {}).intro || c.desc, og: 'character', type: 'profile',
	fallback: 'شخصية من عالم ' + NAME + '.', image: (d.charFigures || {})[c.id] || c.image }));
P.all().forEach(p => page('writer', p.id, 'writer.html?id=' + p.id, {
	title: p.name, desc: p.bio && p.bio.ar, og: 'writers', type: 'profile',
	fallback: 'من الكتّاب حول ' + NAME + '، وما الذي جمعه بالعرّاب.', image: p.photo && p.photo.url }));
S.publishers().forEach(c => page('publisher', c.p.id, 'publisher.html?id=' + c.p.id, {
	title: c.p.name, desc: c.p.about || c.p.note, og: 'works', type: 'website',
	fallback: 'دار نشر من دور ' + NAME + '، وما الذي صدر له عنها.', image: c.p.logo }));
const blog = d.blog || {};
(blog.posts || []).forEach(p => page('post', p.id, 'blog.html?post=' + p.id, {
	title: p.t, desc: p.ex, og: 'blog', wide: true, fallback: 'من مدونة ' + NAME + '.',
	image: !p.img ? '' : p.img.indexOf('g:') === 0 ? blog.img + p.img.slice(2) : p.img }));

let gone = 0;
if (fs.existsSync(out)) fs.readdirSync(out).forEach(k => fs.readdirSync(path.join(out, k)).forEach(f => {
	const file = path.join(out, k, f);
	if (!made.has(file)) { try { fs.unlinkSync(file); gone++; } catch (e) { console.warn('could not remove', file); } }
}));
console.log('share/', count, 'pages,', written, 'written,', gone, 'removed');
