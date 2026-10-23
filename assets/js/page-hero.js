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
			var own = S ? S.ownSeries() : (d.series || []);
			var issues = 0;
			Object.keys(d.issues || {}).forEach(function (k) { issues += (d.issues[k] || []).length; });
			var cards = [
				[issues, L('عددًا في سلاسله', 'series issues')],
				[(d.works || []).length, L('كتابًا مستقلًا', 'standalone books')],
				[own.length, L('سلسلة', 'series')],
				[(d.characters || []).length, L('شخصية', 'characters')],
				[(d.quotes || []).length, L('اقتباسًا', 'quotes')],
				[(d.tributes || []).length, L('شهادة عنه', 'tributes')],
				[(d.sources || []).length, L('مصدرًا', 'sources')]
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

		/* characters: a police lineup against a height chart, each figure holding a name */
		characters: function (d, A) {
			var e = A.esc, t = A.t, list = (d.characters || []).slice(0, 7), chart = '';
			for (var cm = 200; cm >= 140; cm -= 10) chart += '<span><b>' + e(A.num(cm)) + '</b></span>';
			return '<div class="ph-chart">' + chart + '</div><i class="ph-spot"></i>' +
				'<div class="ph-lineup">' + list.map(function (c, i) {
					return '<div class="ph-suspect" style="--s:' + (0.86 + rnd(i, 6) * 0.2).toFixed(2) + '"><i class="head"></i><i class="body"></i>' +
						'<span class="plate"><em>' + e(A.num(i + 1)) + '</em>' + e(clip(t(c.name), 18)) + '</span></div>';
				}).join('') + '</div>';
		},

		/* contact: letters drifting across the night */
		contact: function (d, A) {
			var h = '';
			for (var i = 0; i < 11; i++) {
				h += '<i class="ph-env" style="--y:' + (8 + rnd(i, 7) * 72).toFixed(0) + '%;--s:' + (0.55 + rnd(i, 8) * 0.8).toFixed(2) + ';--t:' + (16 + rnd(i, 9) * 16).toFixed(0) + 's;--d:' + (-rnd(i, 10) * 30).toFixed(1) + 's;--r:' + ((rnd(i, 11) - 0.5) * 30).toFixed(0) + 'deg"><b></b></i>';
			}
			return '<div class="ph-stars"></div>' + h + '<div class="ph-stamp">' + A.esc(A.L('بريد القرّاء', 'Readers\' mail')) + '</div>';
		},

		/* legacy: a row of candles under his wish for his grave */
		legacy: function (d, A) {
			var h = '';
			for (var i = 0; i < 13; i++) h += '<div class="ph-candle" style="--h:' + (46 + rnd(i, 12) * 70).toFixed(0) + 'px;--d:' + (-rnd(i, 13) * 3).toFixed(2) + 's"><i class="flame"></i><i class="wax"></i></div>';
			return '<p class="ph-motto">' + A.tx(((d.bio || {}).motto) || '') + '</p><div class="ph-candles">' + h + '</div><i class="ph-ledge"></i>';
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

		/* publishers: their logos on a wall, each on a white card */
		publishers: function (d, A) {
			var e = A.esc, t = A.t, list = (d.publishers || []).filter(function (p) { return p.logo; });
			if (!list.length) return '';
			var frames = list.map(function (p, i) {
				return '<figure class="ph-frame ph-logo" style="--r:' + ((rnd(i, 21) - 0.5) * 5).toFixed(1) + 'deg"><img src="' + e(p.logo) + '" alt="" loading="lazy" decoding="async">' +
					'<figcaption>' + e(t(p.name)) + '</figcaption></figure>';
			}).join('');
			return '<div class="ph-wall"><div class="track">' + frames + frames + '</div></div>';
		},

		/* authors: the writers around him who have a portrait */
		authors: function (d, A) {
			var e = A.esc, t = A.t, list = window.People ? window.People.all().filter(function (p) { return p.photo; }) : [];
			if (!list.length) return '';
			var frames = list.map(function (p, i) {
				return '<figure class="ph-frame" style="--r:' + ((rnd(i, 22) - 0.5) * 5).toFixed(1) + 'deg"><img src="' + e(p.photo.url) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">' +
					'<figcaption>' + e(t(p.name)) + '</figcaption></figure>';
			}).join('');
			return '<div class="ph-wall"><div class="track">' + frames + frames + '</div></div>';
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
