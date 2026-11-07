/* «في الصحف» — the top of the blog page's archive (blog.html#papers; papers.html, once a page of its own, leads there): where his
   columns ran, from the blog archive (data-blog.js), which keeps for most articles the paper and the date it first ran
   («الدستور - 28 مايو 2009»). Each outlet as a card, which is the legend and the archive's filter at once (with «خارج الصحف»
   for what the archive has from no paper), and his pieces by year as stacked columns, one colour an outlet. The archive's
   other filters (the kinds and the search, blog.js) narrow the cards' counts and the chart too; the outlet chosen here
   narrows the archive's piles under them. blog.js draws it (html), wires it (wire) and gives it the posts it shows (set). */
window.PapersSection = {
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
		'زائد 18': { en: 'Zayed 18', kind: { ar: 'موقع', en: 'Website' } },
		/* the General Book Organisation's literary quarterly (issue 76, summer–autumn 2009) */
		'مجلة فصول': { en: 'Fusul magazine', kind: { ar: 'مجلة', en: 'Magazine' } },
		'المصري اليوم': { en: 'Al-Masry Al-Youm', kind: { ar: 'جريدة', en: 'Newspaper' } },
		/* the Tagammu' party's paper, where he first wrote on politics and public affairs (e3lam.com/704514) */
		'التجمع': { en: 'Al-Tagammu', kind: { ar: 'جريدة', en: 'Newspaper' },
			note: { ar: 'جريدة حزب التجمع؛ فيها كتب مقالاته الأولى في السياسة والشأن العام', en: 'The Tagammu’ party’s paper, where he first wrote on politics and public affairs' } }
	},
	/* the first six outlets take the categorical colours in order (validated for both themes); the rest are «أخرى» */
	COLORS: 6,
	/* the outlet chosen: 'all', an outlet's name, or 'none' (the posts that ran in no paper) */
	filter: 'all',

	/* a post's outlet and the year it ran there: { outlet, y, date }, or null for a post from no paper */
	of: function (p) {
		if (!this._of) this._of = {};
		if (p.id in this._of) return this._of[p.id];
		var r = null;
		if (p.src && !/^من كتاب/.test(p.src)) {
			var parts = p.src.split(' - '), name = parts[0].trim(), y = +((p.src.match(/(19|20)\d\d/) || [])[0] || 0);
			if (y) r = { outlet: this.SAME[name] || name, y: y, date: parts.slice(1).join(' - ').trim() };
		}
		return (this._of[p.id] = r);
	},
	/* does a post pass the outlet chosen? */
	matches: function (p) {
		if (this.filter === 'all') return true;
		var o = this.of(p);
		return this.filter === 'none' ? !o : !!o && o.outlet === this.filter;
	},

	/* the markup: the totals, the outlets' cards, the archive's other filters (more, from blog.js) and the chart; set() fills
	   the counts and the chart */
	html: function (more) {
		var App = window.App, e = App.esc, L = App.L, self = this, posts = ((App.data().blog || {}).posts) || [];
		var by = {}, all = posts.filter(function (p) { return self.of(p); });
		all.forEach(function (p) { var o = self.of(p).outlet; (by[o] = by[o] || []).push(p); });
		var outlets = this._outlets = Object.keys(by).sort(function (a, b) { return by[b].length - by[a].length; });
		var years = all.map(function (p) { return self.of(p).y; }), y0 = Math.min.apply(null, years), y1 = Math.max.apply(null, years);
		this._years = [y0, y1];
		var card = function (name) {
			var ys = by[name].map(function (p) { return self.of(p).y; }), info = self.INFO[name] || {}, a = Math.min.apply(null, ys), b = Math.max.apply(null, ys);
			return '<button type="button" class="pp-card" data-o="' + e(name) + '" style="--s:var(--pp-' + self.slot(name) + ')" aria-pressed="false"' + (info.note ? ' title="' + e(App.t(info.note)) + '"' : '') + '>' +
				'<i class="pp-dot" aria-hidden="true"></i><b>' + e(self.nm(name)) + '</b><span class="pp-n"></span>' +
				'<span class="pp-meta">' + (info.kind ? e(App.t(info.kind)) + ' · ' : '') + e(a === b ? App.num(a) : App.num(a) + '–' + App.num(b)) + '</span></button>';
		};
		return '<div class="pp" id="papers">' +
				'<p class="pp-sum"><b>' + e(App.num(all.length)) + '</b> ' + e(L('مقالًا وقصة في ', 'pieces in ')) + '<b>' + e(App.num(outlets.length)) + '</b> ' +
					e(L('جريدة وموقعًا ومجلة، بين ', 'papers, sites and magazines, from ')) + e(App.num(y0)) + e(L(' و', ' to ')) + e(App.num(y1)) +
					e(L('. اختر صحيفة لترى مقالاتها وحدها في الأرشيف تحتها.', '. Pick one to see only its pieces in the archive below.')) + '</p>' +
				'<div class="pp-cards" role="group" aria-label="' + e(L('الصحيفة', 'Outlet')) + '">' +
					'<button type="button" class="pp-card pp-all" data-o="all" aria-pressed="true"><b>' + e(L('كل المنشورات', 'Every post')) + '</b><span class="pp-n"></span></button>' +
					outlets.map(card).join('') +
					'<button type="button" class="pp-card pp-all" data-o="none" aria-pressed="false"><b>' + e(L('خارج الصحف', 'In no paper')) + '</b><span class="pp-n"></span>' +
						'<span class="pp-meta">' + e(L('ما في المدونة وحدها ومقتطفات كتبه', 'The blog’s own posts and extracts from his books')) + '</span></button>' +
				'</div>' + (more || '') +
				'<figure class="pp-chart"><figcaption>' + e(L('مقالاته في الصحف في كل عام', 'His pieces in the papers, year by year')) + '</figcaption><div class="pp-plot"></div><div class="pp-tip" role="status" hidden></div></figure>' +
			'</div>';
	},
	slot: function (name) { var i = (this._outlets || []).indexOf(name); return i >= 0 && i < this.COLORS ? i + 1 : 0; },
	nm: function (name) { return window.App.lang === 'en' && this.INFO[name] && this.INFO[name].en ? this.INFO[name].en : name; },

	/* the cards choose the outlet; onChange redraws the archive (blog.js). blog.html#papers-الدستور starts on that outlet */
	wire: function (onChange) {
		var self = this, root = document.querySelector('.pp');
		if (!root) return;
		var m = /^#papers-(.+)$/.exec(location.hash), o = m && decodeURIComponent(m[1]);
		if (o && root.querySelector('.pp-card[data-o="' + o.replace(/"/g, '') + '"]')) this.filter = o;
		root.querySelector('.pp-cards').onclick = function (ev) {
			var b = ev.target.closest('.pp-card');
			if (!b) return;
			self.filter = b.getAttribute('data-o');
			/* (the address names the outlet, to share: blog.html#papers-الدستور) */
			history.replaceState(null, '', location.pathname + location.search + (self.filter === 'all' ? '' : '#papers-' + encodeURIComponent(self.filter)));
			if (onChange) onChange();
		};
	},

	/* the posts the archive's other filters let through (kind and search): the cards count them, the chart draws them */
	set: function (posts) {
		var App = window.App, e = App.esc, L = App.L, self = this, n = { all: posts.length, none: 0 };
		posts.forEach(function (p) { var o = self.of(p); if (o) n[o.outlet] = (n[o.outlet] || 0) + 1; else n.none++; });
		document.querySelectorAll('.pp-card').forEach(function (b) {
			var k = b.getAttribute('data-o'), c = n[k] || 0;
			b.setAttribute('aria-pressed', String(k === self.filter));
			b.classList.toggle('is-empty', !c);
			b.querySelector('.pp-n').innerHTML = !c ? '<small>' + e(L('لا شيء هنا', 'None here')) + '</small>' : c === 1 ? '<small>' + e(L('منشور واحد', '1 post')) + '</small>' : c === 2 ? '<small>' + e(L('منشوران', '2 posts')) + '</small>' :
				e(App.num(c)) + ' <small>' + e(L(c >= 3 && c <= 10 ? 'منشورات' : 'منشورًا', 'posts')) + '</small>';
		});
		this.chart(posts);
	},

	/* stacked columns, a year each: one segment an outlet, 2px of surface between them, the top rounded; the chosen outlet
	   in front and the others faded; the year's outlets in a tooltip */
	chart: function (posts) {
		var App = window.App, e = App.esc, L = App.L, self = this, outlets = this._outlets;
		var y0 = this._years[0], y1 = this._years[1], years = [], count = {}, max = 0;
		for (var y = y0; y <= y1; y++) years.push(y);
		var cell = {};
		posts.forEach(function (p) { var o = self.of(p); if (o) { var k = o.y + '|' + o.outlet; cell[k] = (cell[k] || 0) + 1; } });
		years.forEach(function (yr) {
			count[yr] = outlets.map(function (o) { return [o, cell[yr + '|' + o] || 0]; }).filter(function (x) { return x[1]; });
			max = Math.max(max, count[yr].reduce(function (s, x) { return s + x[1]; }, 0));
		});
		var W = 1000, H = 300, padL = 36, padB = 30, padT = 10, bw = (W - padL) / years.length, colW = Math.min(46, bw * 0.62);
		var step = max > 100 ? 50 : max > 40 ? 20 : max > 10 ? 10 : 2, top = Math.ceil(max / step) * step || step;
		var yScale = function (v) { return (H - padB) - v / top * (H - padB - padT); };
		var rtl = App.lang !== 'en';
		var xOf = function (i) { var k = rtl ? years.length - 1 - i : i; return padL + k * bw + (bw - colW) / 2; };
		var on = function (o) { return self.filter === 'all' || self.filter === o; };
		var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + e(L('عدد مقالاته في الصحف في كل عام', 'His pieces in the papers per year')) + '">';
		for (var g = 0; g <= top; g += step) svg += '<line class="pp-grid" x1="' + padL + '" x2="' + W + '" y1="' + yScale(g) + '" y2="' + yScale(g) + '"/><text class="pp-ax" x="' + (padL - 8) + '" y="' + (yScale(g) + 4) + '" text-anchor="end">' + e(App.num(g)) + '</text>';
		years.forEach(function (yr, i) {
			var x = xOf(i), acc = 0, segs = count[yr], last = segs.length - 1;
			segs.forEach(function (s, k) {
				var h = s[1] / top * (H - padB - padT), yTop = yScale(acc + s[1]);
				var gap = k < last ? 2 : 0, hh = Math.max(0, h - gap), r = k === last ? Math.min(4, hh / 2) : 0;
				/* a rect with only its top corners rounded */
				var d = 'M' + x + ',' + (yTop + gap + hh) + 'V' + (yTop + gap + r) + (r ? 'Q' + x + ',' + (yTop + gap) + ' ' + (x + r) + ',' + (yTop + gap) : '') +
					'H' + (x + colW - r) + (r ? 'Q' + (x + colW) + ',' + (yTop + gap) + ' ' + (x + colW) + ',' + (yTop + gap + r) : '') + 'V' + (yTop + gap + hh) + 'Z';
				svg += '<path class="pp-seg' + (on(s[0]) ? '' : ' is-off') + '" d="' + d + '" style="fill:var(--pp-' + self.slot(s[0]) + ')"/>';
				acc += s[1];
			});
			/* a wide invisible target over the whole year, for the year's tooltip */
			svg += '<rect class="pp-hit" x="' + (padL + (rtl ? years.length - 1 - i : i) * bw) + '" y="' + padT + '" width="' + bw + '" height="' + (H - padB - padT) + '" data-y="' + yr + '"/>';
			svg += '<text class="pp-ax pp-yr" x="' + (x + colW / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + e(App.num(yr)) + '</text>';
		});
		var plot = document.querySelector('.pp-plot'), tip = document.querySelector('.pp-tip');
		if (!plot) return;
		plot.innerHTML = svg + '</svg>';
		plot.onmousemove = function (ev) {
			var hit = ev.target.closest('.pp-hit');
			if (!hit) { tip.hidden = true; return; }
			var yr = +hit.getAttribute('data-y'), segs = count[yr];
			if (!segs.length) { tip.hidden = true; return; }
			tip.innerHTML = '<b>' + e(App.num(yr)) + '</b>' + segs.slice().sort(function (a, b) { return b[1] - a[1]; }).map(function (s) {
				return '<span class="' + (on(s[0]) ? '' : 'is-off') + '"><i style="background:var(--pp-' + self.slot(s[0]) + ')"></i>' + e(self.nm(s[0])) + '<em>' + e(App.num(s[1])) + '</em></span>';
			}).join('');
			tip.hidden = false;
			var box = plot.getBoundingClientRect(), x = ev.clientX - box.left, w = tip.offsetWidth;
			tip.style.left = Math.max(0, Math.min(box.width - w, x - w / 2)) + 'px';
			tip.style.top = Math.max(0, ev.clientY - box.top - tip.offsetHeight - 14) + 'px';
		};
		plot.onmouseleave = function () { tip.hidden = true; };
	}
};
