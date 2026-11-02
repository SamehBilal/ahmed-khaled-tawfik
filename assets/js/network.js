/* network.html — «شبكة العرّاب»: his characters as one web — the author at the centre, his series and novels around him, each
   work's characters around it (AKT.characters), and the ties between them (REL: love, family, friends, foes). Hover or tap a
   name to light its ties; the panel tells who they are and leads to their page. */
window.PAGE = {
	id: 'network',
	title: { ar: 'شبكة العرّاب', en: 'The Godfather’s web' },
	strings: {
		eyebrow: { ar: 'من يعرف من', en: 'Who knows whom' },
		title: { ar: 'شبكة العرّاب', en: 'The Godfather’s web' },
		lead: {
			ar: 'شخصياته كلها في شبكة واحدة: كل سلسلة ورواية حول كاتبها، وأبطالها حولها، وخيوط الحب والقرابة والصداقة والعداوة بينهم. اختر اسمًا لترى خيوطه.',
			en: 'All his characters in one web: each series and novel around their author, its people around it, and the threads of love, family, friendship and enmity between them. Pick a name to see its threads.'
		}
	},
	/* the ties between characters, as the books (and the character pages) tell them: [a, b, kind, label] */
	REL: [
		['refaat', 'maggie', 'love', { ar: 'حبه الكبير', en: 'the love of his life' }],
		['refaat', 'huwaida', 'love', { ar: 'خطيبته السابقة', en: 'his former fiancée' }],
		['refaat', 'raeefa', 'family', { ar: 'أخته', en: 'his sister' }],
		['refaat', 'adel', 'friend', { ar: 'صديق طفولته', en: 'his childhood friend' }],
		['refaat', 'lucifer', 'foe', { ar: 'خصمه الأكبر', en: 'his greatest foe' }],
		['refaat', 'salem-salma', 'friend', { ar: 'رفيقا رحلاته بين العوالم', en: 'his fellow travellers between worlds' }],
		['abeer', 'sherif', 'friend', { ar: 'صاحب جهاز الأحلام', en: 'the maker of the dream machine' }],
		['abeer', 'guide', 'friend', { ar: 'مرشدها في فانتازيا', en: 'her guide in Fantasia' }],
		['alaa', 'bernadette', 'love', { ar: 'زوجته', en: 'his wife' }],
		['alaa', 'shelby', 'friend', { ar: 'أستاذه في الأمراض المعدية', en: 'his teacher in infectious disease' }],
		['alaa', 'bartelier', 'friend', { ar: 'رئيس وحدة سافاري', en: 'the head of the Safari unit' }],
		['alaa', 'boudrja', 'friend', { ar: 'مساعده ومترجمه', en: 'his aide and interpreter' }],
		['alaa', 'bassam', 'friend', { ar: 'صديقه المقرب', en: 'his close friend' }],
		['alaa-utopia', 'germinal', 'friend', { ar: 'صديقته', en: 'his girlfriend' }],
		['gaber', 'alaa-utopia', 'foe', { ar: 'يأويه وهو صيده', en: 'shelters the one hunting him' }],
		['gaber', 'safiya', 'family', { ar: 'أخته', en: 'his sister' }],
		['essam', 'afaf', 'friend', { ar: 'يطارد لغز كلمتها الأخيرة', en: 'chases the riddle of her last word' }]
	],
	KIND: { love: '#e0633a', family: '#d9a45a', friend: '#6fb8a8', foe: '#c94a4a', work: 'rgba(239,230,210,.18)' },

	/* the band: after Tommy Ho's «UI Kits: LottieFiles» hero on CodePen — eight of his people as a tilted stack of cards that, as
	   the page scrolls, spreads out around the words in the middle, and then leans a little after the pointer. Each card their
	   own picture where there is one, else a cover of their work (a different issue for each in a series); spread, a card
	   lights its character in the web below */
	TILES: ['refaat', 'alaa', 'maggie', 'abeer', 'lucifer', 'bernadette', 'alaa-utopia', 'essam'],
	/* each card's place, the pen's own: [stacked x, y (vw, vh)], its tilt in the stack, [spread x, y, width (vw), height (vh),
	   scale], and [x, y] on a small screen */
	SPOT: [
		[[-8, -10], -18, [-20, -34, 17, 22, .9], [-22, -40]], [[14, -10], 20, [32, -30, 18, 32, .9], [22, -40]],
		[[-16, 0], -4, [-36, -2, 15, 32, .9], [-22, -19]], [[1, -10], -2, [6, -32, 25, 30, .8], [22, -19]],
		[[18, 1], 6, [37, 6, 18, 32, .8], [-22, 20]], [[-6, 10], 6, [-24, 34, 22, 25, .9], [22, 20]],
		[[8, 7], 3, [2, 36, 20, 26, .8], [-22, 40]], [[20, 12], -7, [30, 34, 16, 20, .7], [22, 40]]
	],
	band: function (d, A) {
		var self = window.PAGE, e = A.esc, L = A.L, S = window.WorksShared, chars = d.characters || [], mine = {}, works = {};
		var cover = function (c) {
			var src = c.image || (d.charFigures || {})[c.id];
			if (src) return src;
			var k = mine[c.work] = (mine[c.work] || 0) + 1;
			var covers = S.anySeries(c.work) ? S.seriesIssues(c.work).map(function (is) { return S.coverOf((d.issueInfo || {})[S.issueKey(c.work, is)] || {}); }).filter(Boolean) : [];
			return covers.length ? covers[(k * 7) % covers.length] : S.coverOf((d.bookInfo || {})[c.work] || {});
		};
		var tiles = self.TILES.map(function (id) { return chars.filter(function (c) { return c.id === id; })[0]; }).filter(Boolean).map(function (c, i) {
			var src = cover(c);
			return '<a class="nwh-tile" href="character.html?id=' + e(c.id) + '" data-id="' + e(c.id) + '" style="z-index:' + (i + 2) + '">' +
				'<span class="nwh-pic">' + (src ? '<img src="' + e(src) + '" alt="" loading="lazy">' : '') + '</span>' +
				'<span class="nwh-tl"><span>' + e(A.t(c.name)) + '</span><span>' + e(A.num(('0' + (i + 1)).slice(-2))) + '</span></span></a>';
		}).join('');
		chars.forEach(function (c) { works[c.work] = 1; });
		var nw = Object.keys(works).length;
		setTimeout(function () { self.heroWire(A); }, 0);
		return '<div class="nwh-copy"><h2>' + L('أبطاله <span>في</span> شبكة<i>.</i>', 'His people <span>in</span> one web<i>.</i>') + '</h2>' +
			'<p>' + e(L(A.num(chars.length) + ' شخصية من ' + A.num(nw) + ' أعمال، وخيوط الحب والقرابة والصداقة والعداوة بينهم.',
				chars.length + ' characters from ' + nw + ' works, and the threads of love, family, friendship and enmity between them.')) + '</p></div>' +
			'<div class="nwh-cards">' + tiles + '</div>' +
			'<div class="nwh-hint" aria-hidden="true"><span>' + e(L('مرّر', 'Scroll')) + '</span><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></div>';
	},
	/* the pen's frame: how far the band has scrolled sets how far the cards have spread (from 12% of the way to 90%), and,
	   spread, they lean after the pointer, the nearer more */
	heroWire: function (A) {
		var self = this, hero = document.querySelector('.ph[data-ph="network"]'), cardsEl = hero && hero.querySelector('.nwh-cards');
		if (!cardsEl || cardsEl.getAttribute('data-on')) return;
		cardsEl.setAttribute('data-on', '1');
		hero.removeAttribute('aria-hidden'); /* (its cards are links) */
		var copy = hero.querySelector('.nwh-copy'), hint = hero.querySelector('.nwh-hint');
		var START = .12, END = .9, PX = 2.6, PY = 2.2, STACK = .82, clamp = function (v) { return Math.min(1, Math.max(0, v)); };
		var mqS = matchMedia('(pointer: coarse), (max-width: 640px)'), mqR = matchMedia('(prefers-reduced-motion: reduce)');
		var els = [].slice.call(cardsEl.querySelectorAll('.nwh-tile')), N = els.length;
		var tiles = els.map(function (el, i) { var s = self.SPOT[i]; return { el: el, so: s[0], sr: s[1], t: s[2], sm: s[3], depth: .55 + (N > 1 ? i / (N - 1) : 0) * .75 }; });
		var px = 0, py = 0, tx = 0, ty = 0, spread = false, key = '', raf = 0, live = true;
		var layout = function () { tiles.forEach(function (t) { t.el.style.width = (mqS.matches ? 40 : t.t[2]) + 'vw'; t.el.style.height = (mqS.matches ? 20 : t.t[3]) + 'vh'; }); key = ''; };
		var frame = function () {
			raf = 0;
			if (!document.body.contains(cardsEl)) return;
			var small = mqS.matches, reduce = mqR.matches, r = hero.getBoundingClientRect();
			var p = clamp((clamp(-r.top / Math.max(1, r.height - innerHeight)) - START) / (END - START));
			if (p >= .999) spread = true; else if (p <= .985) spread = false;
			var par = !reduce && !small, gx = par && spread ? tx : 0, gy = par && spread ? ty : 0;
			px += (gx - px) * .1; py += (gy - py) * .1;
			var k = [p.toFixed(4), px.toFixed(3), py.toFixed(3), small, reduce].join();
			if (k !== key) {
				key = k;
				tiles.forEach(function (t) {
					var ex = small ? Math.sign(t.sm[0]) * 22 : t.t[0], ey = small ? t.sm[1] : t.t[1];
					var x = t.so[0] + (ex - t.so[0]) * p, y = t.so[1] + (ey - t.so[1]) * p, dp = par ? t.depth * p : 0;
					var rot = reduce ? 0 : (1 - p) * t.sr, rest = small ? .72 : t.t[4], sc = STACK + (rest - STACK) * p;
					t.el.style.transform = 'translate(calc(-50% + ' + (x - px * PX * dp) + 'vw), calc(-50% + ' + (y - py * PY * dp) + 'vh)) rotate(' + rot + 'deg) scale(' + sc + ')';
				});
				copy.style.opacity = clamp((p - .3) / .35);
				copy.style.transform = reduce ? 'none' : 'scale(' + (.85 + .15 * clamp((p - .3) / .6)) + ')';
				hint.style.opacity = 1 - clamp(p / START);
				cardsEl.classList.toggle('live', spread);
			}
			/* (again while the lean is still easing in) */
			if (live && (Math.abs(gx - px) > .001 || Math.abs(gy - py) > .001)) go();
		};
		var go = function () { if (!raf) raf = requestAnimationFrame(frame); };
		addEventListener('scroll', go, { passive: true });
		addEventListener('resize', function () { layout(); go(); });
		addEventListener('pointermove', function (ev) { tx = ev.clientX / innerWidth * 2 - 1; ty = ev.clientY / innerHeight * 2 - 1; if (spread) go(); }, { passive: true });
		document.addEventListener('pointerleave', function () { tx = ty = 0; go(); });
		if (mqS.addEventListener) { mqS.addEventListener('change', function () { layout(); go(); }); mqR.addEventListener('change', function () { key = ''; go(); }); }
		if (window.IntersectionObserver) new IntersectionObserver(function (es) { live = es[0].isIntersecting; go(); }).observe(hero);
		/* a card lights its character in the web below, and goes there (their page is a click away from it) */
		cardsEl.addEventListener('click', function (ev) {
			var a = ev.target.closest('.nwh-tile'), n = a && document.querySelector('.nw-node[data-id="' + a.getAttribute('data-id') + '"]');
			if (!n || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
			ev.preventDefault();
			n.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			var to = document.querySelector('.nw-stage');
			if (to) to.scrollIntoView({ behavior: mqR.matches ? 'auto' : 'smooth', block: 'center' });
		});
		layout();
		go();
	},

	/* the works the characters belong to, in the order they came */
	works: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, seen = {}, out = [];
		(d.characters || []).forEach(function (c) {
			if (seen[c.work]) return;
			seen[c.work] = 1;
			var s = S.anySeries(c.work), w = App.findWork ? App.findWork(c.work) : null;
			out.push({ id: c.work, title: s ? s.s.title : w ? w.title : { ar: c.work, en: c.work }, color: s ? s.s.color : (w && w.color) || '#7a4e1d', href: s ? S.seriesHref(c.work) : S.bookHref(c.work) });
		});
		return out;
	},

	render: function () {
		var App = window.App, d = App.data(), e = App.esc, t = App.t, L = App.L, self = this;
		var W = this.works(), chars = d.characters || [], C = 500, R1 = 230, R2 = 420, pos = {};
		/* the works on an inner ring, each given a slice as wide as its cast; its characters fanned through the slice on
		   three staggered rings, so a crowded series still has room for every name */
		var share = W.map(function (w) { return Math.max(1.6, chars.filter(function (c) { return c.work === w.id; }).length); });
		var total = share.reduce(function (s, x) { return s + x; }, 0), at = -Math.PI / 2 - share[0] / total * Math.PI;
		W.forEach(function (w, i) {
			var slice = 2 * Math.PI * share[i] / total, a = at + slice / 2;
			at += slice;
			pos['w:' + w.id] = [C + R1 * Math.cos(a), C + R1 * Math.sin(a)];
			var mine = chars.filter(function (c) { return c.work === w.id; });
			mine.forEach(function (c, k) {
				var b = a + (mine.length > 1 ? (k / (mine.length - 1) - 0.5) * slice * 0.8 : 0), r = R2 - (k % 3) * 52;
				pos[c.id] = [C + r * Math.cos(b), C + r * Math.sin(b)];
			});
		});
		var line = function (p, q, cls, col, data) { return '<line class="' + cls + '" x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) + '" x2="' + q[0].toFixed(1) + '" y2="' + q[1].toFixed(1) + '" stroke="' + col + '"' + (data || '') + '/>'; };
		var svg = '<svg class="nw-map" viewBox="0 0 1000 1000" role="img" aria-label="' + e(L('شبكة شخصياته', 'The web of his characters')) + '">';
		W.forEach(function (w) { svg += line([C, C], pos['w:' + w.id], 'nw-l-work', self.KIND.work); });
		chars.forEach(function (c) { svg += line(pos['w:' + c.work], pos[c.id], 'nw-l-work', self.KIND.work, ' data-a="' + e(c.id) + '"'); });
		this.REL.forEach(function (r) { if (pos[r[0]] && pos[r[1]]) svg += line(pos[r[0]], pos[r[1]], 'nw-l-rel nw-' + r[2], self.KIND[r[2]], ' data-a="' + e(r[0]) + '" data-b="' + e(r[1]) + '"'); });
		svg += '<g class="nw-me"><circle cx="' + C + '" cy="' + C + '" r="62"/><text x="' + C + '" y="' + (C - 6) + '">' + e(L('أحمد خالد', 'Ahmed Khaled')) + '</text><text x="' + C + '" y="' + (C + 22) + '">' + e(L('توفيق', 'Tawfik')) + '</text></g>';
		W.forEach(function (w) {
			var p = pos['w:' + w.id];
			svg += '<a href="' + e(w.href) + '" class="nw-work"><circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="44" fill="' + e(w.color) + '"/><text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 6).toFixed(1) + '">' + e(t(w.title)) + '</text></a>';
		});
		chars.forEach(function (c) {
			var p = pos[c.id];
			svg += '<g class="nw-node" tabindex="0" data-id="' + e(c.id) + '"><circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="9"/><text x="' + p[0].toFixed(1) + '" y="' + (p[1] - 16).toFixed(1) + '">' + e(t(c.name).replace(/^د\.\s*/, '').replace(/^المهندس\s+/, '')) + '</text></g>';
		});
		svg += '</svg>';
		document.getElementById('content').innerHTML = '<section class="section nw"><div class="wrap nw-wrap"><div class="nw-stage">' + svg + '</div>' +
			'<aside class="nw-panel" aria-live="polite"></aside></div>' +
			'<div class="wrap nw-legend">' + [['love', L('حب وزواج', 'Love')], ['family', L('قرابة', 'Family')], ['friend', L('صحبة', 'Friends and allies')], ['foe', L('عداوة وصراع', 'Foes')]].map(function (k) {
				return '<span><i style="background:' + self.KIND[k[0]] + '"></i>' + e(k[1]) + '</span>';
			}).join('') + '</div></section>';
		var stage = document.querySelector('.nw-stage'), panel = document.querySelector('.nw-panel');
		var show = function (id) {
			stage.classList.toggle('is-focus', !!id);
			stage.querySelectorAll('.nw-node').forEach(function (n) { n.classList.toggle('is-on', n.getAttribute('data-id') === id); });
			var linked = {};
			stage.querySelectorAll('.nw-l-rel').forEach(function (l) {
				var on = l.getAttribute('data-a') === id || l.getAttribute('data-b') === id;
				l.classList.toggle('is-on', on);
				if (on) { linked[l.getAttribute('data-a')] = 1; linked[l.getAttribute('data-b')] = 1; }
			});
			stage.querySelectorAll('.nw-node').forEach(function (n) { n.classList.toggle('is-linked', !!linked[n.getAttribute('data-id')]); });
			if (!id) { panel.innerHTML = '<p class="nw-hint">' + e(L('اختر اسمًا في الشبكة.', 'Pick a name in the web.')) + '</p>'; return; }
			var c = chars.filter(function (x) { return x.id === id; })[0], w = W.filter(function (x) { return x.id === c.work; })[0];
			var ties = self.REL.filter(function (r) { return r[0] === id || r[1] === id; }).map(function (r) {
				var o = chars.filter(function (x) { return x.id === (r[0] === id ? r[1] : r[0]); })[0];
				return '<li><i style="background:' + self.KIND[r[2]] + '"></i><b>' + e(t(o.name)) + '</b>' + (r[0] === id ? ' — ' + e(t(r[3])) : '') + '</li>';
			}).join('');
			panel.innerHTML = '<p class="nw-work-name"><a href="' + e(w.href) + '">' + e(t(w.title)) + '</a></p><h2>' + e(t(c.name)) + '</h2>' +
				(c.role ? '<p class="nw-role">' + e(t(c.role)) + '</p>' : '') + '<p>' + e(t(c.desc)) + '</p>' +
				(ties ? '<ul class="nw-ties">' + ties + '</ul>' : '') +
				'<a class="share-btn" href="character.html?id=' + e(c.id) + '">' + e(L('صفحة الشخصية ←', 'Character page →')) + '</a>';
		};
		stage.addEventListener('mouseover', function (ev) { var n = ev.target.closest('.nw-node'); if (n) show(n.getAttribute('data-id')); });
		stage.addEventListener('click', function (ev) { var n = ev.target.closest('.nw-node'); if (n) show(n.getAttribute('data-id')); });
		stage.addEventListener('focusin', function (ev) { var n = ev.target.closest('.nw-node'); if (n) show(n.getAttribute('data-id')); });
		show('refaat');
	}
};
