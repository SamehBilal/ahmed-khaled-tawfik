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
	   ropes hanging close together from the top, a light at each end. Here each main page hangs from the top as a glowing node,
	   and from it hang the pages that belong to it and, smaller, its pages made one per thing (the series under «الأعمال», the
	   leads under «الشخصيات», his circle's people and the publishers under «دائرته»), so related pages are tied together:
	   some hundred and sixty lights; and between the families, the band is filled with faint lights for his issues and books.
	   The pointer catches and swings them, the nearest family lights up with its names, and a tap on a node opens it. The
	   ropes and names take the page's own colours, so the band is one with the page in either theme */
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
		var self = this, W, H, dots, sticks, ends, kin, ink = '', dim = '', tick = 0, mouse = { x: -1e4, y: -1e4, r: 26 }, active = -1, picked = -1, raf = 0, alive = true;
		var dot = function (x, y, pinned) { var p = { x: x, y: y, ox: x, oy: y, pinned: !!pinned }; dots.push(p); return p; };
		var chain = function (from, n, gap, dx) {
			var prev = from;
			/* (a rope hung from another page's light holds on to it without dragging it down: dozens hanging from one light would
			   otherwise stretch its rope to the floor) */
			for (var i = 1; i <= n; i++) { var p = dot(from.x + dx * i / n, from.y + gap * i); sticks.push([prev, p, Math.hypot(p.x - prev.x, p.y - prev.y), i === 1 && !from.pinned]); prev = p; }
			return prev;
		};
		/* the same "random" lengths every time, from each node's place */
		var rnd = function (n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
		var build = function () {
			var r = canvas.getBoundingClientRect();
			W = r.width; H = r.height;
			canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			dots = []; sticks = []; ends = []; kin = [];
			/* first, behind the families, the whole band filled as the pen's is: ropes hanging from all along the top, each
			   ending in an issue or a book of his (this.fill), small and faint until the pointer finds one */
			var fill = self.fill || [], many = Math.min(fill.length, Math.round(W * (W < 640 ? 0.22 : 0.26)));
			for (var k = 0; k < many; k++) {
				var fx = W * (0.02 + 0.96 * (k + rnd(1000 + k)) / many), end = chain(dot(fx, 0, true), 6, H * (0.1 + 0.8 * rnd(2000 + k)) / 6, 0);
				ends.push({ node: end, fill: true, c: fill[Math.floor(k * fill.length / many)], i: -10 - k }); /* (a family of its own) */
			}
			/* the main pages close together in the middle, as the pen's ropes are (wider on a phone, to keep them apart), each
			   given room as its family is large */
			var from = W < 640 ? 0.08 : 0.12, span = 1 - 2 * from;
			var room = tree.map(function (c) { return 1.8 + Math.sqrt(c.kids.length + (c.ones || []).length) * 0.5; }), all = room.reduce(function (a, b) { return a + b; }, 0), at = 0;
			tree.forEach(function (c, i) {
				var x = W * (from + span * (at + room[i] / 2) / all);
				at += room[i];
				if (rtl) x = W - x;
				var top = chain(dot(x, 0, true), 8, H * (0.26 + 0.22 * rnd(i)) / 8, 0), fam = { node: top, main: true, c: c, i: i };
				ends.push(fam); kin.push(fam);
				c.kids.concat(c.ones || []).forEach(function (k, j, all) {
					var one = j >= c.kids.length, long = H * (one ? 0.14 + 0.34 * rnd(i * 31 + j) : 0.12 + 0.18 * rnd(i * 17 + j));
					var end = chain(top, one ? 6 : 5, long / (one ? 6 : 5), (j - (all.length - 1) / 2) * 5);
					var e = { node: end, main: false, one: one, c: k, i: i };
					ends.push(e); kin.push(e);
				});
			});
		};
		var step = function () {
			/* the pointer catches only the one light nearest it; the rest it only tugs at */
			var caught = null, cd = mouse.r * 0.5;
			dots.forEach(function (p) { var d = Math.hypot(mouse.x - p.x, mouse.y - p.y); if (!p.pinned && d < cd) { cd = d; caught = p; } });
			dots.forEach(function (p) {
				if (p.pinned) return;
				var vx = (p.x - p.ox) * 0.97, vy = (p.y - p.oy) * 0.97 + 0.35;
				p.ox = p.x; p.oy = p.y;
				var dx = mouse.x - p.x, dy = mouse.y - p.y, dist = Math.hypot(dx, dy) || 1, f = Math.max((mouse.r - dist) / mouse.r, 0);
				if (p === caught) { p.x = mouse.x; p.y = mouse.y; }
				else { p.x += vx + dx / dist * f * 0.5; p.y += vy + dy / dist * f * 0.5; }
			});
			/* the nodes keep apart, so a family fans out instead of hanging in one line */
			for (var a = 0; a < kin.length; a++) for (var b = a + 1; b < kin.length; b++) {
				var p = kin[a].node, q = kin[b].node, ddx = q.x - p.x, ddy = q.y - p.y, d = Math.hypot(ddx, ddy) || 0.01, R = kin[a].main && kin[b].main ? 30 : 9;
				if (d < R) { var k = (R - d) / d * 0.25; p.x -= ddx * k; p.y -= ddy * k; q.x += ddx * k; q.y += ddy * k; }
			}
			for (var it = 0; it < 10; it++) sticks.forEach(function (st) {
				var p = st[0], q = st[1], dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 0.01, diff = (d - st[2]) / d * 0.3;
				var ox = dx * diff, oy = dy * diff;
				if (st[3]) { q.x -= ox; q.y -= oy; return; }
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
			/* the page's colours, looked at now and then (the theme may change) */
			if (!(tick++ % 30)) { var cs = getComputedStyle(document.documentElement); ink = cs.getPropertyValue('--paper').trim() || '#efe6d2'; dim = cs.getPropertyValue('--paper-dim').trim() || '#b9b1a0'; }
			var hit = near(mouse.x, mouse.y, 90);
			active = hit ? hit.i : picked;
			ctx.lineWidth = 1; ctx.strokeStyle = ink; ctx.globalAlpha = 0.22;
			ctx.beginPath();
			sticks.forEach(function (st) { ctx.moveTo(st[0].x, st[0].y); ctx.lineTo(st[1].x, st[1].y); });
			ctx.stroke(); ctx.globalAlpha = 1;
			ctx.textAlign = 'center'; ctx.direction = rtl ? 'rtl' : 'ltr';
			ends.forEach(function (e) {
				var on = e.i === active, p = e.node, r = e.main ? (on ? 16 : 12) : e.one ? (on ? 6 : 4.5) : (on ? 9 : 6);
				if (e.fill) { r = e === hit ? 6 : 3.5; ctx.globalAlpha = e === hit ? 1 : 0.55; }
				var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
				g.addColorStop(0, e.main ? 'rgba(255,236,170,1)' : 'rgba(248,208,64,.95)'); g.addColorStop(.35, e.main ? 'rgba(248,208,64,.8)' : 'rgba(224,99,58,.6)'); g.addColorStop(1, 'rgba(224,99,58,0)');
				ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
				/* the main pages' names always, but on a narrow screen only the family tapped; a name kept inside the band */
				if ((e.main && (W >= 640 || active < 0)) || (on && !e.one) || e === hit) {
					ctx.font = (e.main ? '600 13px' : '400 11px') + ' "Reem Kufi", sans-serif';
					if (W < 640 && e.main && !on) ctx.font = '600 10px "Reem Kufi", sans-serif';
					ctx.fillStyle = e.main && !on ? ink : on && e.main ? '#e0633a' : dim;
					var half = ctx.measureText(e.c.name).width / 2 + 4;
					ctx.fillText(e.c.name, Math.max(half, Math.min(W - half, p.x)), p.y + (e.main ? 24 : 18));
				}
			});
		};
		var frame = function () { if (!alive || !canvas.isConnected) return stop(); step(); draw(); raf = requestAnimationFrame(frame); };
		var pos = function (ev) { var r = canvas.getBoundingClientRect(), t = ev.touches ? ev.touches[0] : ev; return t ? [t.clientX - r.left, t.clientY - r.top] : [-1e4, -1e4]; };
		var down = null;
		canvas.onpointermove = function (ev) { var p = pos(ev); mouse.x = p[0]; mouse.y = p[1]; };
		var loose = function () { mouse.x = mouse.y = -1e4; };
		canvas.onpointerleave = loose;
		/* (scrolling moves the band from under a still pointer: let go) */
		window.addEventListener('scroll', loose, { passive: true });
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
		var stop = this._stop = function () { alive = false; cancelAnimationFrame(raf); if (ro) ro.disconnect(); window.removeEventListener('scroll', loose); };
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
		UI.nav.concat(UI.more, UI.world, UI.legal, UI.sections).forEach(function (n) { if (!page[n.href]) page[n.href] = n; });
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
			['works.html', ['covers.html', 'translations.html', 'world.html', 'screen.html', 'compare.html'], [[own.length + wrote.length, L('صفحة سلسلة', 'series pages')], [issues, L('صفحة عدد', 'issue pages')], [books, L('صفحة كتاب', 'book pages')]]],
			['characters.html', ['creatures.html', 'refaat-life.html', 'refaat-library.html', 'network.html', 'worlds.html', 'clinic.html', 'names.html'], [[chars, L('صفحة بطل', 'lead’s pages')]]],
			['writers.html', ['publishers.html', 'library.html'], [[window.People ? window.People.all().length : 0, L('صفحة اسم من دائرته', 'pages of his circle')], [S.publishers().length, L('صفحة دار نشر', 'publisher pages')]]],
			['quotes.html', ['quotes.html#glossary']],
			['audio.html', []],
			['legacy.html', ['talks.html', 'interviews.html', 'tanta.html', 'awards.html', 'handwriting.html', 'map.html', 'calendar.html']],
			['tributes.html', ['remembrance.html', 'reader-stories.html']],
			['blog.html', ['blog.html#papers', 'numbers.html'], [[((d.blog || {}).posts || []).length || (d.stats || {}).posts, L('مقال', 'articles')]]],
			['quiz.html', ['lists.html']],
			['about.html', UI.legal.map(function (n) { return n.href; }).filter(function (h) { return h !== 'about.html'; })]
		];
		/* a page the header or footer gains later and the tree does not place yet still shows, in the last column */
		var placed = {};
		TREE.forEach(function (c) { placed[c[0]] = 1; c[1].forEach(function (h) { placed[h] = 1; }); });
		var rest = Object.keys(page).filter(function (h) { return !placed[h]; });
		if (rest.length) TREE[TREE.length - 1][1] = TREE[TREE.length - 1][1].concat(rest);
		/* the same tree for the band, which is drawn just after the page */
		/* with, smaller, the pages made one per thing: each series under the Works, each lead under the Characters, each
		   person of his circle and each publisher under his circle */
		var ONES = {
			'works.html': own.concat(wrote).map(function (s) { return { href: S.seriesHref(s.id), name: App.t(s.title) }; }),
			'characters.html': (d.characters || []).filter(function (c) { return App.charHasPage(c.id); }).map(function (c) { return { href: App.charHref(c.id), name: App.t(c.name) }; }),
			'writers.html': (window.People ? window.People.all() : []).map(function (p) { return { href: 'writer.html?id=' + encodeURIComponent(p.id), name: App.t(p.name) }; })
				.concat(S.publishers().map(function (c) { return { href: S.publisherHref(c.p.id), name: App.t(c.p.name) }; }))
		};
		/* and to fill the band between them, every issue and book of his */
		var fill = [];
		own.concat(wrote).forEach(function (s) { S.seriesIssues(s.id).forEach(function (is, i) { fill.push({ href: App.issueHref(s.id, Object.assign({ _idx: i }, is)), name: App.t(s.title) + (is.n != null ? ' ' + App.num(is.n) : '') + ': ' + App.t(is.title) }); }); });
		(d.works || []).forEach(function (w) { fill.push({ href: App.workHref(w.id), name: App.t(w.title) }); });
		this.fill = fill;
		this.tree = TREE.map(function (c) { return { href: c[0], name: name(c[0]), kids: c[1].map(function (h) { return { href: h, name: name(h) }; }), ones: ONES[c[0]] || [] }; });
		var k = 0, tile = function (cls, href, inner) { return '<a class="sm-item ' + cls + '" href="' + e(href) + '" style="--i:' + (k++) + '">' + inner + '</a>'; };
		var cols = TREE.map(function (c, i) {
			return '<div class="sm-col">' + tile('sm-main', c[0], '<span class="sm-n">' + e(App.num(('0' + (i + 1)).slice(-2))) + '</span><span class="sm-p">' + e(name(c[0])) + '</span>') +
				c[1].map(function (h) { return tile('sm-sub', h, '<span class="sm-p">' + e(name(h)) + '</span>'); }).join('') +
				(c[2] || []).filter(function (x) { return x[0]; }).map(function (x) { return tile('sm-one', c[0], '<span class="sm-p"><b>' + e(App.num(x[0])) + '</b> ' + e(x[1]) + '</span>'); }).join('') + '</div>';
		}).join('');
		var row = function (title, list) {
			return '<h2 class="sm-h">' + e(title) + '</h2><div class="sm-row">' + list.map(function (s) { return tile('sm-one', S.seriesHref(s.id), '<span class="sm-p">' + e(App.t(s.title)) + '</span>'); }).join('') + '</div>';
		};
		/* (beside the side menu of the pages about the site, app.js infoTabs) */
		document.getElementById('content').innerHTML = '<section class="section sm"><div class="wrap info-wrap">' + App.infoTabs('sitemap') + '<div class="info-body">' +
			'<div class="sm-tree">' + cols + '</div>' +
			row(L('سلاسله', 'His series'), own) + (wrote.length ? row(L('سلاسل كتب فيها', 'Series he wrote for'), wrote) : '') +
			'<p class="sm-xml">' + e(L('ولمحركات البحث: ', 'And for search engines: ')) + '<a href="sitemap.xml" dir="ltr">sitemap.xml</a>' + e(L('، فيها كل هذه العناوين مع أغلفتها.', ', with all these addresses and their covers.')) + '</p></div></div></section>';
	}
};
