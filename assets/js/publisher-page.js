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
				'<p class="lead"><a href="works.html#publishers-section">' + L('كل دور النشر', 'All the publishers') + '</a></p></div></section>';
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
		var count = function (n, one, two, few, many, en1, enN) { return n === 2 ? L(two, '2 ' + enN) : App.num(n) + ' ' + (n === 1 ? L(one, en1) : L(n <= 10 ? few : many, enN)); };
		var chips = [
			c.from ? '<span class="wp-chip">' + App.num(c.from) + (c.to > c.from ? '–' + App.num(c.to) : '') + '</span>' : '',
			books.length ? '<span class="wp-chip">' + count(books.length, 'كتاب', 'كتابان', 'كتب', 'كتابًا', 'book', 'books') + '</span>' : '',
			series.length ? '<span class="wp-chip">' + count(series.length, 'سلسلة', 'سلسلتان', 'سلاسل', 'سلسلة', 'series', 'series') + '</span>' : '',
			c.later.length ? '<span class="wp-chip">' + L('أعادت نشر ', 'Reissued ') + count(c.later.length, 'كتاب', 'كتابين', 'كتب', 'كتابًا', 'book', 'books') + '</span>' : ''
		].join('');
		var about = p.about
			? '<p class="wp-bio">' + e(L(p.about.ar, p.about.en)) + ' <a class="wp-src" href="' + e(p.about.src) + '" target="_blank" rel="noopener">' + L('عن ويكيبيديا ↗', 'From Wikipedia ↗') + '</a></p>'
			: '';
		/* one sentence on the partnership, from what the site records */
		var first = c.list[0];
		var q = function (x) { return L('«', '“') + t(x) + L('»', '”'); };
		var link = L('أول ما صدر له عنها ', 'The first of his books from this house was ') + q(first.title) + (first.year ? L(' عام ', ' in ') + App.num(first.year) : '') +
			(c.list.length > 1 ? L('، وآخره ', ', and the latest ') + q(c.list[c.list.length - 1].title) + (c.to && c.to !== first.year ? L(' عام ', ' in ') + App.num(c.to) : '') : '') + '.';

		var card = function (it) {
			return '<a class="cover-link" href="' + e(it.href) + '">' + S.miniCover({ img: it.cover, color: it.color, title: t(it.title), sub: it.series ? L('سلسلة', 'Series') : '' }) +
				'<span class="cl-t">' + tx(it.title) + (it.year ? ' · ' + App.num(it.year) : '') + '</span></a>';
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
				'<nav class="crumbs"><a href="works.html">' + L('الأعمال', 'Works') + '</a> / <a href="works.html#publishers-section">' + L('دور النشر', 'Publishers') + '</a> / <span>' + e(t(p.name)) + '</span></nav>' +
				'<div class="wp-head">' + logo +
					'<div class="wp-id"><p class="eyebrow">' + L('دار نشر', 'Publisher') + '</p><h1>' + tx(p.name) + '</h1>' +
						'<p class="wp-alt">' + e(App.alt(p.name)) + '</p><div class="wp-chips">' + chips + '</div>' +
						about + (p.note ? '<p class="wp-bio">' + tx(p.note) + '</p>' : '') + '<p class="wp-link">' + e(link) + '</p></div>' +
				'</div></div></section>' +
			block(L('صدر عنها أولًا', 'First published here'), books) +
			block(L('السلاسل', 'Series'), series) +
			block(L('أعادت نشرها', 'Reissued here'), c.later) +
			'<section class="section"><div class="wrap"><h2 class="wp-h">' + L('دور أخرى', 'Other houses') + '</h2><div class="wp-people">' + all.map(house).join('') + '</div>' +
				'<div class="pn wp-pn"><a href="' + e(S.publisherHref(prev.p.id)) + '">' + L('→ ', '← ') + e(t(prev.p.name)) + '</a><a href="' + e(S.publisherHref(next.p.id)) + '">' + e(t(next.p.name)) + L(' ←', ' →') + '</a></div>' +
			'</div></section>';
	}
};
