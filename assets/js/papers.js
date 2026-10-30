/* papers.html — «في الصحف»: where his columns ran, from the blog archive (data-blog.js), which keeps for most articles the
   paper and the date it first ran («الدستور - 28 مايو 2009»). Each outlet as a card (the legend and the filter at once), his
   articles by year as stacked columns, one colour an outlet, and the articles themselves, by year, under it. */
window.PAGE = {
	id: 'papers',
	title: { ar: 'في الصحف', en: 'In the papers' },
	strings: {
		eyebrow: { ar: 'الكاتب الصحفي', en: 'The columnist' },
		title: { ar: 'في الصحف', en: 'In the papers' },
		lead: {
			ar: 'أين نُشرت مقالاته وقصصه، وفي أي الأعوام: كل جريدة وموقع ومجلة كتب فيها، بعدد مقالاته فيها، كما يحفظها أرشيف المدونة.',
			en: 'Where his columns and stories ran, and when: every paper, site and magazine he wrote for, with how many of his pieces each carried, as the blog archive keeps them.'
		}
	},
	/* the outlets as the archive spells them, and one name for each */
	SAME: { 'اﻻتحاد': 'الاتحاد', 'بص وطل': 'بص و طل', 'مؤسسة هنداوي': 'مؤسسة هنداوي للتعليم والثقافة', 'الشباب': 'مجلة الشباب' },
	INFO: {
		'التحرير': { en: 'Al-Tahrir', kind: { ar: 'جريدة', en: 'Newspaper' } },
		'بص و طل': { en: 'Bos w Tol', kind: { ar: 'موقع', en: 'Website' } },
		'إضاءات': { en: 'Ida2at', kind: { ar: 'موقع', en: 'Website' } },
		'الدستور': { en: 'Al-Dostour', kind: { ar: 'جريدة', en: 'Newspaper' } },
		'اليوم الجديد': { en: 'Al-Youm Al-Gadid', kind: { ar: 'جريدة', en: 'Newspaper' } },
		'مجلة الشباب': { en: 'Al-Shabab magazine', kind: { ar: 'مجلة', en: 'Magazine' } },
		'الاتحاد': { en: 'Al-Ittihad', kind: { ar: 'جريدة', en: 'Newspaper' } },
		'مؤسسة هنداوي للتعليم والثقافة': { en: 'Hindawi Foundation', kind: { ar: 'دار نشر', en: 'Publisher' } },
		'اليوم': { en: 'Al-Youm' },
		'بوابة الشباب': { en: 'Bawabet al-Shabab', kind: { ar: 'موقع', en: 'Website' } },
		'مجلة نور': { en: 'Nour magazine', kind: { ar: 'مجلة', en: 'Magazine' } },
		'المصري اليوم': { en: 'Al-Masry Al-Youm', kind: { ar: 'جريدة', en: 'Newspaper' } },
		/* the Tagammu' party's paper, where he first wrote on politics and public affairs (e3lam.com/704514) */
		'التجمع': { en: 'Al-Tagammu', kind: { ar: 'جريدة', en: 'Newspaper' },
			note: { ar: 'جريدة حزب التجمع؛ فيها كتب مقالاته الأولى في السياسة والشأن العام', en: 'The Tagammu’ party’s paper, where he first wrote on politics and public affairs' } }
	},
	/* the first six outlets take the categorical colours in order (validated for both themes); the rest are «أخرى» */
	COLORS: 6,
	filter: 'all',

	/* every article with its outlet and date: { p, outlet, y, date } */
	articles: function () {
		var self = this, posts = ((window.App.data().blog || {}).posts) || [];
		return posts.map(function (p) {
			if (!p.src || /^من كتاب/.test(p.src)) return null;
			var parts = p.src.split(' - '), name = parts[0].trim();
			name = self.SAME[name] || name;
			var y = +((p.src.match(/(19|20)\d\d/) || [])[0] || 0);
			return y ? { p: p, outlet: name, y: y, date: parts.slice(1).join(' - ').trim() } : null;
		}).filter(Boolean);
	},

	render: function () {
		var App = window.App, e = App.esc, L = App.L, self = this;
		var all = this.articles(), by = {};
		all.forEach(function (a) { (by[a.outlet] = by[a.outlet] || []).push(a); });
		var outlets = Object.keys(by).sort(function (a, b) { return by[b].length - by[a].length; });
		this._outlets = outlets; this._by = by; this._all = all;
		var slot = function (name) { var i = outlets.indexOf(name); return i < self.COLORS ? i + 1 : 0; };
		this.slot = slot;
		var nm = function (name) { return App.lang === 'en' && self.INFO[name] && self.INFO[name].en ? self.INFO[name].en : name; };
		this.nm = nm;
		var years = all.map(function (a) { return a.y; }), y0 = Math.min.apply(null, years), y1 = Math.max.apply(null, years);
		this._years = [y0, y1];

		var card = function (name) {
			var list = by[name], ys = list.map(function (a) { return a.y; }), info = self.INFO[name] || {};
			var span = Math.min.apply(null, ys) === Math.max.apply(null, ys) ? App.num(ys[0]) : App.num(Math.min.apply(null, ys)) + '–' + App.num(Math.max.apply(null, ys));
			return '<button type="button" class="pp-card" data-o="' + e(name) + '" style="--s:var(--pp-' + slot(name) + ')" aria-pressed="false"' + (info.note ? ' title="' + e(App.t(info.note)) + '"' : '') + '>' +
				'<i class="pp-dot" aria-hidden="true"></i><b>' + e(nm(name)) + '</b>' +
				'<span class="pp-n">' + (list.length === 1 ? '<small>' + e(L('مقال واحد', '1 piece')) + '</small>' : e(App.num(list.length)) + ' <small>' + e(L(list.length === 2 ? 'مقالان' : list.length > 10 ? 'مقالًا' : 'مقالات', 'pieces')) + '</small>') + '</span>' +
				'<span class="pp-meta">' + (info.kind ? e(App.t(info.kind)) + ' · ' : '') + e(span) + '</span></button>';
		};
		document.getElementById('content').innerHTML =
			'<section class="section pp"><div class="wrap">' +
				'<div class="pp-sum"><b>' + e(App.num(all.length)) + '</b> ' + e(L('مقالًا وقصة في ', 'pieces in ')) + '<b>' + e(App.num(outlets.length)) + '</b> ' +
					e(L('جريدة وموقعًا ومجلة، بين ', 'papers, sites and magazines, from ')) + e(App.num(y0)) + e(L(' و', ' to ')) + e(App.num(y1)) + '.</div>' +
				'<div class="pp-cards"><button type="button" class="pp-card pp-all" data-o="all" aria-pressed="true"><b>' + e(L('كل الصحف', 'Every outlet')) + '</b>' +
					'<span class="pp-n">' + e(App.num(all.length)) + '</span></button>' + outlets.map(card).join('') + '</div>' +
				'<figure class="pp-chart"><figcaption>' + e(L('مقالاته في كل عام', 'His pieces, year by year')) + '</figcaption><div class="pp-plot"></div><div class="pp-tip" role="status" hidden></div></figure>' +
				'<div class="pp-list"></div>' +
			'</div></section>';
		var root = document.querySelector('.pp');
		root.querySelector('.pp-cards').onclick = function (ev) {
			var b = ev.target.closest('.pp-card');
			if (!b) return;
			self.filter = b.getAttribute('data-o');
			self.update();
		};
		this.update();
	},

	update: function () {
		var self = this;
		document.querySelectorAll('.pp-card').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-o') === self.filter)); });
		this.chart();
		this.list();
	},

	/* stacked columns, a year each: one segment an outlet, 2px of surface between them, the top rounded; the chosen outlet
	   in front and the others faded; a tooltip on each segment */
	chart: function () {
		var App = window.App, e = App.esc, L = App.L, self = this, by = this._by, outlets = this._outlets;
		var y0 = this._years[0], y1 = this._years[1], years = [];
		for (var y = y0; y <= y1; y++) years.push(y);
		var count = {}, max = 0;
		years.forEach(function (yr) {
			count[yr] = outlets.map(function (o) { return [o, by[o].filter(function (a) { return a.y === yr; }).length]; }).filter(function (x) { return x[1]; });
			max = Math.max(max, count[yr].reduce(function (n, x) { return n + x[1]; }, 0));
		});
		var W = 1000, H = 300, padL = 36, padB = 30, padT = 10, bw = (W - padL) / years.length, colW = Math.min(46, bw * 0.62);
		var step = max > 100 ? 50 : max > 40 ? 20 : 10, top = Math.ceil(max / step) * step;
		var yScale = function (v) { return (H - padB) - v / top * (H - padB - padT); };
		var rtl = App.lang !== 'en';
		var xOf = function (i) { var k = rtl ? years.length - 1 - i : i; return padL + k * bw + (bw - colW) / 2; };
		var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + e(L('عدد مقالاته في كل عام', 'His pieces per year')) + '">';
		for (var g = 0; g <= top; g += step) svg += '<line class="pp-grid" x1="' + padL + '" x2="' + W + '" y1="' + yScale(g) + '" y2="' + yScale(g) + '"/><text class="pp-ax" x="' + (padL - 8) + '" y="' + (yScale(g) + 4) + '" text-anchor="end">' + e(App.num(g)) + '</text>';
		years.forEach(function (yr, i) {
			var x = xOf(i), acc = 0, segs = count[yr], last = segs.length - 1;
			segs.forEach(function (s, k) {
				var h = s[1] / top * (H - padB - padT), yTop = yScale(acc + s[1]);
				var gap = k < last ? 2 : 0, hh = Math.max(0, h - gap), r = k === last ? Math.min(4, hh / 2) : 0;
				var on = self.filter === 'all' || self.filter === s[0];
				/* a rect with only its top corners rounded */
				var d = 'M' + x + ',' + (yTop + gap + hh) + 'V' + (yTop + gap + r) + (r ? 'Q' + x + ',' + (yTop + gap) + ' ' + (x + r) + ',' + (yTop + gap) : '') +
					'H' + (x + colW - r) + (r ? 'Q' + (x + colW) + ',' + (yTop + gap) + ' ' + (x + colW) + ',' + (yTop + gap + r) : '') + 'V' + (yTop + gap + hh) + 'Z';
				svg += '<path class="pp-seg' + (on ? '' : ' is-off') + '" d="' + d + '" style="fill:var(--pp-' + self.slot(s[0]) + ')" data-t="' + e(self.nm(s[0]) + ' · ' + yr + ' · ' + s[1]) + '"/>';
				acc += s[1];
			});
			/* a wide invisible target over the whole year, for the year's tooltip */
			svg += '<rect class="pp-hit" x="' + (padL + (rtl ? years.length - 1 - i : i) * bw) + '" y="' + padT + '" width="' + bw + '" height="' + (H - padB - padT) + '" data-y="' + yr + '"/>';
			svg += '<text class="pp-ax pp-yr" x="' + (x + colW / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + e(App.num(yr)) + '</text>';
		});
		svg += '</svg>';
		var plot = document.querySelector('.pp-plot'), tip = document.querySelector('.pp-tip');
		plot.innerHTML = svg;
		/* the year's tooltip: each outlet that year, with its colour and count */
		plot.onmousemove = function (ev) {
			var hit = ev.target.closest('.pp-hit');
			if (!hit) { tip.hidden = true; return; }
			var yr = +hit.getAttribute('data-y'), segs = count[yr];
			if (!segs.length) { tip.hidden = true; return; }
			tip.innerHTML = '<b>' + e(App.num(yr)) + '</b>' + segs.slice().sort(function (a, b) { return b[1] - a[1]; }).map(function (s) {
				return '<span class="' + (self.filter === 'all' || self.filter === s[0] ? '' : 'is-off') + '"><i style="background:var(--pp-' + self.slot(s[0]) + ')"></i>' + e(self.nm(s[0])) + '<em>' + e(App.num(s[1])) + '</em></span>';
			}).join('');
			tip.hidden = false;
			var box = plot.getBoundingClientRect(), x = ev.clientX - box.left, w = tip.offsetWidth;
			tip.style.left = Math.max(0, Math.min(box.width - w, x - w / 2)) + 'px';
			tip.style.top = Math.max(0, ev.clientY - box.top - tip.offsetHeight - 14) + 'px';
		};
		plot.onmouseleave = function () { tip.hidden = true; };
	},

	/* the articles themselves: the chosen outlet's (or all), newest year first */
	list: function () {
		var App = window.App, e = App.esc, L = App.L, self = this;
		var list = this.filter === 'all' ? this._all : this._by[this.filter] || [];
		var ys = {};
		list.forEach(function (a) { (ys[a.y] = ys[a.y] || []).push(a); });
		var order = Object.keys(ys).map(Number).sort(function (a, b) { return b - a; });
		var blogImg = function (u) { var b = App.data().blog || {}; return !u ? '' : u.indexOf('g:') === 0 ? b.img + u.slice(2) : u; };
		document.querySelector('.pp-list').innerHTML = '<h2 class="pp-h">' + e(this.filter === 'all' ? L('كل مقالاته في الصحف', 'All his pieces in the papers') : self.nm(this.filter)) +
			' <small>(' + e(App.num(list.length)) + ')</small></h2>' +
			order.map(function (y) {
				return '<details class="pp-year"' + (order.length < 4 || y === order[0] ? ' open' : '') + '><summary><b>' + e(App.num(y)) + '</b><span>' + e(App.num(ys[y].length)) + '</span></summary><ul>' +
					ys[y].map(function (a) {
						var img = blogImg(a.p.img);
						return '<li><a href="blog.html?post=' + e(a.p.id) + '">' +
							(img ? '<img src="' + e(img.replace(/\/s\d+(-[a-z]+)?\//, '/s120/')) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '<i class="pp-noimg" style="background:var(--pp-' + self.slot(a.outlet) + ')"></i>') +
							'<span><b>' + e(a.p.t) + '</b><small>' + e(self.filter === 'all' ? self.nm(a.outlet) + (a.date ? ' · ' : '') : '') + e(a.date) + '</small></span></a></li>';
					}).join('') + '</ul></details>';
			}).join('');
	}
};
