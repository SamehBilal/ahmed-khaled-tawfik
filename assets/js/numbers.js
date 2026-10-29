/* numbers.html — «بالأرقام»: his work counted from the site's own data. The headline numbers as tiles; then the series'
   spans on one timeline, Ma Wara' al-Tabi'a's issues year by year (every one of its first editions is dated), his books
   year by year by kind, his pieces in the papers year by year (the blog archive), and the publishers by how many of his
   books each put out. Years the data does not hold well (the other series' issues) are not charted. */
window.PAGE = {
	id: 'numbers',
	title: { ar: 'بالأرقام', en: 'In numbers' },
	strings: {
		eyebrow: { ar: 'مسيرة في أرقام', en: 'A career in figures' },
		title: { ar: 'بالأرقام', en: 'In numbers' },
		lead: {
			ar: 'ربع قرن من الكتابة كما يحصيها هذا الموقع: الأعداد والكتب والمقالات والشخصيات ودور النشر، ومتى صدر كل منها.',
			en: 'A quarter-century of writing as this site counts it: issues, books, articles, characters and publishers, and when each came out.'
		}
	},

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, e = App.esc, t = App.t, L = App.L, self = this;
		var own = S.ownSeries(), other = S.contributedSeries();
		/* counted as the home page counts them: the series of the main list (his own, and World Pocket Novels, which he carried on) */
		var main = d.series || [], beyond = other.filter(function (s) { return !App.byId(main, s.id); });
		var issues = main.reduce(function (n, s) { return n + S.seriesIssues(s.id).filter(function (is) { return !(is.part > 1); }).length; }, 0);
		var works = d.works || [], posts = ((d.blog || {}).posts) || [];
		var printed = posts.filter(function (p) { return p.src && !/^من كتاب/.test(p.src) && /(19|20)\d\d/.test(p.src); });
		var people = window.People ? window.People.all().length : 0;
		var houses = S.publishers().filter(function (c) { return c.list.length; }).length;
		/* label: [Arabic after 11 and up, Arabic for 3 to 10, English] */
		var tile = function (n, label, href) {
			return '<a class="nm-tile" href="' + href + '"><b>' + e(App.num(n)) + '</b><span>' + e(L(n >= 3 && n <= 10 ? label[1] : label[0], label[2])) + '</span></a>';
		};
		var seriesIds = own.concat(other).filter(function (s) { return /\d{4}/.test(String(s.years || '')); });

		document.getElementById('content').innerHTML =
			'<section class="section nm"><div class="wrap">' +
				'<div class="nm-tiles">' +
					tile(issues, ['عددًا في السلاسل', 'أعداد في السلاسل', 'series issues'], 'works.html') +
					tile(main.length, ['سلسلة', 'سلاسل', 'series'], 'works.html') +
					tile(beyond.length, ['سلسلة شارك فيها', 'سلاسل أخرى شارك فيها', 'more series he wrote for'], 'works.html') +
					tile(works.length, ['كتابًا مستقلًا', 'كتب مستقلة', 'standalone books'], 'works.html') +
					tile(printed.length, ['مقالًا وقصة في الصحف', 'مقالات في الصحف', 'pieces in the papers'], 'papers.html') +
					tile(posts.length, ['منشورًا في المدونة', 'منشورات في المدونة', 'posts on the blog'], 'blog.html') +
					tile((d.characters || []).length, ['شخصية', 'شخصيات', 'characters'], 'characters.html') +
					tile((d.quotes || []).length, ['اقتباسًا', 'اقتباسات', 'quotes'], 'quotes.html') +
					tile(people, ['كاتبًا حوله', 'كُتّاب حوله', 'writers around him'], 'writers.html') +
					tile(houses, ['دار نشر', 'دور نشر', 'publishers'], 'publishers.html') +
				'</div>' +
				'<figure class="nm-chart" id="nm-span"><figcaption>' + e(L('مسيرة السلاسل', 'The series, year by year')) + '</figcaption><div class="nm-plot"></div></figure>' +
				'<figure class="nm-chart" id="nm-mwt"><figcaption>' + e(L('أعداد «ما وراء الطبيعة» في كل عام', 'Ma Wara’ al-Tabi’a issues each year')) + '</figcaption><div class="nm-plot"></div><div class="nm-tip" hidden></div></figure>' +
				'<figure class="nm-chart" id="nm-books"><figcaption>' + e(L('كتبه المستقلة في كل عام، بأنواعها', 'His standalone books each year, by kind')) + '<small class="nm-note">' + e(L('ما بعد 2018 كتب جُمعت ونُشرت بعد رحيله.', 'The books after 2018 were collected and published after his death.')) + '</small></figcaption><div class="nm-legend"></div><div class="nm-plot"></div><div class="nm-tip" hidden></div></figure>' +
				'<figure class="nm-chart" id="nm-papers"><figcaption>' + e(L('مقالاته في الصحف في كل عام', 'His pieces in the papers each year')) + ' <a href="papers.html">' + e(L('في الصحف ←', 'In the papers →')) + '</a></figcaption><div class="nm-plot"></div><div class="nm-tip" hidden></div></figure>' +
				'<figure class="nm-chart" id="nm-houses"><figcaption>' + e(L('دور النشر، بعدد كتبه عن كل منها', 'Publishers, by how many of his books each put out')) + '</figcaption><div class="nm-plot"></div></figure>' +
			'</div></section>';

		/* the series' spans */
		this.spans(seriesIds);
		/* Ma Wara' al-Tabi'a, by the year of each issue's first edition */
		var mwt = {};
		S.seriesIssues('mwt').filter(function (is) { return !(is.part > 1); }).forEach(function (is) {
			var eds = ((d.issueInfo || {})[S.issueKey('mwt', is)] || {}).editions || [];
			var y = +is.year || Math.min.apply(null, eds.filter(function (ed) { return /الحديثة/.test((ed.publisher || {}).ar || '') && ed.year; }).map(function (ed) { return +ed.year; }).concat([9999]));
			if (y && y < 9999) (mwt[y] = mwt[y] || []).push(is);
		});
		this.columns('nm-mwt', mwt, [{ key: 'all', name: L('عدد', 'issue'), slot: 2 }], function (list) { return { all: list.length }; },
			function (y, list) { return list.map(function (is) { return '#' + App.num(is.n) + ' ' + t(is.title); }).slice(0, 8).join('<br>') + (list.length > 8 ? '<br>…' : ''); });
		/* his books by kind */
		var KINDS = [['novel', L('رواية', 'Novel')], ['stories', L('قصص', 'Stories')], ['articles', L('مقالات', 'Essays')], ['collab', L('عمل مشترك', 'Collaboration')],
			['translation', L('ترجمة', 'Translation')], ['other', L('أخرى', 'Other')]];
		var books = {};
		works.forEach(function (w) { var y = +((String(w.year || '').match(/\d{4}/) || [])[0] || 0); if (y) (books[y] = books[y] || []).push(w); });
		this.columns('nm-books', books, KINDS.map(function (k, i) { return { key: k[0], name: k[1], slot: i === 5 ? 0 : i + 1 }; }), function (list) {
			var c = {}; list.forEach(function (w) { var k = KINDS.some(function (x) { return x[0] === w.type; }) ? w.type : 'other'; c[k] = (c[k] || 0) + 1; }); return c;
		}, function (y, list) { return list.map(function (w) { return t(w.title); }).slice(0, 8).join('<br>'); });
		/* the papers */
		var py = {};
		printed.forEach(function (p) { var y = +p.src.match(/(19|20)\d\d/)[0]; (py[y] = py[y] || []).push(p); });
		this.columns('nm-papers', py, [{ key: 'all', name: L('مقال', 'piece'), slot: 1 }], function (list) { return { all: list.length }; }, null);
		/* the publishers */
		this.hbars('nm-houses', S.publishers().filter(function (c) { return c.list.length; }).sort(function (a, b) { return b.list.length - a.list.length; })
			.map(function (c) { return { name: t(c.p.name), n: c.list.length, href: S.publisherHref(c.p.id) }; }));
	},

	/* each series as a bar from its first year to its last, in its own colour and named on the bar */
	spans: function (list) {
		var App = window.App, e = App.esc, t = App.t, S = window.WorksShared, L = App.L;
		var rows = list.map(function (s) {
			var ys = String(s.years).match(/\d{4}/g).map(Number);
			return { s: s, a: ys[0], b: ys[ys.length - 1], n: S.seriesIssues(s.id).filter(function (is) { return !(is.part > 1); }).length };
		}).sort(function (x, y) { return x.a - y.a || y.n - x.n; });
		var a0 = Math.min.apply(null, rows.map(function (r) { return r.a; })), b0 = Math.max.apply(null, rows.map(function (r) { return r.b; }));
		var W = 1000, rowH = 34, padL = 10, padR = 10, H = rows.length * rowH + 34, rtl = App.lang !== 'en';
		var x = function (y) { var f = (y - a0) / (b0 + 1 - a0); return rtl ? W - padR - f * (W - padL - padR) : padL + f * (W - padL - padR); };
		var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + e(L('سنوات كل سلسلة', 'Each series’ years')) + '">';
		for (var y = a0; y <= b0 + 1; y += (b0 - a0 > 16 ? 5 : 2)) {
			svg += '<line class="nm-grid" x1="' + x(y) + '" x2="' + x(y) + '" y1="0" y2="' + (H - 24) + '"/><text class="nm-ax" x="' + x(y) + '" y="' + (H - 6) + '" text-anchor="middle">' + e(App.num(y)) + '</text>';
		}
		rows.forEach(function (r, i) {
			var x1 = x(r.a), x2 = x(r.b + 1), left = Math.min(x1, x2), w = Math.abs(x2 - x1), yy = i * rowH + 6;
			/* (a span of years in words in Arabic: a dash between numbers turns around inside a right-to-left line) */
			var label = t(r.s.title) + ' · ' + (r.b > r.a ? L('من ' + App.num(r.a) + ' إلى ' + App.num(r.b), App.num(r.a) + '–' + App.num(r.b)) : App.num(r.a)) + ' · ' + (r.n === 1 ? L('عدد واحد', '1 issue') : r.n === 2 ? L('عددان', '2 issues') : App.num(r.n) + ' ' + L(r.n > 10 ? 'عددًا' : 'أعداد', 'issues'));
			var fits = label.length * 7.4 + 20 < w;
			svg += '<a href="' + e(S.seriesHref(r.s.id)) + '"><rect class="nm-span" x="' + left + '" y="' + yy + '" width="' + Math.max(w, 6) + '" height="' + (rowH - 10) + '" rx="4" style="fill:' + e(r.s.color || '#6e1c1c') + '"/>' +
				/* a name too long for its bar goes just past the bar's far end, in the page's ink */
				'<text class="nm-span-t' + (fits ? '' : ' is-out') + '" x="' + (fits ? (rtl ? left + w - 10 : left + 10) : (rtl ? left - 8 : left + w + 8)) + '" y="' + (yy + (rowH - 10) / 2 + 5) + '" direction="' + (rtl ? 'rtl' : 'ltr') + '" text-anchor="start">' + e(label) + '</text></a>';
		});
		document.querySelector('#nm-span .nm-plot').innerHTML = svg + '</svg>';
	},

	/* columns by year, stacked by series (keys), 2px of surface between segments, the top rounded, a tooltip per year */
	columns: function (id, byYear, keys, split, detail) {
		var App = window.App, e = App.esc, L = App.L;
		var years = Object.keys(byYear).map(Number);
		if (!years.length) return;
		var y0 = Math.min.apply(null, years), y1 = Math.max.apply(null, years), all = [];
		for (var y = y0; y <= y1; y++) all.push(y);
		var counts = {}, max = 0;
		all.forEach(function (yr) { var c = byYear[yr] ? split(byYear[yr]) : {}; counts[yr] = c; max = Math.max(max, keys.reduce(function (n, k) { return n + (c[k.key] || 0); }, 0)); });
		var W = 1000, H = 260, padL = 34, padB = 28, padT = 8, bw = (W - padL) / all.length, colW = Math.min(40, bw * 0.64);
		var step = max > 60 ? 20 : max > 20 ? 10 : max > 8 ? 5 : 2, top = Math.ceil(max / step) * step || step;
		var Y = function (v) { return (H - padB) - v / top * (H - padB - padT); }, rtl = App.lang !== 'en';
		var col = function (i) { return padL + (rtl ? all.length - 1 - i : i) * bw; };
		var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img">';
		for (var g = 0; g <= top; g += step) svg += '<line class="nm-grid" x1="' + padL + '" x2="' + W + '" y1="' + Y(g) + '" y2="' + Y(g) + '"/><text class="nm-ax" x="' + (padL - 8) + '" y="' + (Y(g) + 4) + '" text-anchor="end">' + e(App.num(g)) + '</text>';
		var every = all.length > 20 ? 2 : 1;
		all.forEach(function (yr, i) {
			var x = col(i) + (bw - colW) / 2, acc = 0, segs = keys.filter(function (k) { return counts[yr][k.key]; }), last = segs.length - 1;
			segs.forEach(function (k, j) {
				var v = counts[yr][k.key], h = v / top * (H - padB - padT), yt = Y(acc + v), gap = j < last ? 2 : 0, hh = Math.max(0, h - gap), r = j === last ? Math.min(4, hh / 2) : 0;
				svg += '<path d="M' + x + ',' + (yt + gap + hh) + 'V' + (yt + gap + r) + (r ? 'Q' + x + ',' + (yt + gap) + ' ' + (x + r) + ',' + (yt + gap) : '') + 'H' + (x + colW - r) +
					(r ? 'Q' + (x + colW) + ',' + (yt + gap) + ' ' + (x + colW) + ',' + (yt + gap + r) : '') + 'V' + (yt + gap + hh) + 'Z" style="fill:var(--pp-' + k.slot + ')"/>';
				acc += v;
			});
			svg += '<rect class="nm-hit" x="' + col(i) + '" y="' + padT + '" width="' + bw + '" height="' + (H - padB - padT) + '" data-y="' + yr + '"/>';
			if (i % every === 0 || i === all.length - 1) svg += '<text class="nm-ax" x="' + (x + colW / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + e(App.num(yr)) + '</text>';
		});
		var fig = document.getElementById(id), plot = fig.querySelector('.nm-plot'), tip = fig.querySelector('.nm-tip'), legend = fig.querySelector('.nm-legend');
		plot.innerHTML = svg + '</svg>';
		if (legend) legend.innerHTML = keys.map(function (k) { return '<span><i style="background:var(--pp-' + k.slot + ')"></i>' + e(k.name) + '</span>'; }).join('');
		plot.onmousemove = function (ev) {
			var hit = ev.target.closest('.nm-hit');
			if (!hit) { tip.hidden = true; return; }
			var yr = +hit.getAttribute('data-y'), c = counts[yr], total = keys.reduce(function (n, k) { return n + (c[k.key] || 0); }, 0);
			tip.innerHTML = '<b>' + e(App.num(yr)) + ' · ' + e(App.num(total)) + '</b>' +
				(keys.length > 1 ? keys.filter(function (k) { return c[k.key]; }).map(function (k) { return '<span><i style="background:var(--pp-' + k.slot + ')"></i>' + e(k.name) + '<em>' + e(App.num(c[k.key])) + '</em></span>'; }).join('') : '') +
				(detail && byYear[yr] ? '<small class="nm-tip-d">' + detail(yr, byYear[yr]) + '</small>' : '');
			tip.hidden = !total;
			var box = plot.getBoundingClientRect(), x = ev.clientX - box.left, w = tip.offsetWidth;
			tip.style.left = Math.max(0, Math.min(box.width - w, x - w / 2)) + 'px';
			tip.style.top = Math.max(0, ev.clientY - box.top - tip.offsetHeight - 14) + 'px';
		};
		plot.onmouseleave = function () { tip.hidden = true; };
	},

	/* horizontal bars, longest first, the count at the bar's end and the name above it */
	hbars: function (id, rows) {
		var App = window.App, e = App.esc, max = Math.max.apply(null, rows.map(function (r) { return r.n; }));
		document.querySelector('#' + id + ' .nm-plot').innerHTML = '<ol class="nm-bars">' + rows.map(function (r) {
			return '<li><a href="' + e(r.href) + '"><span class="nm-bar-n">' + e(r.name) + '</span><span class="nm-bar"><i style="width:' + (r.n / max * 100).toFixed(1) + '%"></i><b>' + e(App.num(r.n)) + '</b></span></a></li>';
		}).join('') + '</ol>';
	}
};
