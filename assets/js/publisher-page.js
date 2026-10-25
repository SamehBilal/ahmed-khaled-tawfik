/* publisher.html?id=<id> — one page per house he published with (AKT.publishers, matched in WorksShared.publishers):
   its logo and what it is, the years and count of his books there, every book and series it put out first,
   the books of his it reissued later, and the other houses. Reuses the writer pages' layout (writer.css). */
window.PAGE = {
	id: 'works',
	title: { ar: 'دار نشر', en: 'Publisher' },

	render: function () {
		var App = window.App, S = window.WorksShared;
		var e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var id = new URLSearchParams(location.search).get('id') || '';
		var all = S.publishers(), c = all.filter(function (x) { return x.p.id === id; })[0];
		var root = document.getElementById('content');
		if (!c) {
			root.innerHTML = '<section class="page-hero"><div class="wrap"><p class="eyebrow">404</p><h1>' + L('لم نجد هذه الدار', 'Publisher not found') + '</h1>' +
				'<p class="lead"><a href="publishers.html">' + L('كل دور النشر', 'All the publishers') + '</a></p></div></section>';
			return;
		}
		var p = c.p;
		this.title = p.name;
		App.applyLang();

		var initial = function (q) { return t(q.name).replace(/^(دار|Dar)\s+/, '').charAt(0); };
		var logo = p.logo
			? '<div class="pb-logo"><img src="' + e(p.logo) + '" alt="' + e(t(p.name)) + '"></div>'
			: '<div class="wp-photo wp-mono pb-mono" aria-hidden="true">' + e(initial(p)) + '</div>';
		var books = c.list.filter(function (it) { return !it.series; }), series = c.list.filter(function (it) { return it.series; });
		/* Arabic: one takes the singular, two the dual on its own, up to ten the plural, then the accusative singular */
		var count = function (n, one, two, few, many, en1, enN) { return n === 2 ? L(two, '2 ' + enN) : n === 1 ? L(one + (/ة$/.test(one) ? ' واحدة' : ' واحد'), '1 ' + en1) : App.num(n) + ' ' + L(n <= 10 ? few : many, enN); };
		var chips = [
			c.from ? '<span class="wp-chip">' + App.num(c.from) + (c.to > c.from ? '–' + App.num(c.to) : '') + '</span>' : '',
			books.length ? '<span class="wp-chip">' + count(books.length, 'كتاب', 'كتابان', 'كتب', 'كتابًا', 'book', 'books') + '</span>' : '',
			series.length ? '<span class="wp-chip">' + count(series.length, 'سلسلة', 'سلسلتان', 'سلاسل', 'سلسلة', 'series', 'series') + '</span>' : '',
			/* and how many issues of his those series hold */
			(function (n) { return n ? '<span class="wp-chip">' + count(n, 'عدد', 'عددان', 'أعداد', 'عددًا', 'issue', 'issues') + L(' في السلاسل', ' in the series') + '</span>' : ''; })(series.reduce(function (m, it) { return m + (it.issues || 0); }, 0)),
			c.later.length ? '<span class="wp-chip">' + L('أعادت نشر ', 'Reissued ') + count(c.later.length, 'كتاب', 'كتابين', 'كتب', 'كتابًا', 'book', 'books') + '</span>' : ''
		].join('');
		/* the house's own website, shop and accounts, as icon buttons */
		var ICON = {
			site: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-3a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8ZM12 4c.8 1.1 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.9 1.9-4ZM4.3 14a8 8 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4H4.3Zm.8 2h3a15.7 15.7 0 0 0 1.4 3.6A8 8 0 0 1 5.1 16Zm3-8h-3a8 8 0 0 1 4.4-3.6C8 5.5 7.6 6.7 8.1 8ZM12 20c-.8-1.1-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.9-1.9 4Zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4Zm.2 5.6c.6-1.1 1.1-2.3 1.4-3.6h3a8 8 0 0 1-4.4 3.6Zm1.8-5.6a16.5 16.5 0 0 0 0-4h3.4a8 8 0 0 1 0 4h-3.4Z"/>',
			shop: '<path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM1 2v2h2l3.6 7.6L5.2 14A2 2 0 0 0 7 17h12v-2H7.4l1.1-2h7.4a2 2 0 0 0 1.8-1l3.6-6.5A1 1 0 0 0 20.4 4H5.2l-.9-2H1Z"/>',
			facebook: '<path d="M14 8V6.5c0-.7.3-1.5 1.5-1.5H17V2h-2.6C11.7 2 11 4 11 5.9V8H9v3h2v11h3V11h2.6L17 8h-3Z"/>',
			instagram: '<path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 2c-2.7 0-3 0-4.1.1-4 .2-5.6 1.8-5.8 5.8C2 9 2 9.3 2 12s0 3 .1 4.1c.2 4 1.8 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c4-.2 5.6-1.8 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.2-4-1.8-5.6-5.8-5.8C15 2 14.7 2 12 2Zm0 1.8c2.7 0 3 0 4 .1 2.8.1 3.9 1.3 4 4 .1 1 .1 1.4.1 4.1s0 3-.1 4c-.1 2.8-1.3 3.9-4 4-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.8-.1-3.9-1.3-4-4-.1-1-.1-1.3-.1-4s0-3 .1-4c.1-2.8 1.3-3.9 4-4 1-.1 1.3-.1 4-.1Z"/>',
			x: '<path d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/>',
			youtube: '<path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-3.2.5-4.8s-.1-3.2-.5-4.8ZM9.7 15V9l5.8 3-5.8 3Z"/>',
			tiktok: '<path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z"/>'
		};
		var LBL = { site: L('الموقع', 'Website'), shop: L('المتجر', 'Shop'), facebook: 'Facebook', instagram: 'Instagram', x: 'X', youtube: 'YouTube', tiktok: 'TikTok' };
		var linksHtml = (p.links || []).length ? '<div class="pb-links">' + p.links.map(function (l) {
			var lbl = l.his ? L('كتبه في المتجر', 'His books in the shop') : LBL[l.kind] || l.kind;
			return '<a class="pb-link pb-' + e(l.kind) + '" href="' + e(l.url) + '" target="_blank" rel="noopener" title="' + e(lbl) + '"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' + (ICON[l.his ? 'shop' : l.kind] || ICON.site) + '</svg><span>' + e(lbl) + '</span></a>';
		}).join('') + '</div>' : '';
		var about = p.about
			/* its source when it has one, named after where it is (Wikipedia, or the house's own site) */
			? '<p class="wp-bio">' + e(L(p.about.ar, p.about.en)) + (p.about.src ? ' <a class="wp-src" href="' + e(p.about.src) + '" target="_blank" rel="noopener">' + (/wikipedia/.test(p.about.src) ? L('عن ويكيبيديا ↗', 'From Wikipedia ↗') : L('المصدر ↗', 'Source ↗')) + '</a>' : '') + '</p>'
			: '';
		/* one sentence on the partnership, from what the site records */
		var first = c.list[0];
		/* the latest is the one that reached the house's last year (a series by its last issue), not just the last listed */
		var last = c.list.filter(function (it) { return (it.yearTo || it.year) === c.to; }).pop() || c.list[c.list.length - 1];
		var q = function (x) { return L('«', '“') + t(x) + L('»', '”'); };
		var link = L('أول ما صدر له عنها ', 'The first of his books from this house was ') + q(first.title) + (first.year ? L(' عام ', ' in ') + App.num(first.year) : '') +
			(c.list.length > 1 && last === first ? (c.to && c.to !== first.year ? L('، واستمر صدوره عنها حتى ', ', and it went on coming out here until ') + App.num(c.to) : '')
				/* a series' last book is one of its issues: «وآخره عدد من سلسلة «سافاري»» */
				: c.list.length > 1 ? (last.series ? L('، وآخره عدد من سلسلة ', ', and the latest an issue of ') + q(last.title) : L('، وآخره ', ', and the latest ') + q(last.title)) + (c.to && c.to !== first.year ? L(' عام ', ' in ') + App.num(c.to) : '') : '') + '.';

		var card = function (it) {
			return '<a class="cover-link" href="' + e(it.href) + '">' + S.miniCover({ img: it.cover, color: it.color, title: t(it.title), sub: it.series ? L('سلسلة', 'Series') : '', by: it.by ? t(it.by) : '' }) +
				'<span class="cl-t">' + tx(it.title) + (it.by ? ' — ' + tx(it.by) : '') + (it.year ? ' · ' + App.num(it.year) + (it.yearTo > it.year ? '–' + App.num(it.yearTo) : '') : '') +
					(it.series && it.issues ? ' · ' + count(it.issues, 'عدد', 'عددان', 'أعداد', 'عددًا', 'issue', 'issues') + (it.inOne ? L(' في مجلد واحد', ' in one volume') : '') : '') + '</span></a>';
		};
		var block = function (title, list) {
			return list.length ? '<section class="section"><div class="wrap"><h2 class="wp-h">' + title + ' <small class="pb-n">(' + App.num(list.length) + ')</small></h2><div class="cover-row">' + list.map(card).join('') + '</div></div></section>' : '';
		};

		var i = all.indexOf(c), prev = all[(i - 1 + all.length) % all.length], next = all[(i + 1) % all.length];
		var house = function (x) {
			return '<a class="wp-person' + (x === c ? ' is-here' : '') + '" href="' + e(S.publisherHref(x.p.id)) + '"><span class="wp-dot pb-dot">' +
				(x.p.logo ? '<img src="' + e(x.p.logo) + '" alt="" loading="lazy">' : e(initial(x.p))) + '</span><span>' + tx(x.p.name) + '</span></a>';
		};

		root.innerHTML =
			'<section class="wp-hero" style="--c:#7a5a1c"><div class="wrap">' +
				'<nav class="crumbs"><a href="works.html">' + L('الأعمال', 'Works') + '</a> / <a href="publishers.html">' + L('دور النشر', 'Publishers') + '</a> / <span>' + e(t(p.name)) + '</span></nav>' +
				'<div class="wp-head">' + logo +
					'<div class="wp-id"><p class="eyebrow">' + L('دار نشر', 'Publisher') + '</p><h1>' + tx(p.name) + '</h1>' +
						'<p class="wp-alt">' + e(App.alt(p.name)) + '</p><div class="wp-chips">' + chips + '</div>' + linksHtml +
						about + (p.note ? '<p class="wp-bio">' + tx(p.note) + '</p>' : '') + '<p class="wp-link">' + e(link) + '</p></div>' +
				'</div></div></section>' +
			block(L('صدر عنها أولًا', 'First published here'), books) +
			block(L('السلاسل', 'Series'), series) +
			block(L('أعادت نشرها', 'Reissued here'), c.later) +
			/* the books others wrote about him that this house published */
			block(L('كتب عنه', 'Books about him'), (App.data().aboutBooks || []).filter(function (b) { return b.publisher && new RegExp(p.match).test(b.publisher.ar || ''); })
				.map(function (b) { return { href: S.bookHref(b.id), cover: b.cover, color: b.color || '#3a2a1f', title: b.title, by: b.by, year: b.year }; })) +
			'<section class="section"><div class="wrap"><h2 class="wp-h">' + L('دور أخرى', 'Other houses') + '</h2><div class="wp-people">' + all.map(house).join('') + '</div>' +
				'<div class="pn wp-pn"><a href="' + e(S.publisherHref(prev.p.id)) + '">' + L('→ ', '← ') + e(t(prev.p.name)) + '</a><a href="' + e(S.publisherHref(next.p.id)) + '">' + e(t(next.p.name)) + L(' ←', ' →') + '</a></div>' +
			'</div></section>';
	}
};
