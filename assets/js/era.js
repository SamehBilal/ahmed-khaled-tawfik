/* era.html — «زمن العرّاب»: his life and work year by year beside the world they came out in. His side is the site's own data —
   his life (AKT.timeline), the books in the year they came out (AKT.works), the series as they began and ended, his awards and
   the screen; the world's side is AKT.era (data-pages.js): what happened in Egypt, the Arab world and the world, in culture and
   in science, each with its source, and where a source ties it to his writing, the issue or book it is in. Each year at #y-<year>.
   The band is the years as two tracks, his above and the world's below, a mark for each thing. */
window.PAGE = {
	id: 'era',
	title: { ar: 'زمن العرّاب', en: 'The Godfather’s times' },
	strings: {
		eyebrow: { ar: 'عامًا بعام', en: 'Year by year' },
		title: { ar: 'زمن العرّاب', en: 'The Godfather’s times' },
		lead: {
			ar: 'كتبه وسلاسله وحياته في زمنها: ما كان يحدث في مصر والعالم عامًا بعام، من مولده في طنطا 1962 إلى رحيله، وما كتبه عن بعضه.',
			en: 'His books, series and life in their time: what was happening in Egypt and the world year by year, from his birth in Tanta in 1962 to his death, and what he wrote about some of it.'
		}
	},
	SCOPES: [['egypt', { ar: 'مصر', en: 'Egypt' }], ['arab', { ar: 'العالم العربي', en: 'The Arab world' }], ['world', { ar: 'العالم', en: 'The world' }],
		['culture', { ar: 'ثقافة وفن', en: 'Culture' }], ['science', { ar: 'علم وتقنية', en: 'Science & tech' }]],
	FROM: 1962, TO: 2020,
	scope: 'all',

	/* everything of his, by year */
	his: function (d) {
		var S = window.WorksShared, by = {}, add = function (y, x) { y = +y; if (!y) return; (by[y] = by[y] || []).push(x); };
		(d.timeline || []).forEach(function (t) { add(t.year, { k: 'life', title: t.title, text: t.text }); });
		(d.works || []).forEach(function (w) { add(w.year, { k: 'book', id: w.id, title: w.title, type: w.type }); });
		(d.series || []).forEach(function (s) {
			var m = String(s.years || '').match(/(\d{4})(?:\D+(\d{4}))?/);
			if (!m || !S.anySeries(s.id)) return;
			add(m[1], { k: 'start', id: s.id, title: s.title });
			if (m[2] && m[2] !== m[1]) add(m[2], { k: 'end', id: s.id, title: s.title });
		});
		(d.awards || []).forEach(function (a) { add(a.year, { k: 'award', title: a.title, work: a.work }); });
		(d.adaptations || []).forEach(function (a) { add(a.year, { k: 'screen', title: a.title, kind: a.kind }); });
		return by;
	},
	world: function (d) {
		var by = {};
		(d.era || []).forEach(function (x) { (by[x.year] = by[x.year] || []).push(x); });
		return by;
	},

	band: function (d, A) {
		var self = window.PAGE, e = A.esc, his = self.his(d), world = self.world(d), span = self.TO - self.FROM;
		var marks = '';
		for (var y = self.FROM; y <= self.TO; y++) {
			var x = ((y - self.FROM + 0.5) / (span + 1) * 100).toFixed(2), h = (his[y] || []).length, w = (world[y] || []).length;
			if (h || w) marks += '<a class="er-yr" href="#y-' + y + '" style="--x:' + x + '%;--h:' + Math.min(h, 8) + ';--w:' + Math.min(w, 8) + ';--i:' + (y - self.FROM) + '" title="' + e(A.num(y)) + '" tabindex="-1">' +
				(h ? '<i class="er-h"></i>' : '') + (w ? '<i class="er-w"></i>' : '') + '</a>';
			if (y % 10 === 0 || y === self.FROM) marks += '<span class="er-dec" style="--x:' + x + '%">' + e(A.num(y)) + '</span>';
		}
		return '<div class="er-band"><span class="er-lab er-lab-h">' + e(A.L('هو', 'Him')) + '</span><span class="er-lab er-lab-w">' + e(A.L('العالم', 'The world')) + '</span>' + marks + '</div>';
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, d = App.data(), self = this;
		var world = d.era || [], count = {};
		world.forEach(function (x) { count[x.scope] = (count[x.scope] || 0) + 1; });
		document.getElementById('content').innerHTML = '<section class="section er"><div class="wrap">' +
			'<p class="er-sum">' + e(L('في كل عام: على جانب ما كتبه وما جرى له، وعلى الجانب الآخر ما كان يحدث حوله. وحين يربط مصدر بين حدث وعدد أو كتاب له، تجد الرابط تحته.', 'In each year: on one side what he wrote and what happened to him, on the other what was happening around him. Where a source ties an event to an issue or a book of his, the link is under it.')) + '</p>' +
			'<div class="er-tools"><div class="chips er-bar"><button type="button" class="chip" data-s="all" aria-pressed="true">' + e(L('الكل', 'All')) + ' <b>' + e(App.num(world.length)) + '</b></button>' +
				this.SCOPES.filter(function (s) { return count[s[0]]; }).map(function (s) {
					return '<button type="button" class="chip" data-s="' + s[0] + '" aria-pressed="false">' + e(App.t(s[1])) + ' <b>' + e(App.num(count[s[0]])) + '</b></button>';
				}).join('') + '</div>' +
				'<nav class="er-decades" aria-label="' + e(L('العقود', 'Decades')) + '">' + [1960, 1970, 1980, 1990, 2000, 2010].map(function (y) { return '<a href="#dec-' + y + '">' + e(App.num(y) + L('ات', 's')) + '</a>'; }).join('') + '</nav></div>' +
			'<ol class="er-years"></ol>' +
			'<p class="er-note">' + e(L('أحداث العالم مختصرة بكلماتنا، ولكلٍّ مصدره. تعرف حدثًا كتب عنه في مقال أو عدد؟', 'The world’s events are put briefly in our own words, each with its source. Know an event he wrote about in an article or an issue?')) +
				' <a href="' + e(App.fixHref(L('زمن العرّاب', 'The Godfather’s times'))) + '" target="_blank" rel="noopener">' + e(L('أخبرنا ↗', 'Tell us ↗')) + '</a></p>' +
		'</div></section>';
		document.querySelector('.er-bar').onclick = function (ev) {
			var b = ev.target.closest('[data-s]');
			if (!b) return;
			self.scope = b.getAttribute('data-s');
			document.querySelectorAll('.er-bar [data-s]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
			self.years();
		};
		this.years();
		App.focusHash();
	},

	years: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L, d = App.data(), self = this;
		var his = this.his(d), world = this.world(d), scope = {}; this.SCOPES.forEach(function (s) { scope[s[0]] = s[1]; });
		var MON = App.lang === 'en' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
		var KIND = { life: L('في حياته', 'His life'), book: L('صدر له', 'Came out'), start: L('بدأت سلسلة', 'A series began'), end: L('انتهت سلسلة', 'A series ended'), award: L('جائزة', 'Award'), screen: L('على الشاشة', 'On screen') };
		var hisItem = function (x) {
			if (x.k === 'book') {
				var r = S.resolveBook(x.id), img = r ? S.coverOf(r.info) : '';
				return '<li class="er-b"><a href="' + e(App.workHref(x.id)) + '">' + S.miniCover({ img: img, color: '#3a2a1f', title: t(x.title) }) + '<span><small>' + e(KIND.book) + '</small>' + e(t(x.title)) + '</span></a></li>';
			}
			if (x.k === 'start' || x.k === 'end') return '<li class="er-s"><small>' + e(KIND[x.k]) + '</small><a href="' + e(S.seriesHref(x.id)) + '">' + e(t(x.title)) + '</a></li>';
			return '<li class="er-' + x.k + '"><small>' + e(KIND[x.k]) + '</small><b>' + e(t(x.title)) + '</b>' + (x.text ? '<p>' + e(t(x.text)) + '</p>' : '') + '</li>';
		};
		var worldItem = function (x) {
			var tie = x.link && x.link.id ? S.resolveBook(x.link.id) : null;
			return '<li class="er-ev er-' + e(x.scope) + '"><small>' + e(t(scope[x.scope] || {})) + (x.month ? ' · ' + e((x.day ? App.num(x.day) + ' ' : '') + MON[x.month - 1]) : '') + '</small>' +
				'<b>' + e(t(x.title)) + '</b><p>' + e(t(x.text)) + '</p>' +
				/* what he wrote of it: the issue or book, and his column on the blog, with a line on what it says */
				(x.link && (tie || x.link.post) ? '<p class="er-tie"><span aria-hidden="true">✎ </span>' + (x.link.note ? e(t(x.link.note)) + ' ' : '') +
					(tie ? '<a href="' + e('book.html?id=' + x.link.id) + '">' + e((tie.series ? t(tie.series.s.title) + ' ' + App.num(tie.item.n) + ': ' : '') + t(tie.item.title)) + '</a>' : '') +
					(tie && x.link.post ? ' · ' : '') + (x.link.post ? '<a href="blog.html?post=' + e(x.link.post) + '">' + e(L('اقرأ المقال', 'Read the column')) + '</a>' : '') + '</p>' : '') +
				(x.src ? '<a class="er-src" href="' + e(x.src) + '" target="_blank" rel="noopener">' + e(L('المصدر ↗', 'Source ↗')) + '</a>' : '') + '</li>';
		};
		var out = '', dec = {};
		for (var y = this.FROM; y <= Math.max(this.TO, 2025); y++) {
			var h = his[y] || [], w = (world[y] || []).filter(function (x) { return self.scope === 'all' || x.scope === self.scope; });
			if (!h.length && !w.length) continue;
			var d10 = Math.floor(y / 10) * 10, mark = dec[d10] ? '' : (dec[d10] = 1, ' id="dec-' + d10 + '"');
			out += '<li class="er-y"' + (mark ? ' data-dec="' + d10 + '"' : '') + '><h2 id="y-' + y + '"' + '><span' + mark + '></span>' + e(App.num(y)) + '</h2>' +
				'<div class="er-cols"><ul class="er-his">' + (h.length ? h.map(hisItem).join('') : '<li class="er-quiet">—</li>') + '</ul>' +
				'<ul class="er-world">' + (w.length ? w.sort(function (a, b) { return (a.month || 0) - (b.month || 0) || (a.day || 0) - (b.day || 0); }).map(worldItem).join('') : '<li class="er-quiet">—</li>') + '</ul></div></li>';
		}
		document.querySelector('.er-years').innerHTML = out;
	}
};
