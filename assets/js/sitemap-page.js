/* sitemap.html — «خريطة الموقع», drawn as G. Norman's CodePen sitemap draws one (codepen.io/g-norman/pen/RwwgmWy): a tall numbered
   tile for each main page, the pages that belong to it in tiles under it, and in lighter tiles the pages made one per series,
   issue, book, character and person with how many there are — counted as sitemap.xml counts them (tools/build-sitemap.js);
   the tiles rise in one after another. Names come from the lists the header and footer are built from (App.UI). */
window.PAGE = {
	id: 'sitemap',
	title: { ar: 'خريطة الموقع', en: 'Site map' },
	strings: {
		eyebrow: { ar: 'خلف الكواليس', en: 'Behind the site' },
		title: { ar: 'خريطة الموقع', en: 'Site map' },
		lead: {
			ar: 'كل صفحات الموقع في مكان واحد: الصفحات الرئيسية، وعالم العرّاب، وما صُنع من البيانات، وصفحات كل سلسلة وكتاب وشخصية.',
			en: 'Every page of the site in one place: the main pages, the Godfather’s world, the pages made from the data, and a page for each series, book and character.'
		}
	},

	/* the band, after Kyungsung Kim's «Interactive ropes background» on CodePen (codepen.io/rudtjd2548/pen/rNrxopK): Verlet
	   ropes hanging from the top, a light at each end. Here each main page hangs from the top as a glowing node, and the pages
	   that belong to it hang from it on ropes of their own, so related pages are tied together; the nodes keep apart from each
	   other, the pointer catches and swings them, the nearest family lights up with its names, and a tap on a node opens it */
	band: function () {
		/* (called on its own by page-hero.js, so through window.PAGE, not this) */
		setTimeout(function () { window.PAGE.ropes(document.querySelector('.sm-ropes')); }, 0);
		return '<canvas class="sm-ropes"></canvas>';
	},

	ropes: function (canvas) {
		if (!canvas || !this.tree) return;
		if (this._stop) this._stop();
		var tree = this.tree, ctx = canvas.getContext('2d'), rtl = window.App.lang !== 'en', dpr = Math.min(2, window.devicePixelRatio || 1);
		var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
		var W, H, dots, sticks, ends, mouse = { x: -1e4, y: -1e4, r: 26 }, active = -1, picked = -1, raf = 0, alive = true;
		var dot = function (x, y, pinned) { var p = { x: x, y: y, ox: x, oy: y, pinned: !!pinned }; dots.push(p); return p; };
		var chain = function (from, n, gap, dx) {
			var prev = from;
			for (var i = 1; i <= n; i++) { var p = dot(from.x + dx * i / n, from.y + gap * i); sticks.push([prev, p, Math.hypot(p.x - prev.x, p.y - prev.y)]); prev = p; }
			return prev;
		};
		var build = function () {
			var r = canvas.getBoundingClientRect();
			W = r.width; H = r.height;
			canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			dots = []; sticks = []; ends = [];
			var n = tree.length, s = H / 340;
			tree.forEach(function (c, i) {
				var x = W * (0.1 + 0.8 * (n > 1 ? i / (n - 1) : 0.5));
				if (rtl) x = W - x;
				var top = chain(dot(x, 0, true), 6, (95 + (i % 3) * 32) * s / 6, 0), fam = { node: top, main: true, c: c, i: i, kids: [] };
				ends.push(fam);
				c.kids.forEach(function (k, j) {
					var spread = (j - (c.kids.length - 1) / 2) * 16;
					var end = chain(top, 4, (62 + (j % 3) * 20) * s / 4, spread);
					var kid = { node: end, main: false, c: k, i: i };
					fam.kids.push(kid); ends.push(kid);
				});
			});
		};
		var step = function () {
			dots.forEach(function (p) {
				if (p.pinned) return;
				var vx = (p.x - p.ox) * 0.97, vy = (p.y - p.oy) * 0.97 + 0.35;
				p.ox = p.x; p.oy = p.y;
				var dx = mouse.x - p.x, dy = mouse.y - p.y, dist = Math.hypot(dx, dy) || 1, f = Math.max((mouse.r - dist) / mouse.r, 0);
				if (f > 0.6) { p.x = mouse.x; p.y = mouse.y; }
				else { p.x += vx + dx / dist * f; p.y += vy + dy / dist * f; }
			});
			/* the nodes keep apart, so a family fans out instead of hanging in one line */
			for (var a = 0; a < ends.length; a++) for (var b = a + 1; b < ends.length; b++) {
				var p = ends[a].node, q = ends[b].node, ddx = q.x - p.x, ddy = q.y - p.y, d = Math.hypot(ddx, ddy) || 0.01, R = 34;
				if (d < R) { var k = (R - d) / d * 0.25; p.x -= ddx * k; p.y -= ddy * k; q.x += ddx * k; q.y += ddy * k; }
			}
			for (var it = 0; it < 10; it++) sticks.forEach(function (st) {
				var p = st[0], q = st[1], dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 0.01, diff = (d - st[2]) / d * 0.3;
				var ox = dx * diff, oy = dy * diff;
				if (!p.pinned) { p.x += ox / 2; p.y += oy / 2; }
				if (!q.pinned) { q.x -= ox / 2; q.y -= oy / 2; }
			});
			dots.forEach(function (p) { if (!p.pinned) { p.x = Math.max(4, Math.min(W - 4, p.x)); p.y = Math.min(H - 6, p.y); } });
		};
		var near = function (x, y, r) {
			var best = null, bd = r;
			ends.forEach(function (e) { var d = Math.hypot(e.node.x - x, e.node.y - y); if (d < bd) { bd = d; best = e; } });
			return best;
		};
		var draw = function () {
			ctx.clearRect(0, 0, W, H);
			var hit = near(mouse.x, mouse.y, 90);
			active = hit ? hit.i : picked;
			ctx.lineWidth = 1;
			sticks.forEach(function (st) { ctx.beginPath(); ctx.moveTo(st[0].x, st[0].y); ctx.lineTo(st[1].x, st[1].y); ctx.strokeStyle = 'rgba(239,230,210,.22)'; ctx.stroke(); });
			ctx.textAlign = 'center'; ctx.direction = rtl ? 'rtl' : 'ltr';
			ends.forEach(function (e) {
				var on = e.i === active, p = e.node, r = e.main ? (on ? 16 : 12) : (on ? 9 : 6);
				var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
				g.addColorStop(0, e.main ? 'rgba(255,236,170,1)' : 'rgba(248,208,64,.95)'); g.addColorStop(.35, e.main ? 'rgba(248,208,64,.8)' : 'rgba(224,99,58,.6)'); g.addColorStop(1, 'rgba(224,99,58,0)');
				ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
				/* the main pages' names always, but on a narrow screen only the family tapped; a name kept inside the band */
				if ((e.main && (W >= 640 || active < 0)) || on) {
					ctx.font = (e.main ? '600 13px' : '400 11px') + ' "Reem Kufi", sans-serif';
					if (W < 640 && e.main && !on) ctx.font = '600 10px "Reem Kufi", sans-serif';
					ctx.fillStyle = e.main ? (on ? '#ffe7a8' : '#efe6d2') : '#c9b48e';
					var half = ctx.measureText(e.c.name).width / 2 + 4;
					ctx.fillText(e.c.name, Math.max(half, Math.min(W - half, p.x)), p.y + (e.main ? 24 : 18));
				}
			});
		};
		var frame = function () { if (!alive || !canvas.isConnected) return stop(); step(); draw(); raf = requestAnimationFrame(frame); };
		var pos = function (ev) { var r = canvas.getBoundingClientRect(), t = ev.touches ? ev.touches[0] : ev; return t ? [t.clientX - r.left, t.clientY - r.top] : [-1e4, -1e4]; };
		var down = null;
		canvas.onpointermove = function (ev) { var p = pos(ev); mouse.x = p[0]; mouse.y = p[1]; };
		canvas.onpointerleave = function () { mouse.x = mouse.y = -1e4; };
		canvas.onpointerdown = function (ev) { down = pos(ev); };
		canvas.onpointerup = function (ev) {
			var p = pos(ev), hit = down && Math.hypot(p[0] - down[0], p[1] - down[1]) < 6 ? near(p[0], p[1], 22) : null;
			down = null;
			/* by touch, the first tap on a family names its pages; a tap on a node of the family already named opens it */
			if (ev.pointerType !== 'mouse') {
				mouse.x = mouse.y = -1e4;
				if (hit && hit.i !== picked) { picked = hit.i; return; }
				if (!hit) { picked = -1; return; }
			}
			if (hit) location.href = hit.c.href;
		};
		var stop = this._stop = function () { alive = false; cancelAnimationFrame(raf); if (ro) ro.disconnect(); };
		var ro = window.ResizeObserver ? new ResizeObserver(function () { build(); if (still) { for (var i = 0; i < 300; i++) step(); draw(); } }) : null;
		build();
		if (ro) ro.observe(canvas);
		if (still) { for (var i = 0; i < 300; i++) step(); draw(); canvas.onpointermove = null; }
		else frame();
		if (document.fonts) document.fonts.load('600 13px "Reem Kufi"').then(function () { if (still) draw(); });
	},

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, e = App.esc, L = App.L, UI = App.UI;
		/* every page the header and footer know, by its address, so a name here is the name there */
		var page = {};
		UI.nav.concat(UI.more, UI.world, UI.legal).forEach(function (n) { if (!page[n.href]) page[n.href] = n; });
		var name = function (href) { return (page[href] || {})[App.lang === 'en' ? 'en' : 'ar'] || href; };
		/* the pages made one per thing, counted as tools/build-sitemap.js counts them for sitemap.xml */
		var own = S.ownSeries(), wrote = S.contributedSeries(), issues = 0, books = 0, seen = {};
		own.concat(wrote).forEach(function (s) { S.seriesIssues(s.id).forEach(function (is, i) { issues++; seen[App.issueHref(s.id, Object.assign({ _idx: i }, is))] = 1; }); });
		/* a book that is also an issue (as «دماغي كده») has one page, counted once */
		(d.works || []).map(function (w) { return App.workHref(w.id); }).concat(S.entryBooks().map(function (x) { return S.entryBookHref(x.w); })).forEach(function (h) { if (!seen[h]) { seen[h] = 1; books++; } });
		var chars = (d.characters || []).filter(function (c) { return App.charHasPage(c.id); }).length;
		/* the tree, as the CodePen sitemap draws it: a tall numbered tile for each main page, under it the pages that belong to
		   it, and in a lighter tile the pages made one per thing, with how many */
		var TREE = [
			['index.html', ['guide.html']],
			['works.html', ['covers.html', 'translations.html', 'world.html', 'screen.html'], [[own.length + wrote.length, L('صفحة سلسلة', 'series pages')], [issues, L('صفحة عدد', 'issue pages')], [books, L('صفحة كتاب', 'book pages')]]],
			['characters.html', ['glossary.html', 'creatures.html', 'refaat-life.html', 'network.html'], [[chars, L('صفحة بطل', 'lead’s pages')]]],
			['writers.html', ['publishers.html', 'library.html'], [[window.People ? window.People.all().length : 0, L('صفحة اسم من دائرته', 'pages of his circle')], [S.publishers().length, L('صفحة دار نشر', 'publisher pages')]]],
			['quotes.html', []],
			['audio.html', []],
			['legacy.html', ['talks.html', 'awards.html', 'tanta.html', 'handwriting.html', 'map.html']],
			['tributes.html', []],
			['blog.html', ['papers.html', 'style.html', 'numbers.html'], [[((d.blog || {}).posts || []).length || (d.stats || {}).posts, L('مقال', 'articles')]]],
			['quiz.html', ['lists.html']],
			['about.html', UI.legal.map(function (n) { return n.href; }).filter(function (h) { return h !== 'about.html'; })]
		];
		/* a page the header or footer gains later and the tree does not place yet still shows, in the last column */
		var placed = {};
		TREE.forEach(function (c) { placed[c[0]] = 1; c[1].forEach(function (h) { placed[h] = 1; }); });
		var rest = Object.keys(page).filter(function (h) { return !placed[h]; });
		if (rest.length) TREE[TREE.length - 1][1] = TREE[TREE.length - 1][1].concat(rest);
		/* the same tree for the band, which is drawn just after the page */
		this.tree = TREE.map(function (c) { return { href: c[0], name: name(c[0]), kids: c[1].map(function (h) { return { href: h, name: name(h) }; }) }; });
		var k = 0, tile = function (cls, href, inner) { return '<a class="sm-item ' + cls + '" href="' + e(href) + '" style="--i:' + (k++) + '">' + inner + '</a>'; };
		var cols = TREE.map(function (c, i) {
			return '<div class="sm-col">' + tile('sm-main', c[0], '<span class="sm-n">' + e(App.num(('0' + (i + 1)).slice(-2))) + '</span><span class="sm-p">' + e(name(c[0])) + '</span>') +
				c[1].map(function (h) { return tile('sm-sub', h, '<span class="sm-p">' + e(name(h)) + '</span>'); }).join('') +
				(c[2] || []).filter(function (x) { return x[0]; }).map(function (x) { return tile('sm-one', c[0], '<span class="sm-p"><b>' + e(App.num(x[0])) + '</b> ' + e(x[1]) + '</span>'); }).join('') + '</div>';
		}).join('');
		var row = function (title, list) {
			return '<h2 class="sm-h">' + e(title) + '</h2><div class="sm-row">' + list.map(function (s) { return tile('sm-one', S.seriesHref(s.id), '<span class="sm-p">' + e(App.t(s.title)) + '</span>'); }).join('') + '</div>';
		};
		document.getElementById('content').innerHTML = '<section class="section sm"><div class="wrap">' +
			'<div class="sm-tree">' + cols + '</div>' +
			row(L('سلاسله', 'His series'), own) + (wrote.length ? row(L('سلاسل كتب فيها', 'Series he wrote for'), wrote) : '') +
			'<p class="sm-xml">' + e(L('ولمحركات البحث: ', 'And for search engines: ')) + '<a href="sitemap.xml" dir="ltr">sitemap.xml</a>' + e(L('، فيها كل هذه العناوين مع أغلفتها.', ', with all these addresses and their covers.')) + '</p></div></section>';
	}
};
