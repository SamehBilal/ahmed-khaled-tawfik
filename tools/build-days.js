// Writes assets/data/days/<MM>.json for «في مثل هذا اليوم» on the home page (home.js): everything the data dates to a day —
// his birth and death, the legacy timeline, books and first editions of issues on the day they came out, and his articles on
// the day the paper printed them (the blog archive keeps where and when: «الدستور - 28 مايو 2009») — by month and day.
// One small file a month, so the home page loads only the month it needs. Run by tools/build-sw.js.
const fs = require('fs'), path = require('path');
const load = require('./load-data.js'), root = load.root;
const { App, S, d } = load();
delete d.more;

const AR = { 'يناير': 1, 'فبراير': 2, 'مارس': 3, 'أبريل': 4, 'إبريل': 4, 'ابريل': 4, 'مايو': 5, 'يونيو': 6, 'يونيه': 6, 'يوليو': 7, 'يوليه': 7, 'أغسطس': 8, 'اغسطس': 8,
	'سبتمبر': 9, 'أكتوبر': 10, 'اكتوبر': 10, 'نوفمبر': 11, 'ديسمبر': 12 };
const EN = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
const days = {};
/* [kind, year, title {ar,en}, href, note {ar,en} or 0, picture?] */
/* a text the same in both languages is kept once, as a string (App.t reads either) */
const one = (o) => o && typeof o === 'object' && (o.ar === o.en || !o.en) ? o.ar : o;
const add = (m, day, entry, pic) => {
	if (!(m >= 1 && m <= 12 && day >= 1 && day <= 31) || !entry[1]) return;
	entry[2] = one(entry[2]); entry[4] = entry[4] ? one(entry[4]) : 0;
	if (pic) entry[5] = pic; else if (!entry[4]) entry.length = 4;
	const k = String(m).padStart(2, '0') + '-' + String(day).padStart(2, '0');
	(days[k] = days[k] || []).push(entry);
};
/* a picture for the card: the legacy page's codes (portrait, yt:<video>, cover:<book>) or a path; a blog picture at thumbnail size */
const PORTRAIT = 'assets/img/photos/youm7-e94d8bd9a946.jpg';
const pic = (spec) => {
	if (!spec) return '';
	if (spec === 'portrait') return PORTRAIT;
	if (spec.indexOf('yt:') === 0) return 'https://i.ytimg.com/vi/' + spec.slice(3) + '/mqdefault.jpg';
	if (spec.indexOf('cover:') === 0) return S.coverOf((d.bookInfo || {})[spec.slice(6)] || {}) || '';
	return spec;
};
/* (kept as «g:…» after the blog's picture address, which each month's file gives once as «_g») */
const blogPic = (img) => !img ? '' : img.replace(/\/s\d+(-[a-z]+)?\//, '/s240/');
const iso = (s) => { const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(s || ''); return m ? [+m[1], +m[2], +m[3]] : null; };

/* his life */
const b = iso((d.bio.born || {}).date), dd = iso((d.bio.died || {}).date);
if (b) add(b[1], b[2], ['born', b[0], { ar: 'وُلد أحمد خالد توفيق في طنطا', en: 'Ahmed Khaled Tawfik is born in Tanta' }, 'index.html#bio'], PORTRAIT);
if (dd) add(dd[1], dd[2], ['died', dd[0], { ar: 'رحل العرّاب', en: 'The Godfather dies' }, 'legacy.html'], PORTRAIT);

/* the legacy timeline (not the day he died, said above) */
(d.legacy || []).forEach(l => {
	const x = iso(l.date);
	if (x && !(dd && x[0] === dd[0] && x[1] === dd[1] && x[2] === dd[2])) add(x[1], x[2], ['legacy', x[0], l.title, 'legacy.html'], pic(l.image || l.photo));
});

/* books on the day they came out */
(d.works || []).forEach(w => {
	const x = iso(((d.bookInfo || {})[w.id] || {}).firstPublished);
	if (x) add(x[1], x[2], ['book', x[0], w.title, App.workHref(w.id)], S.coverOf((d.bookInfo || {})[w.id]));
});
/* issues of his series, on the day of their first edition («March 3rd 1993») */
S.ownSeries().concat(S.contributedSeries()).forEach(s => {
	S.seriesIssues(s.id).forEach((is, i) => {
		const href = App.issueHref(s.id, Object.assign({ _idx: i }, is)), key = decodeURIComponent(href.replace(/^book\.html\?id=/, ''));
		const ed = (((d.issueInfo || {})[key] || {}).editions || []).filter(e => e.edition === 'الطبعة الأولى')[0];
		const m = ed && /^([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/.exec(ed.date || '');
		if (m && EN[m[1].toLowerCase()]) add(EN[m[1].toLowerCase()], +m[2], ['issue', +m[3], is.title, href,
			{ ar: S.anySeries(s.id).s.title.ar + (is.n != null ? ' #' + is.n : ''), en: (S.anySeries(s.id).s.title.en || '') + (is.n != null ? ' #' + is.n : '') }], S.issueCover(s.id, is));
	});
});

/* his articles, on the day the paper printed them */
((d.blog || {}).posts || []).forEach(p => {
	const m = /(\d{1,2})\s+([ء-ي]+)\s+(\d{4})/.exec(p.src || '');
	if (!m || !AR[m[2]]) return;
	const outlet = (p.src || '').split(' - ')[0].trim();
	add(AR[m[2]], +m[1], ['article', +m[3], { ar: p.t, en: p.t }, 'blog.html?post=' + p.id, outlet ? { ar: outlet, en: outlet } : undefined], blogPic(p.img));
});

const dir = path.join(root, 'assets/data/days');
fs.mkdirSync(dir, { recursive: true });
let total = 0;
for (let m = 1; m <= 12; m++) {
	const mm = String(m).padStart(2, '0'), month = {};
	Object.keys(days).filter(k => k.slice(0, 2) === mm).sort().forEach(k => { month[k.slice(3)] = days[k].sort((a, b) => a[1] - b[1]); total += days[k].length; });
	if (Object.keys(month).length) month._g = (d.blog || {}).img || '';
	const file = path.join(dir, mm + '.json'), body = JSON.stringify(month);
	let old = null; try { old = fs.readFileSync(file, 'utf8'); } catch (e) {}
	if (old !== body) fs.writeFileSync(file, body);
}
console.log('days:', total, 'dated moments on', Object.keys(days).length, 'days of the year');
