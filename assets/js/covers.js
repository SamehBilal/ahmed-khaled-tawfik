/* covers.html — «جدار الأغلفة»: every cover the site holds, on one wall — each issue's and book's cover and those of its other
   editions, each once — filtered by series, and «then and now»: the Ma Wara' al-Tabi'a issues whose first edition the site
   has, the 1990s cover beside today's. Every cover opens its book's page. */
window.PAGE = {
	id: 'covers',
	title: { ar: 'جدار الأغلفة', en: 'The cover wall' },
	strings: {
		eyebrow: { ar: 'معرض', en: 'A gallery' },
		title: { ar: 'جدار الأغلفة', en: 'The cover wall' },
		lead: {
			ar: 'كل غلاف في هذا الموقع على جدار واحد: أعداد السلاسل وكتبه وطبعاتها المختلفة. اختر سلسلة، أو قارن أغلفة «ما وراء الطبيعة» الأولى بطبعاتها الحالية.',
			en: 'Every cover on this site on one wall: the series’ issues, his books and their other editions. Pick a series, or set Ma Wara’ al-Tabi’a’s first covers beside today’s.'
		}
	},
	filter: 'all',

	/* every cover once: { src, href, title, sid, n, first } */
	covers: function () {
		if (this._covers) return this._covers;
		var App = window.App, S = window.WorksShared, d = App.data(), t = App.t, seen = {}, out = [];
		var add = function (src, href, title, sid, n, ed) {
			if (!src || seen[src]) return;
			seen[src] = 1;
			out.push({ src: src, href: href, title: title, sid: sid, n: n, ed: ed || '' });
		};
		S.ownSeries().concat(S.contributedSeries()).forEach(function (s) {
			S.seriesIssues(s.id).forEach(function (is, i) {
				var href = App.issueHref(s.id, Object.assign({ _idx: i }, is)), key = decodeURIComponent(href.replace(/^book\.html\?id=/, ''));
				add(S.issueCover(s.id, is), href, t(is.title), s.id, is.n);
				(((d.issueInfo || {})[key] || {}).editions || []).forEach(function (ed) { add(S.coverOf(ed), href, t(is.title), s.id, is.n, t(ed.publisher) + (ed.year ? ' ' + ed.year : '')); });
			});
		});
		(d.works || []).forEach(function (w) {
			var info = (d.bookInfo || {})[w.id] || {};
			add(S.coverOf(info), S.bookHref(w.id), t(w.title), 'works');
			(info.editions || []).forEach(function (ed) { add(S.coverOf(ed), S.bookHref(w.id), t(w.title), 'works', null, t(ed.publisher) + (ed.year ? ' ' + ed.year : '')); });
		});
		return (this._covers = out);
	},

	/* the Ma Wara' al-Tabi'a issues with a first-edition cover: [issue, first cover, today's cover, href] */
	pairs: function () {
		var App = window.App, S = window.WorksShared, d = App.data(), out = [];
		S.seriesIssues('mwt').forEach(function (is, i) {
			if (is.part > 1) return;
			var href = App.issueHref('mwt', Object.assign({ _idx: i }, is)), key = decodeURIComponent(href.replace(/^book\.html\?id=/, ''));
			var first = (((d.issueInfo || {})[key] || {}).editions || []).filter(function (ed) { return /first-ed/.test(ed.cover || ''); })[0];
			var now = S.issueCover('mwt', is);
			if (first && now && first.cover !== now) out.push([is, first.cover, now, href]);
		});
		return out;
	},

	/* the band: a wall of covers sliding slowly in rows */
	band: function (d, A) {
		var c = window.PAGE.covers().filter(function (x) { return x.sid !== 'works'; }), rows = '';
		for (var r = 0; r < 3; r++) {
			var row = '';
			for (var k = 0; k < 18; k++) { var x = c[(r * 41 + k * 7) % c.length]; row += '<i style="background-image:url(&quot;' + A.esc(x.src) + '&quot;)"></i>'; }
			rows += '<div class="cw-row" style="--d:' + (r % 2 ? 'reverse' : 'normal') + ';--t:' + (60 + r * 15) + 's"><div>' + row + row + '</div></div>';
		}
		return rows;
	},

	render: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L, self = this;
		var all = this.covers(), count = {};
		all.forEach(function (x) { count[x.sid] = (count[x.sid] || 0) + 1; });
		var sids = Object.keys(count).filter(function (k) { return k !== 'works'; }).sort(function (a, b) { return count[b] - count[a]; });
		var name = function (k) { return k === 'works' ? L('الكتب', 'Books') : t(S.anySeries(k).s.title); };
		var chip = function (k, label, n) { return '<button type="button" class="chip" data-f="' + k + '" aria-pressed="' + (self.filter === k) + '">' + e(label) + (n ? ' <b>' + e(App.num(n)) + '</b>' : '') + '</button>'; };
		document.getElementById('content').innerHTML = '<section class="section cw"><div class="wrap">' +
			'<div class="cw-bar chips">' + chip('all', L('الكل', 'All'), all.length) + chip('pairs', L('الأول والآن', 'Then and now'), this.pairs().length) +
				chip('works', name('works'), count.works) + sids.map(function (k) { return chip(k, name(k), count[k]); }).join('') + '</div>' +
			'<div class="cw-wall"></div></div></section>';
		document.querySelector('.cw-bar').onclick = function (ev) {
			var b = ev.target.closest('[data-f]');
			if (!b) return;
			self.filter = b.getAttribute('data-f');
			document.querySelectorAll('.cw-bar [data-f]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
			self.draw();
		};
		this.draw();
	},

	draw: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, L = App.L, wall = document.querySelector('.cw-wall');
		if (this.filter === 'pairs') {
			wall.className = 'cw-wall is-pairs';
			wall.innerHTML = this.pairs().map(function (p) {
				return '<a class="cw-pair" href="' + e(p[3]) + '"><span class="cw-n">' + e(App.num(p[0].n)) + '</span>' +
					'<figure><img src="' + e(p[1]) + '" alt="" loading="lazy"><figcaption>' + e(L('الطبعة الأولى', 'First edition')) + '</figcaption></figure>' +
					'<figure><img src="' + e(p[2]) + '" alt="" loading="lazy"><figcaption>' + e(L('اليوم', 'Today')) + '</figcaption></figure>' +
					'<b>' + e(App.t(p[0].title)) + '</b></a>';
			}).join('');
			return;
		}
		var f = this.filter, list = this.covers().filter(function (x) { return f === 'all' || x.sid === f; });
		wall.className = 'cw-wall';
		wall.innerHTML = list.map(function (x) {
			var label = x.title + (x.n != null ? ' #' + x.n : '') + (x.ed ? ' — ' + x.ed : '');
			return '<a href="' + e(x.href) + '" title="' + e(label) + '"><img src="' + e(x.src) + '" alt="' + e(label) + '" loading="lazy" decoding="async"></a>';
		}).join('');
	}
};
