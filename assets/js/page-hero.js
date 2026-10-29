/* A picture band above the headline of every page that has none of its own (audio, blog, quotes and writers draw their own) (assets/css/page-hero.css).
   Each page puts <section class="ph" data-ph="…"></section> before its .page-hero; the band is drawn from the
   page's own data, in the reader's language, and redrawn when the language changes. Decorative: aria-hidden. */
(function () {
	'use strict';

	/* a steady pseudo-random number per index, so the band looks the same on every visit */
	function rnd(i, salt) { var x = Math.sin((i + 1) * 9301 + (salt || 0) * 49297) * 233280; return x - Math.floor(x); }
	function clip(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trim() + '…' : s; }

	var R = {
		/* about: an investigator's board — index cards with the site's numbers, pinned and joined by a red thread */
		about: function (d, A) {
			var S = window.WorksShared, e = A.esc, L = A.L;
			/* the same counts as the home page: every series' issues (an issue in two parts once), and the main references */
			var series = d.series || [], issues = 0, refs = {};
			series.forEach(function (s) { issues += S ? S.seriesIssues(s.id).filter(function (is) { return !(is.part > 1); }).length : (+s.count || 0); });
			(d.sources || []).concat(d.issuesSources || []).forEach(function (x) { if (x && x.url) refs[x.url] = 1; });
			var cards = [
				[issues, L('عددًا في السلاسل', 'series issues')],
				[(d.works || []).length, L('كتابًا مستقلًا', 'standalone books')],
				[series.length, L('سلسلة', 'series')],
				[(d.characters || []).length, L('شخصية', 'characters')],
				[(d.quotes || []).length, L('اقتباسًا', 'quotes')],
				[(d.tributes || []).length, L('شهادة عنه', 'tributes')],
				[Object.keys(refs).length, L('مرجعًا رئيسيًا', 'main references')]
			];
			var n = cards.length;
			var pins = cards.map(function (c, i) { return [((i + 0.5) / n) * 100, 22 + rnd(i, 3) * 26]; });
			return '<svg class="ph-thread" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="' +
					pins.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '"/></svg>' +
				cards.map(function (c, i) {
					return '<div class="ph-card" style="left:' + pins[i][0].toFixed(1) + '%;top:' + pins[i][1].toFixed(1) + '%;--r:' + ((rnd(i, 1) - 0.5) * 12).toFixed(1) + 'deg;--d:' + (i * -0.7).toFixed(1) + 's">' +
						'<i class="pin"></i><b>' + e(A.num(c[0])) + '</b><span>' + e(c[1]) + '</span></div>';
				}).join('');
		},

		/* characters: a police lineup under a sweeping spotlight, each figure holding a name */
		characters: function (d, A) {
			var e = A.esc, t = A.t, list = (d.characters || []).slice(0, 7);
			/* in the lineup, the three series heroes as cards (after codepen.io/gayane-gasparyan/pen/wvxewXO): a hover tips
			   their series' cover back, lifts their name, and their drawn figure (AKT.charFigures) steps out of the card */
			/* they lean against the lineup wall on a floor that runs away from us (after codepen.io/lynnandtonic/pen/dyGjvLB):
			   Refaat nearest, then Alaa, then Abeer further along, each a little smaller and higher (--i) */
			var S = window.WorksShared, heroes = [['refaat', 'mwt'], ['alaa', 'safari'], ['abeer', 'fantasia']];
			var cards = heroes.map(function (h, i) {
				var c = A.byId(d.characters, h[0]), s = A.byId(d.series, h[1]);
				if (!c || !s || !S) return '';
				var fig = (d.charFigures || {})[c.id];
				return '<a class="ph-hc' + (fig ? ' has-fig' : '') + '" href="' + e(A.charHref(c.id)) + '" tabindex="-1" style="--c:' + e(s.color || '#5a2a22') + ';--i:' + i + '">' +
					/* the cover of the series' first issue */
					'<span class="ph-hc-wrap"><img src="' + e(S.firstIssueCover(s.id) || S.seriesCover(s.id)) + '" alt="" loading="lazy"></span>' +
					'<span class="ph-hc-name">' + e(t(c.name).replace(/^(د\.|Dr\.)\s*/, '')) + '<small>' + e(t(s.title)) + '</small></span>' +
					(fig ? '<img class="ph-hc-fig" src="' + e(fig) + '" alt="" loading="lazy">' : '') + '</a>';
			}).join('');
			return '<i class="ph-spot"></i>' +
				(cards ? '<i class="ph-floor"></i><div class="ph-heroes">' + cards + '</div>' : '<div class="ph-lineup">' + list.map(function (c, i) {
					return '<div class="ph-suspect" style="--s:' + (0.86 + rnd(i, 6) * 0.2).toFixed(2) + '"><i class="head"></i><i class="body"></i>' +
						'<span class="plate"><em>' + e(A.num(i + 1)) + '</em>' + e(clip(t(c.name), 18)) + '</span></div>';
				}).join('') + '</div>');
		},

		/* contact: letters drifting across the night */
		contact: function (d, A) {
			var h = '';
			for (var i = 0; i < 11; i++) {
				h += '<i class="ph-env" style="--y:' + (8 + rnd(i, 7) * 72).toFixed(0) + '%;--s:' + (0.55 + rnd(i, 8) * 0.8).toFixed(2) + ';--t:' + (16 + rnd(i, 9) * 16).toFixed(0) + 's;--d:' + (-rnd(i, 10) * 30).toFixed(1) + 's;--r:' + ((rnd(i, 11) - 0.5) * 30).toFixed(0) + 'deg"><b></b></i>';
			}
			return '<div class="ph-stars"></div>' + h + '<div class="ph-stamp">' + A.esc(A.L('بريد القرّاء', 'Readers\' mail')) + '</div>';
		},

		/* legacy: candles floating under his wish for his grave, as in the Great Hall: each bobs on its own clock, nearer ones
		   larger and brighter, and each flame twirls and throws a warm pool of light around it */
		legacy: function (d, A) {
			var h = '';
			for (var i = 0; i < 18; i++) {
				var z = 0.5 + rnd(i, 21) * 0.6;
				h += '<i class="fc" style="--x:' + ((i + 0.2 + rnd(i, 22) * 0.6) / 18 * 100).toFixed(1) + '%;--y:' + (30 + rnd(i, 23) * 40).toFixed(0) + '%;--z:' + z.toFixed(2) +
					';--h:' + (50 + rnd(i, 24) * 60).toFixed(0) + 'px;--d:-' + (rnd(i, 25) * 15).toFixed(1) + 's;--f:-' + (rnd(i, 26) * 6).toFixed(1) + 's"><b class="halo"></b><b class="flame"></b><b class="wax"></b></i>';
			}
			return '<p class="ph-motto">' + A.tx(((d.bio || {}).motto) || '') + '</p><div class="ph-floating">' + h + '</div>';
		},

		/* privacy: a padlock with a glowing keyhole */
		privacy: function () {
			return '<i class="ph-ring r1"></i><i class="ph-ring r2"></i><i class="ph-ring r3"></i>' +
				'<svg class="ph-lock" viewBox="0 0 120 150"><path class="shackle" d="M30 66V44a30 30 0 0 1 60 0v22" /><rect class="body" x="14" y="62" width="92" height="80" rx="14" />' +
				'<path class="hole" d="M60 88a10 10 0 0 1 6 18l4 18H50l4-18a10 10 0 0 1 6-18z" /></svg>';
		},

		/* sources: a library card catalogue, a drawer for each source */
		sources: function (d, A) {
			var e = A.esc, seen = {}, hosts = [];
			(d.sources || []).forEach(function (s) {
				var h;
				try { h = new URL(s.url).hostname.replace(/^www\./, '').replace(/^(ar|en)\./, ''); } catch (x) { h = clip(s.label, 18); }
				if (h && !seen[h]) { seen[h] = 1; hosts.push(h); }
			});
			var cells = [];
			for (var i = 0; i < 24; i++) cells.push(hosts[i] || '');
			return '<div class="ph-catalog">' + cells.map(function (h, i) {
				return '<div class="ph-drawer" style="--d:' + (rnd(i, 14) * -24).toFixed(1) + 's"><span class="tag">' + e(clip(h, 20)) + '</span><i class="pull"></i></div>';
			}).join('') + '</div>';
		},

		/* terms: a parchment scroll with a wax seal */
		terms: function (d, A) {
			var lines = '';
			for (var i = 0; i < 7; i++) lines += '<i style="--w:' + (60 + rnd(i, 15) * 36).toFixed(0) + '%"></i>';
			return '<div class="ph-scroll"><i class="roll top"></i><div class="sheet"><b>' + A.esc(A.L('الشروط', 'The terms')) + '</b>' + lines + '</div><i class="roll bottom"></i>' +
				'<span class="ph-seal">' + A.esc(A.L('ع', 'G')) + '</span></div>';
		},

		/* lists: four wooden crates under a hanging lamp, one per list, holding the reader's own covers (the newest in front) and
		   the count on a plate; an empty crate has a cover dropping into it, as one is dragged onto a list. The current mode's
		   two crates stand lit, the other two in the shade; redrawn whenever the lists change (lists.js 'akt-lists') */
		lists: function (d, A) {
			var e = A.esc, t = A.t, Ls = window.Lists, S = window.WorksShared;
			if (!Ls || !Ls.state) return '';
			if (!R._listsWired) { R._listsWired = true; document.addEventListener('akt-lists', function () { render(); }); }
			var st = Ls.state(), LI = Ls.LISTS;
			var mode = { toread: 'reader', read: 'reader', own: 'collector', want: 'collector' };
			var drops = S ? ['mwt', 'safari', 'fantasia', 'rwg'].map(function (id) { return S.seriesCover(id); }) : [];
			return '<i class="ph-lamp"></i><div class="ph-crates">' + ['toread', 'read', 'own', 'want'].map(function (k, i) {
				var list = (st.lists || {})[k] || [], few = list.slice(0, 4);
				var covers = few.length ? few.map(function (x, j) {
					var r = ((rnd(j, 30 + i) - 0.5) * 10).toFixed(1);
					return x.img
						? '<img class="ph-cv" src="' + e(x.img) + '" alt="" loading="lazy" style="--j:' + j + ';--r:' + r + 'deg">'
						: '<i class="ph-cv ph-cv-drawn" style="--j:' + j + ';--r:' + r + 'deg;background:' + e(x.color || '#5a2a22') + '"><b>' + e(t(x.title)) + '</b></i>';
				}).reverse().join('')
					: (drops[i] ? '<img class="ph-cv ph-drop" src="' + e(drops[i]) + '" alt="" loading="lazy" style="--d:' + (i * 1.1).toFixed(1) + 's">' : '');
				return '<div class="ph-crate' + (mode[k] === st.mode ? ' on' : '') + (few.length ? '' : ' empty') + '">' +
					'<div class="ph-crate-in">' + covers + '</div>' +
					'<div class="ph-crate-box"><span class="ph-plate"><svg viewBox="0 0 24 24"><path d="' + LI[k].icon + '"/></svg>' +
						'<b>' + e(A.L(LI[k].ar, LI[k].en)) + '</b><em>' + e(A.num(list.length)) + '</em></span></div></div>';
			}).join('') + '</div>';
		},

		/* papers: his papers folded on a desk under a lamp — a masthead each, the most he wrote for first, with his count in it */
		papers: function (d, A) {
			var e = A.esc, P = window.PAGE, posts = ((d.blog || {}).posts) || [];
			var same = (P && P.SAME) || {}, info = (P && P.INFO) || {}, n = {};
			posts.forEach(function (p) {
				if (!p.src || /^من كتاب/.test(p.src)) return;
				var k = p.src.split(' - ')[0].trim(); k = same[k] || k; n[k] = (n[k] || 0) + 1;
			});
			var top = Object.keys(n).sort(function (a, b) { return n[b] - n[a]; }).slice(0, 7);
			return '<i class="ph-desk-light"></i>' + top.map(function (k, i) {
				var name = A.lang === 'en' && info[k] && info[k].en ? info[k].en : k;
				return '<div class="ph-paper" style="--x:' + (3 + i * 12.6).toFixed(1) + '%;--y:' + (24 + rnd(i, 21) * 30).toFixed(1) + '%;--r:' + ((rnd(i, 22) - 0.5) * 16).toFixed(1) + 'deg;--d:' + (-i * 1.3).toFixed(1) + 's">' +
					'<b>' + e(name) + '</b><span class="ph-paper-rule">' + e(A.num(n[k])) + ' ' + e(A.L('مقالًا', 'pieces')) + '</span>' +
					'<i class="ph-paper-cols"></i></div>';
			}).join('');
		},

		/* numbers: a scoreboard, its figures counting up from nought once drawn (all at once when motion is reduced) */
		numbers: function (d, A) {
			/* (the band can be drawn again as the page starts, so each frame finds the figures afresh) */
			var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, t0 = 0, dur = 1800;
			/* (a timer measured against the clock, not animation frames, which a background tab may all but stop) */
			var step = function () {
				var now = Date.now();
				if (!t0) t0 = now;
				var done = true;
				document.querySelectorAll('.ph-count b[data-to]').forEach(function (b, k) {
					var f = still ? 1 : Math.min(1, Math.max(0, (now - t0 - k * 150) / dur));
					b.textContent = A.num(Math.round(+b.getAttribute('data-to') * (1 - Math.pow(1 - f, 3))));
					if (f < 1) done = false;
				});
				if (!done) setTimeout(step, 30); else R._counting = false;
			};
			if (!R._counting) { R._counting = true; setTimeout(step, 30); }
			var e = A.esc, L = A.L, S = window.WorksShared;
			var issues = (d.series || []).reduce(function (s, x) { return s + (S ? S.seriesIssues(x.id).filter(function (is) { return !(is.part > 1); }).length : 0); }, 0);
			var cells = [[issues, L('عددًا', 'issues')], [(d.works || []).length, L('كتابًا', 'books')], [(((d.blog || {}).posts) || []).length, L('منشورًا', 'posts')],
				[(d.characters || []).length, L('شخصية', 'characters')], [(d.quotes || []).length, L('اقتباسًا', 'quotes')]];
			return '<i class="ph-bars">' + [32, 58, 44, 76, 51, 88, 63, 70, 40, 92, 57, 66].map(function (h, i) { return '<i style="--h:' + h + '%;--i:' + i + '"></i>'; }).join('') + '</i>' +
				'<div class="ph-board">' + cells.filter(function (c) { return c[0]; }).map(function (c, i) {
					return '<div class="ph-count"><b data-to="' + c[0] + '">' + e(A.num(0)) + '</b><span>' + e(c[1]) + '</span></div>';
				}).join('') + '</div>';
		},

		/* quiz: a question mark glowing over four answers, the right one lighting in turn */
		quiz: function (d, A) {
			var e = A.esc, L = A.L, marks = '';
			for (var i = 0; i < 14; i++) marks += '<i class="ph-qm" style="--x:' + (rnd(i, 31) * 96).toFixed(1) + '%;--s:' + (18 + rnd(i, 32) * 46).toFixed(0) + 'px;--d:' + (-rnd(i, 33) * 12).toFixed(1) + 's">؟</i>';
			var opts = L(['أ', 'ب', 'ج', 'د'], ['A', 'B', 'C', 'D']);
			return marks + '<div class="ph-quiz"><b class="ph-quiz-q">؟</b><div class="ph-quiz-opts">' + opts.map(function (o, i) {
				return '<span style="--i:' + i + '"><em>' + e(o) + '</em><i></i></span>';
			}).join('') + '</div></div>';
		},

		/* map: a navigator's chart — the lines of latitude and longitude, dashed routes from Tanta to places his books name, a compass */
		map: function (d, A) {
			/* [longitude, latitude]: Tanta, then Romania, the Amazon, Tibet, London, America, Australia, Cameroon, Tunisia, Moscow */
			var home = [31.0, 30.8], spots = [[24.97, 45.9], [-62.2, -3.4], [88, 31.7], [-0.13, 51.5], [-98.6, 39.8], [133.8, -25.3], [12.4, 5.7], [9.5, 34], [37.6, 55.75]];
			var X = function (lon) { return (lon + 180) / 360 * 1000; }, Y = function (lat) { return (75 - lat) / 135 * 340; };
			var hx = X(home[0]), hy = Y(home[1]), grid = '';
			for (var lon = -150; lon <= 180; lon += 30) grid += 'M' + X(lon) + ',0V340';
			for (var lat = -45; lat <= 75; lat += 30) grid += 'M0,' + Y(lat).toFixed(1) + 'H1000';
			var routes = spots.map(function (s, i) {
				var x = X(s[0]), y = Y(s[1]), mx = (hx + x) / 2, my = Math.max(24, Math.min(hy, y) - 18 - Math.abs(x - hx) * 0.07);
				return '<path class="ph-route" d="M' + hx.toFixed(1) + ',' + hy.toFixed(1) + 'Q' + mx.toFixed(1) + ',' + my.toFixed(1) + ' ' + x.toFixed(1) + ',' + y.toFixed(1) + '" style="--d:' + (i * 0.6).toFixed(1) + 's"/>' +
					'<circle class="ph-spot-pin" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" style="--d:' + (i * 0.6 + 1.6).toFixed(1) + 's"/>';
			}).join('');
			return '<svg class="ph-chart" viewBox="0 0 1000 340" preserveAspectRatio="xMidYMin slice"><path class="ph-chart-grid" d="' + grid + '"/>' + routes +
				'<circle class="ph-home" cx="' + hx.toFixed(1) + '" cy="' + hy.toFixed(1) + '" r="7"/></svg>' +
				'<svg class="ph-rose" viewBox="-50 -50 100 100"><circle r="44"/><circle r="30"/><path d="M0 -46L6 0 0 46-6 0Z"/><path class="n" d="M0 -46L6 0H-6Z"/><path d="M-46 0L0 5 46 0 0-5Z" opacity=".55"/></svg>';
		},

		/* publishers: a dark bookshelf that a flashlight finds in colour (page-hero.css .ph-shelf) */
		publishers: function () {
			return '<div class="ph-shelf"></div>';
		},

		/* tributes: a gallery wall of the people who wrote about him */
		tributes: function (d, A) {
			var e = A.esc, t = A.t, list = (d.tributes || []).filter(function (x) { return x.photo; });
			if (!list.length) return '';
			var frames = list.map(function (p, i) {
				return '<figure class="ph-frame" style="--r:' + ((rnd(i, 16) - 0.5) * 5).toFixed(1) + 'deg"><img src="' + e(p.photo) + '" alt="" loading="lazy" decoding="async">' +
					'<figcaption>' + e(t(p.name)) + '</figcaption></figure>';
			}).join('');
			return '<div class="ph-wall"><div class="track">' + frames + frames + '</div></div>';
		}
	};

	function render() {
		var A = window.App;
		if (!A) return;
		var d = A.data();
		[].slice.call(document.querySelectorAll('section.ph[data-ph]')).forEach(function (el) {
			var f = R[el.getAttribute('data-ph')];
			el.setAttribute('aria-hidden', 'true');
			el.innerHTML = f ? '<div class="ph-stage">' + f(d, A) + '</div>' : '';
		});
	}

	/* draw with the page, and again when the language changes */
	var P = window.PAGE;
	if (P && typeof P.render === 'function') {
		var orig = P.render;
		P.render = function () { var r = orig.apply(this, arguments); render(); return r; };
	} else {
		document.addEventListener('DOMContentLoaded', function () { setTimeout(render, 0); });
	}
	window.PageHero = { render: render };
})();
