/* The top of the blog page's archive (blog.html#papers; papers.html, once a page of its own, leads there), its second level
   of filters: the kind (الكل / مقالات / قصص / كوميكس, blog.js) is the first, and each kind is cut its own way —
   - the posts and the columns by where they ran, from the blog archive (data-blog.js), which keeps for most of them the
     paper and the date they first ran («الدستور - 28 مايو 2009»), with «خارج الصحف» for what ran in no paper;
   - the stories by the serial each one is an episode of («رفقاء الليل»، «معرض الموت»…), with «قصص منفردة» for the rest;
   - the comics by their strand («مصر بالصور» on Bos w Tol, «صبيان وبنات»…).
   Each group is a card, which is the legend and the filter at once, and under them the posts that ran in the papers, year
   by year, as stacked columns, one colour an outlet, the chosen group's in front. The search (blog.js) narrows the cards'
   counts and the chart; the card chosen narrows the archive's piles under them. blog.js draws it (html), wires it (wire),
   tells it the kind (mode) and gives it the posts it shows (set). */
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
	/* the stories' serials and the comics' strands, in English; a story's labels that name no serial; the comics' strands */
	GROUPS_EN: {
		'قصص لا تكتمل': 'Stories That Never End', 'نقوش': 'Inscriptions', 'رفقاء الليل': 'Companions of the Night',
		'حكاية للأطفال فقط': 'A Tale for Children Only', 'حكايات مومياء الثلوج': 'Tales of the Snow Mummy', 'معرض الموت': 'The Exhibition of Death',
		'الجلسة': 'The Séance', 'بلهاء في الأوقيانوسية وروايات أخرى': 'Idiots in Oceania and Other Novels', 'هشام يخفي سرًا': 'Hisham Hides a Secret',
		'تنصت': 'Eavesdropping', 'عشر علامات': 'Ten Signs', 'سفاح المستنقعات': 'The Swamp Killer', 'الرواية': 'The Novel', 'قصة لم تكتمل': 'An Unfinished Story',
		'مصر بالصور': 'Egypt in Pictures', 'صبيان وبنات': 'Sebyan wa Banat', 'قعدة أصحاب': 'Qa’det Ashab'
	},
	NOT_SERIAL: ['إضاءات', 'بص وطل', 'اليوم الجديد', 'قصة قصيرة', 'قصص قصيرة', 'روايات', 'ثقافة و أدب', 'فن وأدب', 'مما سبق', 'E.S.P'],
	COMIC_STRANDS: ['مصر بالصور', 'صبيان وبنات', 'قعدة أصحاب'],
	/* where a strand ran when the archive keeps no outlet for it (its label) */
	COMIC_WHERE: { 'صبيان وبنات': { ar: 'أخبار اليوم', en: 'Akhbar El-Yom' } },
	/* how the cards cut the posts: 'papers' (every post, or the columns), 'stories' or 'comics' — the kind chosen, blog.js */
	mode: 'papers',
	kind: 'all',
	/* the card chosen: 'all', a group's key (an outlet, a serial, a strand), or 'none' (the posts in no group) */
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
	/* a post's group in the mode: the outlet it ran in; the serial it is an episode of; the comic's strand, else the outlet
	   it ran in (its label, where the archive keeps no date for it); null for none */
	group: function (p) {
		var l = p.l || [], o = this.of(p), self = this;
		if (this.mode === 'stories') return l.filter(function (x) { return self.NOT_SERIAL.indexOf(x) < 0; })[0] || null;
		if (this.mode === 'comics') {
			var st = this.COMIC_STRANDS.filter(function (x) { return l.indexOf(x) >= 0; })[0];
			return st || (o ? o.outlet : l.indexOf('بص وطل') >= 0 ? 'بص و طل' : null);
		}
		return o ? o.outlet : null;
	},
	/* the year a post ran (in its paper, else on the blog) */
	year: function (p) { var o = this.of(p); return o ? o.y : +p.d.slice(0, 4); },
	/* does a post pass the card chosen? */
	matches: function (p) {
		if (this.filter === 'all') return true;
		var g = this.group(p);
		return this.filter === 'none' ? !g : g === this.filter;
	},

	/* the markup: the first level (top, from blog.js: the kinds and the search), then the summary, the cards and the chart,
	   which set() fills for the kind chosen */
	html: function (top) {
		var App = window.App, self = this, posts = ((App.data().blog || {}).posts) || [];
		/* the outlets and the years of every post that ran in a paper: the colours and the chart's span stay as they are
		   whatever is chosen */
		var by = {}, all = posts.filter(function (p) { return self.of(p); });
		all.forEach(function (p) { var o = self.of(p).outlet; by[o] = (by[o] || 0) + 1; });
		this._outlets = Object.keys(by).sort(function (a, b) { return by[b] - by[a]; });
		var years = all.map(function (p) { return self.of(p).y; });
		this._years = [Math.min.apply(null, years), Math.max.apply(null, years)];
		return '<div class="pp" id="papers">' + (top || '') +
				'<div class="pp-level"><p class="pp-sum"></p><div class="pp-cards" role="group"></div></div>' +
				'<figure class="pp-chart"><figcaption></figcaption><div class="pp-plot"></div><div class="pp-tip" role="status" hidden></div></figure>' +
			'</div>';
	},
	slot: function (name) { var i = (this._outlets || []).indexOf(name); return i >= 0 && i < this.COLORS ? i + 1 : 0; },
	nm: function (name) {
		if (window.App.lang !== 'en') return name;
		return this.INFO[name] && this.INFO[name].en ? this.INFO[name].en : this.GROUPS_EN[name] || name;
	},

	/* the cards choose the group; onChange redraws the archive (blog.js). blog.html#papers-الدستور starts on that outlet */
	wire: function (onChange) {
		var self = this, root = document.querySelector('.pp');
		if (!root) return;
		var m = /^#papers-(.+)$/.exec(location.hash), o = m && decodeURIComponent(m[1]);
		if (o && (o === 'none' || (this._outlets || []).indexOf(o) >= 0)) { this.mode = 'papers'; this.filter = o; }
		root.querySelector('.pp-cards').onclick = function (ev) {
			var b = ev.target.closest('.pp-card');
			if (!b) return;
			self.filter = b.getAttribute('data-o');
			/* (the address names an outlet, to share: blog.html#papers-الدستور) */
			history.replaceState(null, '', location.pathname + location.search + (self.filter === 'all' || self.mode !== 'papers' ? '' : '#papers-' + encodeURIComponent(self.filter)));
			if (onChange) onChange();
		};
	},
	/* the kind chosen (blog.js): every post and the columns are cut by outlet, the stories by serial, the comics by strand */
	setKind: function (kind) {
		var mode = kind === 'stories' || kind === 'comics' ? kind : 'papers';
		if (mode !== this.mode) {
			this.mode = mode; this.filter = 'all';
			if (/^#papers-/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
		}
		this.kind = kind;
	},

	/* a count and its noun: 1 and 2 by the noun alone (منشور واحد، منشوران), 3–10 with the plural, 11 and up with the
	   singular — { n: the figure or '', w: the words } */
	count: function (c, k) {
		var App = window.App, W = {
			post: ['منشور واحد', 'منشوران', 'منشورات', 'منشورًا', 'post', 'posts'],
			article: ['مقال واحد', 'مقالان', 'مقالات', 'مقالًا', 'column', 'columns'],
			story: ['قصة واحدة', 'قصتان', 'قصص', 'قصة', 'story', 'stories'],
			ep: ['حلقة واحدة', 'حلقتان', 'حلقات', 'حلقة', 'episode', 'episodes'],
			comic: ['كوميكس واحد', '', 'كوميكس', 'كوميكس', 'comic', 'comics']
		}[k];
		if (App.lang === 'en') return { n: App.num(c), w: c === 1 ? W[4] : W[5] };
		if (c === 1 || (c === 2 && W[1])) return { n: '', w: W[c - 1] };
		return { n: App.num(c), w: c >= 3 && c <= 10 ? W[2] : W[3] };
	},

	/* the summary and the cards for the kind's posts (kindPosts: every post of the kind; posts: those the search lets
	   through, which the cards count and the chart draws) */
	set: function (kindPosts, posts) {
		var App = window.App, e = App.esc, L = App.L, self = this, mode = this.mode, kind = this.kind;
		var root = document.querySelector('.pp');
		if (!root) return;
		/* the groups, from every post of the kind, so the cards stay put while the search narrows their counts */
		var G = {}, none = 0;
		kindPosts.forEach(function (p) {
			var g = self.group(p);
			if (!g) { none++; return; }
			var x = G[g] = G[g] || { key: g, n: 0, ys: [], outlets: {}, last: '' };
			x.n++; x.ys.push(self.year(p)); if (p.d > x.last) x.last = p.d;
			var o = self.of(p); if (o) x.outlets[o.outlet] = (x.outlets[o.outlet] || 0) + 1;
		});
		var groups = Object.keys(G).map(function (k) { return G[k]; });
		/* the serials as they ran, the latest first; the outlets and the strands by size */
		groups.sort(mode === 'stories' ? function (a, b) { return a.last < b.last ? 1 : -1; } : function (a, b) { return b.n - a.n; });
		/* each group's colour: its outlet's (the one most of it ran in) */
		groups.forEach(function (x) { x.outlet = mode === 'papers' ? x.key : Object.keys(x.outlets).sort(function (a, b) { return x.outlets[b] - x.outlets[a]; })[0] || (x.key === 'بص و طل' ? x.key : ''); });
		if (this.filter !== 'all' && !(this.filter === 'none' ? none : G[this.filter])) this.filter = 'all';
		var n = { all: posts.length, none: 0 };
		posts.forEach(function (p) { var g = self.group(p); if (g) n[g] = (n[g] || 0) + 1; else n.none++; });

		var unit = mode === 'stories' ? 'ep' : mode === 'comics' ? 'comic' : kind === 'articles' ? 'article' : 'post';
		var span = function (ys) { var a = Math.min.apply(null, ys), b = Math.max.apply(null, ys); return a === b ? App.num(a) : App.num(a) + '–' + App.num(b); };
		var card = function (x) {
			var info = self.INFO[x.key] || {};
			var meta = mode === 'papers' ? (info.kind ? App.t(info.kind) + ' · ' : '') + span(x.ys)
				: (x.outlet && x.outlet !== x.key ? self.nm(x.outlet) + ' · ' : self.COMIC_WHERE[x.key] ? App.t(self.COMIC_WHERE[x.key]) + ' · ' : '') + span(x.ys);
			return '<button type="button" class="pp-card" data-o="' + e(x.key) + '" style="--s:var(--pp-' + self.slot(x.outlet) + ')"' + (info.note ? ' title="' + e(App.t(info.note)) + '"' : '') + '>' +
				'<i class="pp-dot" aria-hidden="true"></i><b>' + e(mode === 'comics' && x.key === 'بص و طل' ? L('رسوم أخرى في «' + x.key + '»', 'More comics on ' + self.nm(x.key)) : self.nm(x.key)) + '</b><span class="pp-n"></span><span class="pp-meta">' + e(meta) + '</span></button>';
		};
		var NONE = {
			papers: [L('خارج الصحف', 'In no paper'), L('ما في المدونة وحدها ومقتطفات كتبه', 'The blog’s own posts and extracts from his books')],
			stories: [L('قصص منفردة', 'Single stories'), L('ليست حلقة في قصة مسلسلة', 'Not an episode of a serial')],
			comics: [L('أخرى', 'Others'), '']
		}[mode];
		var ALL = mode === 'stories' ? L('كل القصص', 'Every story') : mode === 'comics' ? L('كل الكوميكس', 'Every comic') :
			kind === 'articles' ? L('كل المقالات', 'Every column') : L('كل المنشورات', 'Every post');
		var cards = root.querySelector('.pp-cards');
		cards.setAttribute('aria-label', mode === 'stories' ? L('القصة المسلسلة', 'Serial') : mode === 'comics' ? L('الباب', 'Strand') : L('الصحيفة', 'Outlet'));
		cards.className = 'pp-cards pp-' + mode;
		cards.innerHTML = '<button type="button" class="pp-card pp-all" data-o="all"><b>' + e(ALL) + '</b><span class="pp-n"></span></button>' +
			groups.map(card).join('') +
			(none ? '<button type="button" class="pp-card pp-all" data-o="none"><b>' + e(NONE[0]) + '</b><span class="pp-n"></span>' + (NONE[1] ? '<span class="pp-meta">' + e(NONE[1]) + '</span>' : '') + '</button>' : '');
		cards.querySelectorAll('.pp-card').forEach(function (b) {
			var k = b.getAttribute('data-o'), c = n[k] || 0, x = self.count(c, mode === 'stories' && (k === 'all' || k === 'none') ? 'story' : unit);
			b.setAttribute('aria-pressed', String(k === self.filter));
			b.classList.toggle('is-empty', !c);
			b.querySelector('.pp-n').innerHTML = !c ? '<small>' + e(L('لا شيء هنا', 'None here')) + '</small>' : (x.n ? e(x.n) + ' ' : '') + '<small>' + e(x.w) + '</small>';
		});

		/* the summary over the cards, for the kind */
		var say = function (c, k) { var x = self.count(c, k); return (x.n ? '<b>' + e(x.n) + '</b> ' : '') + e(x.w); };
		var inPapers = kindPosts.filter(function (p) { return self.of(p); }), outlets = {};
		inPapers.forEach(function (p) { outlets[self.of(p).outlet] = 1; });
		var ys = (mode === 'comics' ? kindPosts.map(function (p) { return self.year(p); }) : inPapers.map(function (p) { return self.of(p).y; }));
		var from = e(App.num(Math.min.apply(null, ys))) + e(L(' و', ' to ')) + e(App.num(Math.max.apply(null, ys)));
		var sum;
		if (mode === 'papers') sum = say(kindPosts.length, unit) + e(L('، منها ', ', ')) + '<b>' + e(App.num(inPapers.length)) + '</b>' + e(L(' في ', ' in ')) +
			'<b>' + e(App.num(Object.keys(outlets).length)) + '</b>' + e(L(' من الصحف والمواقع والمجلات بين ', ' papers, sites and magazines, from ')) + from +
			e(L('. اختر صحيفة لترى ما نشرته وحده في الأرشيف تحتها.', '. Pick one to see only its pieces in the archive below.'));
		else if (mode === 'stories') sum = say(kindPosts.length, 'story') + e(L('، منها ', ', ')) + say(kindPosts.length - none, 'ep') + e(L(' من ', ' of ')) +
			'<b>' + e(App.num(groups.length)) + '</b>' + e(L(' قصة مسلسلة نشرها في ', ' serials, which ran in ')) +
			e(App.lang === 'en' ? Object.keys(outlets).map(function (o) { return self.nm(o); }).join(', ').replace(/, ([^,]*)$/, ' and $1') : Object.keys(outlets).map(function (o) { return '«' + o + '»'; }).join(' و')) + e(L(' بين ', ' from ')) + from +
			e(L('. اختر قصة لترى حلقاتها وحدها في الأرشيف تحتها.', '. Pick one to see only its episodes in the archive below.'));
		else sum = say(kindPosts.length, 'comic') + e(L(' في ', ' in ')) + '<b>' + e(App.num(groups.length)) + '</b>' + e(L(' من الأبواب والمجلات بين ', ' strands and magazines, from ')) + from +
			e(L('. اختر بابًا لترى رسومه وحدها في الأرشيف تحته.', '. Pick one to see only its comics in the archive below.'));
		root.querySelector('.pp-sum').innerHTML = sum;
		root.querySelector('.pp-chart figcaption').textContent = mode === 'stories' ? L('حلقات قصصه في الصحف في كل عام', 'His story episodes in the papers, year by year') :
			mode === 'comics' ? L('الكوميكس في الصحف في كل عام', 'His comics in the papers, year by year') :
			kind === 'articles' ? L('مقالاته في الصحف في كل عام', 'His columns in the papers, year by year') : L('ما نشره في الصحف في كل عام', 'What he published in the papers, year by year');
		this.chart(posts);
	},

	/* stacked columns, a year each: one segment an outlet, 2px of surface between them, the top rounded; what the card
	   chosen lets through in front, the rest faded; the year's outlets in a tooltip */
	chart: function (posts) {
		var App = window.App, e = App.esc, L = App.L, self = this, outlets = this._outlets;
		var y0 = this._years[0], y1 = this._years[1], years = [], count = {}, max = 0;
		for (var y = y0; y <= y1; y++) years.push(y);
		/* each year and outlet: [outlet, shown, faded] */
		var cell = {};
		posts.forEach(function (p) { var o = self.of(p); if (o) { var c = cell[o.y + '|' + o.outlet] = cell[o.y + '|' + o.outlet] || [0, 0]; c[self.matches(p) ? 0 : 1]++; } });
		years.forEach(function (yr) {
			count[yr] = outlets.map(function (o) { return [o].concat(cell[yr + '|' + o] || [0, 0]); }).filter(function (x) { return x[1] + x[2]; });
			max = Math.max(max, count[yr].reduce(function (s, x) { return s + x[1] + x[2]; }, 0));
		});
		var W = 1000, H = 300, padL = 36, padB = 30, padT = 10, bw = (W - padL) / years.length, colW = Math.min(46, bw * 0.62);
		var step = max > 100 ? 50 : max > 40 ? 20 : max > 10 ? 10 : 2, top = Math.ceil(max / step) * step || step;
		var yScale = function (v) { return (H - padB) - v / top * (H - padB - padT); };
		var rtl = App.lang !== 'en';
		var xOf = function (i) { var k = rtl ? years.length - 1 - i : i; return padL + k * bw + (bw - colW) / 2; };
		var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + e(L('عدد ما نشره في الصحف في كل عام', 'His pieces in the papers per year')) + '">';
		for (var g = 0; g <= top; g += step) svg += '<line class="pp-grid" x1="' + padL + '" x2="' + W + '" y1="' + yScale(g) + '" y2="' + yScale(g) + '"/><text class="pp-ax" x="' + (padL - 8) + '" y="' + (yScale(g) + 4) + '" text-anchor="end">' + e(App.num(g)) + '</text>';
		years.forEach(function (yr, i) {
			var x = xOf(i), acc = 0, segs = [];
			count[yr].forEach(function (s) { if (s[1]) segs.push([s[0], s[1], true]); if (s[2]) segs.push([s[0], s[2], false]); });
			var last = segs.length - 1;
			segs.forEach(function (s, k) {
				var h = s[1] / top * (H - padB - padT), yTop = yScale(acc + s[1]);
				var gap = k < last ? 2 : 0, hh = Math.max(0, h - gap), r = k === last ? Math.min(4, hh / 2) : 0;
				/* a rect with only its top corners rounded */
				var d = 'M' + x + ',' + (yTop + gap + hh) + 'V' + (yTop + gap + r) + (r ? 'Q' + x + ',' + (yTop + gap) + ' ' + (x + r) + ',' + (yTop + gap) : '') +
					'H' + (x + colW - r) + (r ? 'Q' + (x + colW) + ',' + (yTop + gap) + ' ' + (x + colW) + ',' + (yTop + gap + r) : '') + 'V' + (yTop + gap + hh) + 'Z';
				svg += '<path class="pp-seg' + (s[2] ? '' : ' is-off') + '" d="' + d + '" style="fill:var(--pp-' + self.slot(s[0]) + ')"/>';
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
			/* each outlet's count that year (of it, what the card chosen lets through) */
			tip.innerHTML = '<b>' + e(App.num(yr)) + '</b>' + segs.slice().sort(function (a, b) { return b[1] + b[2] - a[1] - a[2]; }).map(function (s) {
				return '<span class="' + (s[1] ? '' : 'is-off') + '"><i style="background:var(--pp-' + self.slot(s[0]) + ')"></i>' + e(self.nm(s[0])) +
					'<em>' + e(s[2] ? App.num(s[1]) + ' / ' + App.num(s[1] + s[2]) : App.num(s[1])) + '</em></span>';
			}).join('');
			tip.hidden = false;
			var box = plot.getBoundingClientRect(), x = ev.clientX - box.left, w = tip.offsetWidth;
			tip.style.left = Math.max(0, Math.min(box.width - w, x - w / 2)) + 'px';
			tip.style.top = Math.max(0, ev.clientY - box.top - tip.offsetHeight - 14) + 'px';
		};
		plot.onmouseleave = function () { tip.hidden = true; };
	}
};
