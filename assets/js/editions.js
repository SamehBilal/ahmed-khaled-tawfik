/* editions.html — «الطبعات»: his books through the years of publishing, from the editions the site records (Arabic ones; the
   translations are on «حول العالم»). The three series' move from the Modern Arab Association to Selah El-Telmeez; then a
   timeline a book, a dot an edition, coloured by the house that printed it (matched as the book pages match it, S.publisherLink),
   each dot naming its house and year. */
window.PAGE = {
	id: 'editions',
	title: { ar: 'الطبعات', en: 'The editions' },
	strings: {
		eyebrow: { ar: 'رحلة الكتب بين الدور', en: 'The books’ journey between houses' },
		title: { ar: 'الطبعات', en: 'The editions' },
		lead: {
			ar: 'كيف تنقّلت كتبه بين دور النشر عامًا بعد عام: سلاسل الجيب من المؤسسة العربية الحديثة إلى «سلاح التلميذ»، ورواياته ومجموعاته من دار إلى دار.',
			en: 'How his books moved between publishers year by year: the pocket series from the Modern Arab Association to Selah El-Telmeez, his novels and collections from house to house.'
		}
	},
	/* the house an edition's printed publisher names: { id, name } (or its printed name) */
	house: function (pub) {
		var App = window.App, S = window.WorksShared, link = S.publisherLink(pub || ''), m = /publisher\.html\?id=([^"&]+)/.exec(link);
		/* a house with no page here: one name for its spellings («شركة سلاح التلميذ للطباعة والنشر» is «سلاح التلميذ») */
		if (!m) {
			var n = App.t(pub || {}).replace(/\s*[—(].*$/, '').replace(/^(شركة|دار)\s+/, '').replace(/\s+(للطباعة والنشر|للنشر والتوزيع|للنشر)$/, '').trim();
			return { id: 'x:' + n, name: n };
		}
		var p = (App.data().publishers || []).filter(function (x) { return x.id === decodeURIComponent(m[1]); })[0];
		return { id: p.id, name: App.t(p.name), href: S.publisherHref(p.id) };
	},
	editionsOf: function (store, key) {
		return (((window.App.data()[store] || {})[key] || {}).editions || []).filter(function (ed) { return (ed.lang || 'ar') === 'ar' && +ed.year; });
	},

	/* the band: books stamped by one press after another — a colophon stamp moving along a shelf */
	band: function (d, A) {
		var spines = '';
		for (var i = 0; i < 26; i++) spines += '<i style="--h:' + (62 + (i * 37) % 30) + '%;--c:hsl(' + ((i * 47) % 360) + ' 35% ' + (24 + (i * 13) % 18) + '%)"></i>';
		return '<div class="ed-shelf">' + spines + '</div><div class="ed-stamp"><b>' + A.esc(A.L('طبعة', 'Edition')) + '</b><span>1993 · 2023</span></div>';
	},

	render: function () {
		var App = window.App, S = window.WorksShared, d = App.data(), e = App.esc, t = App.t, L = App.L, self = this;
		/* the series: each house's years and editions */
		var series = ['mwt', 'fantasia', 'safari', 'specials'].map(function (sid) {
			var by = {};
			S.seriesIssues(sid).forEach(function (is, i) {
				var key = decodeURIComponent(App.issueHref(sid, Object.assign({ _idx: i }, is)).replace(/^book\.html\?id=/, ''));
				self.editionsOf('issueInfo', key).forEach(function (ed) {
					var h = self.house(ed.publisher), y = +ed.year;
					var b = by[h.id] = by[h.id] || { h: h, from: y, to: y, n: 0 };
					b.from = Math.min(b.from, y); b.to = Math.max(b.to, y); b.n++;
				});
			});
			return { s: S.anySeries(sid).s, houses: Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return a.from - b.from; }) };
		});
		/* the books with at least two dated Arabic editions */
		var books = (d.works || []).map(function (w) { return { w: w, eds: self.editionsOf('bookInfo', w.id).slice().sort(function (a, b) { return a.year - b.year; }) }; })
			.filter(function (b) { return b.eds.length >= 2; }).sort(function (a, b) { return a.eds[0].year - b.eds[0].year; });
		/* the houses' colours: the six that printed the most get the categorical colours in order, the rest are «أخرى» */
		var count = {}, houses = {};
		books.forEach(function (b) { b.eds.forEach(function (ed) { var h = self.house(ed.publisher); houses[h.id] = h; count[h.id] = (count[h.id] || 0) + 1; }); });
		var top = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; }).slice(0, 6);
		var slot = function (id) { var i = top.indexOf(id); return i < 0 ? 0 : i + 1; };
		var years = [].concat.apply([], books.map(function (b) { return b.eds.map(function (ed) { return +ed.year; }); }));
		var y0 = Math.min.apply(null, years), y1 = Math.max.apply(null, years), pct = function (y) { return ((y - y0) / (y1 - y0 || 1) * 100).toFixed(2); };
		var axis = [];
		for (var y = Math.ceil(y0 / 5) * 5; y <= y1; y += 5) axis.push(y);

		document.getElementById('content').innerHTML = '<section class="section ed"><div class="wrap">' +
			'<h2 class="pp-h">' + e(L('سلاسل الجيب', 'The pocket series')) + '</h2>' +
			'<div class="ed-series">' + series.map(function (x) {
				return '<article><h3><a href="' + e(S.seriesHref(x.s.id)) + '">' + e(t(x.s.title)) + '</a></h3><ol>' + x.houses.map(function (b) {
					return '<li><b>' + (b.h.href ? '<a href="' + e(b.h.href) + '">' + e(b.h.name) + '</a>' : e(b.h.name)) + '</b><span>' +
						e(b.from === b.to ? App.num(b.from) : L('من ' + App.num(b.from) + ' إلى ' + App.num(b.to), b.from + '–' + b.to)) + ' · ' + e(b.n === 1 ? L('طبعة واحدة', '1 edition') : b.n === 2 ? L('طبعتان', '2 editions') : App.num(b.n) + ' ' + L(b.n <= 10 ? 'طبعات' : 'طبعة', 'editions')) + '</span></li>';
				}).join('') + '</ol></article>';
			}).join('') + '</div>' +
			'<h2 class="pp-h">' + e(L('رواياته وكتبه', 'His novels and books')) + ' <small>(' + e(App.num(books.length)) + ')</small></h2>' +
			'<div class="ed-legend">' + top.map(function (id) { return '<span><i style="background:var(--pp-' + slot(id) + ')"></i>' + e(houses[id].name) + '</span>'; }).join('') +
				'<span><i style="background:var(--pp-0)"></i>' + e(L('دور أخرى', 'Other houses')) + '</span></div>' +
			'<div class="ed-axis">' + axis.map(function (y) { return '<span style="inset-inline-start:' + pct(y) + '%">' + e(App.num(y)) + '</span>'; }).join('') + '</div>' +
			'<ol class="ed-books">' + books.map(function (b) {
				return '<li><a class="ed-name" href="' + e(S.bookHref(b.w.id)) + '">' + e(t(b.w.title)) + '</a><span class="ed-line">' +
					'<i class="ed-span" style="inset-inline-start:' + pct(b.eds[0].year) + '%;width:' + (pct(b.eds[b.eds.length - 1].year) - pct(b.eds[0].year)).toFixed(2) + '%"></i>' +
					b.eds.map(function (ed) {
						var h = self.house(ed.publisher);
						return '<i class="ed-dot" tabindex="0" style="inset-inline-start:' + pct(+ed.year) + '%;background:var(--pp-' + slot(h.id) + ')" title="' + e(h.name + ' · ' + ed.year) + '"></i>';
					}).join('') + '</span><span class="ed-n">' + e(App.num(b.eds.length)) + '</span></li>';
			}).join('') + '</ol>' +
			'<p class="ed-note">' + e(L('كل نقطة طبعة يعرفها الموقع بسنتها؛ مرّر عليها لترى دارها. طبعات بلا سنة لا تظهر هنا.', 'Each dot is an edition the site knows with its year; hover for its house. Editions without a year are left out.')) + '</p>' +
		'</div></section>';
	}
};
