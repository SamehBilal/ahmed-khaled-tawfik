/* A picture band above the headline of every page that has none of its own (audio, blog, quotes and writers draw their own) (assets/css/page-hero.css).
   Each page puts <section class="ph" data-ph="…"></section> before its .page-hero; the band is drawn from the
   page's own data, in the reader's language, and redrawn when the language changes. Decorative: aria-hidden. */
(function () {
	'use strict';

	/* a steady pseudo-random number per index, so the band looks the same on every visit */
	function rnd(i, salt) { var x = Math.sin((i + 1) * 9301 + (salt || 0) * 49297) * 233280; return x - Math.floor(x); }
	function clip(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trim() + '…' : s; }

	var R = {
		/* about: after Nikolay Talanov's «Cool Layout with Complex Chainable Animation» on CodePen — six panels, one a number of
		   the site's, that rise in one after another, each its own picture; hovering one lifts its number from below, and opening
		   one slides it to the start, spreads it across the band and tells what is behind the number, with the way there.
		   Wired by aboutBand below */
		about: function (d, A) {
			var S = window.WorksShared, e = A.esc, L = A.L;
			/* the same counts as the home page: every series' issues (an issue in two parts once) */
			var series = d.series || [], issues = 0;
			series.forEach(function (s) { issues += S ? S.seriesIssues(s.id).filter(function (is) { return !(is.part > 1); }).length : (+s.count || 0); });
			var utopia = (d.works || []).filter(function (w) { return w.id === 'utopia'; })[0];
			var panels = [
				[issues, L('عددًا في السلاسل', 'series issues'), S ? S.seriesCover('mwt') : '', 'works.html',
					L('كل أعداد سلاسله، من «ما وراء الطبيعة» إلى «سافاري» و«فانتازيا»، عددًا عددًا بأغلفتها.', 'Every issue of his series, from Paranormal to Safari and Fantasia, cover by cover.'), L('الأعمال', 'The works')],
				[(d.works || []).length, L('كتابًا مستقلًا', 'standalone books'), S && utopia ? S.coverOf((d.bookInfo || {}).utopia) : '', 'works.html',
					L('رواياته وكتبه خارج السلاسل، من «يوتوبيا» إلى «شآبيب».', 'His novels and books outside the series, from Utopia to Shaabeeb.'), L('الأعمال', 'The works')],
				[series.length, L('سلسلة', 'series'), S ? S.seriesCover('safari') : '', 'works.html',
					L('سلاسله، ومنها ما كتب فيه مع غيره: «ما وراء الطبيعة» و«فانتازيا» و«سافاري» و«روايات عالمية للجيب» وغيرها.', 'His series, and those he wrote for with others: Paranormal, Fantasia, Safari, World Pocket Novels and the rest.'), L('الأعمال', 'The works')],
				[(d.characters || []).length, L('شخصية', 'characters'), 'assets/img/refaat.jpg', 'characters.html',
					L('أبطاله ومن حولهم: رفعت إسماعيل وعلاء عبد العظيم وعبير، ومن عاشوا معهم.', 'His heroes and those around them: Refaat Ismail, Alaa Abdel Azim, Abeer and the rest.'), L('الشخصيات', 'The characters')],
				[(d.quotes || []).length, L('اقتباسًا', 'quotes'), S ? S.seriesCover('fantasia') : '', 'quotes.html',
					L('جمل من كتبه ومقالاته، كلٌّ بمصدره.', 'Lines from his books and essays, each with its source.'), L('الاقتباسات', 'The quotes')],
				[(d.tributes || []).length, L('شهادة عنه', 'tributes'), 'assets/img/grave.webp', 'tributes.html',
					L('ما كتبه عنه الكتّاب والقرّاء بعد رحيله.', 'What writers and readers wrote of him after he was gone.'), L('قالوا عنه', 'Tributes')]
			];
			setTimeout(aboutBand, 0);
			return '<div class="ab s--inactive" style="--n:' + panels.length + '">' + panels.map(function (p, i) {
				return '<div class="ab-el" style="--i:' + i + '" role="button" tabindex="0" aria-expanded="false" aria-label="' + e(A.num(p[0]) + ' ' + p[1]) + '">' +
					'<div class="ab-overflow"><div class="ab-inner"><div class="ab-bg" style="--img:url(\'' + e(new URL(p[2], document.baseURI).href) + '\')"></div>' + /* (whole, or a url() handed through a variable is read from the stylesheet's folder) */
					'<div class="ab-preview"><h2 class="ab-heading">' + e(p[1]) + '</h2></div>' +
					'<div class="ab-content"><b class="ab-num">' + e(A.num(p[0])) + '</b><p class="ab-text"><span>' + e(p[1]) + '</span>' + e(p[4]) + '</p>' +
					'<a class="ab-go" href="' + p[3] + '" tabindex="-1">' + e(p[5]) + L(' ←', ' →') + '</a><button type="button" class="ab-close" tabindex="-1" aria-label="' + e(L('إغلاق', 'Close')) + '"></button></div>' +
					'</div></div>' +
					'<div class="ab-index" aria-hidden="true"><div class="ab-index-back">' + e(A.num(p[0])) + '</div><div class="ab-index-front"><div class="ab-index-overlay" data-index="' + e(A.num(p[0])) + '">' + e(A.num(p[0])) + '</div></div></div>' +
				'</div>';
			}).join('') + '</div>';
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
				h += '<i class="ph-env" style="--y:' + (8 + rnd(i, 7) * 72).toFixed(0) + '%;--s:' + (0.55 + rnd(i, 8) * 0.8).toFixed(2) + ';--t:' + (16 + rnd(i, 9) * 16).toFixed(0) + 's;--d:' + (-rnd(i, 10) * 30).toFixed(1) + 's;--r:' + ((rnd(i, 11) - 0.5) * 30).toFixed(0) + 'deg"></i>';
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

		/* privacy: after Ghaste's «User Avatar with animated ripped border» on CodePen — the reader's avatar, a faceless black
		   silhouette (the site keeps no account and knows no one) filling an ember circle, its edge torn by a turbulent mask and
		   by three borders in the band's own colour that writhe under SVG turbulence, as the pen's do; the scales are the pen's,
		   in proportion to the circle (the filters' own sizes are in pixels) */
		privacy: function () {
			var sq = function (id, type, freq, to, scale, scales) {
				return '<filter id="' + id + '" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence' + (type ? ' type="' + type + '"' : '') + ' baseFrequency="' + freq + '" numOctaves="5" seed="0">' +
					'<animate attributeName="baseFrequency" dur="40s" values="' + freq + '; ' + to + '; ' + freq + '" repeatCount="indefinite"/></feTurbulence>' +
					'<feDisplacementMap in="SourceGraphic" scale="' + scale + '">' + (scales ? '<animate attributeName="scale" dur="4s" values="' + scales + '" repeatCount="indefinite"/>' : '') +
					'</feDisplacementMap></filter>';
			};
			return '<svg class="ph-sq-defs" aria-hidden="true">' + sq('ph-sq0', '', '0.04', '0.16', 13) + sq('ph-sq1', 'fractalNoise', '.04 .08', '.12 .16', 65) +
				sq('ph-sq2', 'fractalNoise', '.2 .24', '.4 .48', 13, '13;26;33;65;130;43;22;13') + '</svg>' +
				'<div class="ph-avatar"><div class="ph-avatar-in"><svg class="who" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice">' +
				'<path d="M47 9c11-1 20 7 21 19 1 6 0 11-2 15 2 0 3 2 2 5-1 4-3 6-5 6-2 6-6 10-11 12v8c10 3 26 8 33 16 3 4 5 10 6 16H4c1-7 4-13 8-17 8-8 21-11 30-15v-8c-6-3-10-9-11-16-3 0-4-3-4-6 0-2 1-4 3-4-1-4-1-8 0-12 2-10 9-18 17-19z"/>' +
				'</svg><i class="who-rim"></i></div></div>';
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

		/* terms: after Paul Troshkin's «Stretch to reveal» on CodePen (made there with Reactive CSS; here in plain script, wired by
		   termsBand below): five of his covers as instant prints, each scrambled its own way (pixelated, cross-stitched, blurred,
		   crosses, frosted), and a white knob that stretches like goo as it is pulled along the pill; pulled far enough it lets go to
		   the end and the covers come clear: they are their owners', and this site only shows them */
		terms: function (d, A) {
			var S = window.WorksShared, e = A.esc, L = A.L, t = A.t;
			var px = [32, 24, 18, 14, 10, 8, 6, 4].map(function (n) {
				var h = n / 2;
				return '<filter id="tb-px' + n + '" x="0" y="0" width="150%" height="150%" color-interpolation-filters="sRGB"><feOffset dx="' + h + '" dy="' + h + '" result="s"/>' +
					'<feFlood x="' + h + '" y="' + h + '" width="1" height="1"/><feComposite width="' + n + '" height="' + n + '"/><feTile result="d"/>' +
					'<feComposite in="s" in2="d" operator="in"/><feMorphology operator="dilate" radius="' + h + '"/></filter>';
			}).join('');
			var series = function (id) { var s = (d.series || []).filter(function (x) { return x.id === id; })[0]; return s && [S.seriesCover(id), t(s.title)]; };
			var work = function (id) { var w = (d.works || []).filter(function (x) { return x.id === id; })[0]; return w && [S.coverOf((d.bookInfo || {})[id]), t(w.title)]; };
			var looks = ['pixel', 'pixel masked stitch', 'blur', 'pixel masked cross', 'frost'];
			var prints = [series('mwt'), series('fantasia'), work('utopia'), series('safari'), work('rats')].filter(function (x) { return x && x[0]; }).map(function (c, i) {
				return '<li class="tb-print ' + looks[i] + '"><div class="pic"><img src="' + e(c[0]) + '" alt="" draggable="false"></div><span class="cap">' + e(c[1]) + '</span></li>';
			}).join('');
			setTimeout(termsBand, 0);
			return '<svg class="tb-filters" aria-hidden="true">' + px + '<filter id="tb-goo" x="-10%" y="-50%" width="120%" height="200%" color-interpolation-filters="sRGB">' +
				'<feGaussianBlur stdDeviation="10"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"/></filter></svg>' +
				'<div class="tb" data-px="32"><div class="tb-track"><span class="tb-text tb-idle" aria-hidden="true">' + e(L('اسحب لتكشف الأغلفة', 'Stretch to reveal the covers')) + '</span>' +
				'<span class="tb-text tb-ok" role="status"><span>' + e(L('الأغلفة لأصحابها', 'Their owners’ covers')) + '</span></span>' +
				'<button type="button" class="tb-knob" aria-label="' + e(L('اسحب لتكشف الأغلفة، أو اضغط Enter', 'Stretch to reveal the covers, or press Enter')) + '">' +
				'<span class="tb-body" aria-hidden="true"><i class="tb-neck"></i></span>' +
				'<svg class="tb-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5"/></svg>' +
				'<svg class="tb-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button></div>' +
				'<button type="button" class="tb-reset">' + e(L('من جديد', 'Again')) + '</button>' +
				'<ul class="tb-photos" aria-hidden="true">' + prints + '</ul></div>';
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

		/* numbers (with «اللغة والأسلوب», once style.html's): a scoreboard, its figures counting up from nought once drawn (all at
		   once when motion is reduced), its figures on cards in an endless row after GreenSock's «Infinite Scrolling Cards» on
		   CodePen (made there with GSAP; here in plain script, numbersDeck below); under it his career year by year in one chart, after amCharts' «CSS Animations» on CodePen
		   (made there with their library; here in plain SVG, drawn by numbersChart below); and under that his trailing dots, a
		   line at a time typed and erased (StyleSection.LINES) */
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
			var posts = ((d.blog || {}).posts) || [];
			var papers = posts.filter(function (p) { return p.src && !/^من كتاب/.test(p.src) && /(19|20)\d\d/.test(p.src); }).length;
			var houses = S ? S.publishers().filter(function (c) { return c.list.length; }).length : 0;
			/* [number, label, where it leads, the card's two colours, its gradient running from one to the other] */
			var cells = [[issues, L('عددًا في السلاسل', 'series issues'), 'works.html', '#e0633a', '#f6c98a'], [(d.series || []).length, L('سلسلة', 'series'), 'works.html', '#6d4aff', '#dcc8f4'],
				[(d.works || []).length, L('كتابًا مستقلًا', 'standalone books'), 'works.html', '#ff8a1c', '#f4b8f0'], [posts.length, L('منشورًا في المدونة', 'blog posts'), 'blog.html', '#1fa2a6', '#c2f2dc'],
				[papers, L('مقالًا في الصحف', 'pieces in the papers'), 'papers.html', '#d1343e', '#ffc7ad'], [(d.characters || []).length, L('شخصية', 'characters'), 'characters.html', '#3f9b4f', '#dcf29e'],
				[(d.quotes || []).length, L('اقتباسًا', 'quotes'), 'quotes.html', '#3b6cff', '#aee6ff'], [houses, L('دار نشر', 'publishers'), 'publishers.html', '#c79a3b', '#f6ecc8']].filter(function (c) { return c[0]; });
			setTimeout(numbersDeck, 0);
			return '<div class="ph-deck" tabindex="0" role="group" aria-roledescription="' + e(L('شريط بطاقات', 'carousel')) + '" aria-label="' + e(L('الموقع بالأرقام', 'The site in numbers')) + '">' +
					'<ul class="ph-cards">' + cells.map(function (c, i) {
						/* a playing card, as the pen's: its label at the head and upside down at the foot, the number in the middle, all
						   in the card's gradient inside a thin frame of it */
						return '<li class="ph-count" style="--a:' + c[3] + ';--b:' + c[4] + (String(c[0]).length > 3 ? ';--fs:.85' : '') + '">' /* (four figures a little smaller, within the frame) */ + '<a href="' + c[2] + '" tabindex="-1">' +
							'<span class="pc-top">' + e(c[1]) + '</span><b data-to="' + c[0] + '">' + e(A.num(0)) + '</b><span class="pc-bot" aria-hidden="true">' + e(c[1]) + '</span>' + '</a></li>';
					}).join('') + '</ul>' +
					'<p class="ph-deck-nav"><button type="button" class="ph-prev">' + e(L('السابق', 'Prev')) + '</button><button type="button" class="ph-next">' + e(L('التالي', 'Next')) + '</button></p>' +
				'</div>' +
				numbersChart(d, A) +
				'<div class="ph-type">' + ((window.StyleSection || {}).LINES || []).map(function (l, i) { return '<p style="--d:' + (i ? i * 3 - 9 : 0) + 's"><span>' /* (started part-way, not waiting: a waiting line would show its caret) */ + e(L(l[0], l[1])) + '</span></p>'; }).join('') + '</div>';
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

		/* map: Codrops' «Infinite Circular WebGL Gallery», the covers of the books by the places they name (mapGallery, below) */
		map: function (d, A) {
			setTimeout(function () { mapGallery(A); }, 0);
			return '<canvas class="ph-gl" tabindex="0"></canvas>';
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

	/* the numbers band's cards, as GreenSock's pen moves them: a card a tenth of the way along one second's run from four widths on
	   one side to four on the other, growing to full size in the middle and shrinking again (scale and opacity (1 - 0.2·steps)²),
	   the middle one on top, round and round without end. The pen drives it by the page's scroll; here a drag, Prev and Next, the
	   arrow keys, or a slow turn of its own that a pointer over it stops. The middle card is a link; a card beside it comes to the
	   middle when clicked */
	function numbersDeck() {
		var deck = document.querySelector('.ph-deck');
		if (!deck || deck.getAttribute('data-on')) return;
		deck.setAttribute('data-on', '1');
		var ph = deck.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden'); /* (this band is a control, not a decoration) */
		var cards = [].slice.call(deck.querySelectorAll('.ph-cards li')), n = cards.length, pos = 0, to = 0, from = 0, t0 = 0, timer = 0, auto = 0, hold = false;
		var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
		var rtl = function () { return getComputedStyle(deck).direction === 'rtl'; };
		var place = function () {
			var dir = rtl() ? -1 : 1, mid = Math.round(pos);
			cards.forEach(function (li, i) {
				var k = ((i - pos) % n + n) % n; if (k > n / 2) k -= n;
				var a = Math.min(1, Math.abs(k) * .2), sc = (1 - a) * (1 - a);
				li.style.transform = 'translate(-50%, -50%) translateX(' + (k * 80 * dir).toFixed(2) + '%) scale(' + sc.toFixed(3) + ')';
				li.style.opacity = sc.toFixed(3);
				li.style.zIndex = 100 - Math.round(Math.abs(k) * 10);
				var on = ((mid % n) + n) % n === i;
				li.classList.toggle('is-mid', on);
				li.querySelector('a').tabIndex = on ? 0 : -1;
			});
		};
		/* a smooth glide to the target, eased out (the pen's power3), measured against the clock */
		var glide = function () {
			var f = Math.min(1, (Date.now() - t0) / 500), ease = 1 - Math.pow(1 - f, 3);
			pos = from + (to - from) * ease;
			place();
			timer = f < 1 ? setTimeout(glide, 16) : 0;
		};
		var go = function (target) { from = pos; to = target; t0 = Date.now(); if (still) { pos = to; place(); return; } clearTimeout(timer); glide(); };
		var step = function (d) { go(Math.round(to) + d); };
		deck.querySelector('.ph-next').addEventListener('click', function () { step(1); });
		deck.querySelector('.ph-prev').addEventListener('click', function () { step(-1); });
		deck.addEventListener('keydown', function (ev) {
			var fwd = rtl() ? 'ArrowLeft' : 'ArrowRight', back = rtl() ? 'ArrowRight' : 'ArrowLeft';
			if (ev.key === fwd) { ev.preventDefault(); step(1); } else if (ev.key === back) { ev.preventDefault(); step(-1); }
		});
		/* a drag: a card's width moved is a card along; let go, it settles on the nearest */
		var ul = deck.querySelector('.ph-cards'), x0 = null, p0 = 0, moved = 0;
		ul.addEventListener('pointerdown', function (ev) { x0 = ev.clientX; p0 = pos; moved = 0; clearTimeout(timer); ul.setPointerCapture(ev.pointerId); });
		ul.addEventListener('pointermove', function (ev) {
			if (x0 == null) return;
			var dx = ev.clientX - x0; moved = Math.max(moved, Math.abs(dx));
			pos = p0 - dx / (cards[0].offsetWidth * .8) * (rtl() ? -1 : 1); to = pos; place();
		});
		var up = function () { if (x0 == null) return; x0 = null; go(Math.round(pos)); };
		ul.addEventListener('pointerup', up); ul.addEventListener('pointercancel', up);
		/* a click: on the middle card it follows the link, on another it brings that one to the middle; after a drag, nothing */
		cards.forEach(function (li, i) {
			li.querySelector('a').addEventListener('click', function (ev) {
				if (moved > 6) { ev.preventDefault(); return; }
				if (!li.classList.contains('is-mid')) {
					ev.preventDefault();
					var k = ((i - Math.round(to)) % n + n) % n; if (k > n / 2) k -= n;
					go(Math.round(to) + k);
				}
			});
		});
		/* its own slow turn, every three seconds, stopped while a pointer or the focus is on it */
		deck.addEventListener('pointerenter', function () { hold = true; });
		deck.addEventListener('pointerleave', function () { hold = false; });
		deck.addEventListener('focusin', function () { hold = true; });
		deck.addEventListener('focusout', function () { hold = false; });
		if (!still) auto = setInterval(function () { if (!hold && document.body.contains(deck)) step(1); else if (!document.body.contains(deck)) clearInterval(auto); }, 3000);
		place();
	}

	/* the numbers band's chart, as amCharts' pen draws its trip: Ma Wara' al-Tabi'a's issues each year as columns that rise in and
	   light up under the pointer; his standalone books as a dashed line whose dashes keep moving, a round bullet a year sized by
	   how many, the milestones named, the last one pulsing; his pieces in the papers as a red line that draws itself in, square
	   bullets on it. Each on its own scale. Under it a legend: the totals, or the year under the pointer */
	function numbersChart(d, A) {
		var P = window.PAGE;
		if (!P || typeof P.yearly !== 'function') return '';
		var e = A.esc, L = A.L, t = A.t, Y = P.yearly(), rtl = A.lang !== 'en';
		var n = function (o, y) { return (o[y] || []).length; };
		var ys = [].concat(Object.keys(Y.mwt), Object.keys(Y.books), Object.keys(Y.papers)).map(Number);
		var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), years = [];
		for (var y = y0; y <= y1; y++) years.push(y);
		var max = function (o) { return Math.max.apply(null, years.map(function (y) { return n(o, y); })) || 1; };
		var mM = max(Y.mwt), mB = max(Y.books), mP = max(Y.papers);
		var W = 1000, H = 240, pT = 26, pB = 26, pS = 18, bw = (W - 2 * pS) / years.length;
		var X = function (i) { return rtl ? W - pS - (i + 1) * bw : pS + i * bw; };
		var cx = function (i) { return X(i) + bw / 2; };
		var V = function (v, m, top) { return H - pB - v / m * (H - pB - pT - (top || 0)); };
		var svg = '<svg class="nmc" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">';
		/* the grid, a faint line a year, and the years every five */
		years.forEach(function (y, i) {
			svg += '<line class="nmc-grid" x1="' + cx(i).toFixed(1) + '" x2="' + cx(i).toFixed(1) + '" y1="' + pT + '" y2="' + (H - pB) + '"/>';
			if (y % 5 === 0) svg += '<text class="nmc-ax" x="' + cx(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + e(A.num(y)) + '</text>';
		});
		svg += '<line class="nmc-axis" x1="' + pS + '" x2="' + (W - pS) + '" y1="' + (H - pB) + '" y2="' + (H - pB) + '"/>';
		/* the columns */
		years.forEach(function (y, i) {
			var v = n(Y.mwt, y);
			if (v) svg += '<rect class="nmc-col" data-y="' + y + '" style="--i:' + i + '" x="' + (X(i) + bw * .16).toFixed(1) + '" y="' + V(v, mM).toFixed(1) + '" width="' + (bw * .68).toFixed(1) + '" height="' + (H - pB - V(v, mM)).toFixed(1) + '"/>';
		});
		/* the papers: a line drawing itself in, square bullets */
		var pp = years.map(function (y, i) { return [cx(i), V(n(Y.papers, y), mP, 30), n(Y.papers, y)]; }).filter(function (p) { return p[2]; });
		if (pp.length) {
			svg += '<path class="nmc-papers" pathLength="1" d="M' + pp.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('L') + '"/>';
			svg += pp.map(function (p) { return '<rect class="nmc-sq" x="' + (p[0] - 3.5).toFixed(1) + '" y="' + (p[1] - 3.5).toFixed(1) + '" width="7" height="7"/>'; }).join('');
		}
		/* the books: a dashed line, bullets by how many, the milestones named */
		var bp = years.map(function (y, i) { return [cx(i), V(n(Y.books, y), mB, 46), n(Y.books, y), y]; }).filter(function (p) { return p[2]; });
		var named = {}, peak = bp.reduce(function (a, p) { return p[2] > a[2] ? p : a; }, bp[0] || [0, 0, 0, 0]);
		var utopia = (d.works || []).filter(function (w) { return w.id === 'utopia'; })[0], uy = utopia && +((String(utopia.year || '').match(/\d{4}/) || [])[0]);
		if (bp.length) { named[bp[0][3]] = 1; named[peak[3]] = 1; named[bp[bp.length - 1][3]] = 1; if (uy) named[uy] = 1; }
		var title = function (y) {
			var list = Y.books[y] || [], u = list.filter(function (w) { return utopia && w.id === utopia.id; })[0] || list[0];
			return u ? t(u.title) : '';
		};
		if (bp.length) {
			svg += '<path class="nmc-books" d="M' + bp.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('L') + '"/>';
			svg += bp.map(function (p, k) {
				var rr = 3 + Math.sqrt(p[2]) * 3.2, last = k === bp.length - 1;
				return '<circle class="nmc-dot' + (last ? ' is-last' : '') + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + rr.toFixed(1) + '"/>' +
					(named[p[3]] ? '<text class="nmc-name' + (p[3] === uy ? ' is-key' : '') + '" x="' + (p[0] + (rtl ? -1 : 1) * (rr + 5)).toFixed(1) + '" y="' + (p[1] + 4).toFixed(1) + '" text-anchor="start" direction="' + (rtl ? 'rtl' : 'ltr') + '">' + e(title(p[3])) + '</text>' : '');
			}).join('');
		}
		/* a band a year that the pointer finds */
		years.forEach(function (y, i) { svg += '<rect class="nmc-hit" data-y="' + y + '" x="' + X(i).toFixed(1) + '" y="0" width="' + bw.toFixed(1) + '" height="' + H + '"/>'; });
		svg += '</svg>';
		var tot = function (o) { return Object.keys(o).reduce(function (a, k) { return a + o[k].length; }, 0); };
		setTimeout(function () { numbersChartWire(Y, A); }, 0);
		return '<div class="nmc-wrap">' + svg + '<p class="nmc-legend" aria-live="polite">' +
			'<span class="k-col"><i></i>' + e(L('أعداد «ما وراء الطبيعة»', 'Ma Wara’ al-Tabi’a issues')) + ' <b data-k="mwt" data-all="' + tot(Y.mwt) + '"></b></span>' +
			'<span class="k-books"><i></i>' + e(L('كتبه المستقلة', 'standalone books')) + ' <b data-k="books" data-all="' + tot(Y.books) + '"></b></span>' +
			'<span class="k-papers"><i></i>' + e(L('مقالاته في الصحف', 'pieces in the papers')) + ' <b data-k="papers" data-all="' + tot(Y.papers) + '"></b></span>' +
			'<em class="nmc-year"></em></p></div>';
	}
	/* the legend follows the pointer: a year's three numbers, or the totals when it leaves */
	function numbersChartWire(Y, A) {
		var wrap = document.querySelector('.nmc-wrap');
		if (!wrap || wrap.getAttribute('data-on')) return;
		wrap.setAttribute('data-on', '1');
		var L = A.L, bs = [].slice.call(wrap.querySelectorAll('.nmc-legend b')), yr = wrap.querySelector('.nmc-year');
		var show = function (y) {
			bs.forEach(function (b) { b.textContent = A.num(y ? (Y[b.getAttribute('data-k')][y] || []).length : +b.getAttribute('data-all')); });
			yr.textContent = y ? A.num(y) : L('المجموع', 'in all');
			/* the year's band and its column light up (the bands lie over the columns, so a hover of the column's own cannot) */
			[].forEach.call(wrap.querySelectorAll('.is-on'), function (h) { h.classList.remove('is-on'); });
			if (y) [].forEach.call(wrap.querySelectorAll('[data-y="' + y + '"]'), function (h) { h.classList.add('is-on'); });
		};
		wrap.addEventListener('pointermove', function (ev) { var h = ev.target.closest('.nmc-hit'); show(h ? +h.getAttribute('data-y') : 0); });
		wrap.addEventListener('pointerleave', function () { show(0); });
		show(0);
	}

	/* the about band at work: the panels rise in, a click (or Enter) opens one, the cross or Escape closes it */
	function aboutBand() {
		var el = document.querySelector('.ab');
		if (!el || el.getAttribute('data-on')) return;
		el.setAttribute('data-on', '1');
		var ph = el.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden'); /* (this band is a control, not a decoration) */
		var els = [].slice.call(el.querySelectorAll('.ab-el'));
		var focusable = function (p, on) { [].forEach.call(p.querySelectorAll('.ab-go, .ab-close'), function (x) { x.tabIndex = on ? 0 : -1; }); };
		var open = function (p) {
			if (p.classList.contains('s--active')) return;
			el.classList.add('s--el-active'); p.classList.add('s--active'); p.setAttribute('aria-expanded', 'true'); focusable(p, true);
		};
		var close = function () {
			var p = el.querySelector('.ab-el.s--active');
			if (!p) return;
			el.classList.remove('s--el-active'); p.classList.remove('s--active'); p.setAttribute('aria-expanded', 'false'); focusable(p, false); p.focus();
		};
		els.forEach(function (p) {
			p.addEventListener('click', function () { open(p); });
			p.addEventListener('keydown', function (ev) {
				if (ev.target === p && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); open(p); }
				if (ev.key === 'Escape') close();
			});
			p.querySelector('.ab-close').addEventListener('click', function (ev) { ev.stopPropagation(); close(); });
		});
		setTimeout(function () { el.classList.remove('s--inactive'); }, 200);
	}

	/* the terms band at work: the knob follows the pull with a growing lag, x (1 + 2.2x) / (1 + x + 2.2x²) of the free length, so it
	   never quite gets there; let go past .72 and it runs to the end, or else it snaps back. The pixelated covers clear in eight steps */
	function termsBand() {
		var el = document.querySelector('.tb');
		if (!el || el.getAttribute('data-on')) return;
		el.setAttribute('data-on', '1');
		var ph = el.closest('.ph');
		if (ph) ph.removeAttribute('aria-hidden'); /* (this band is a control, not a decoration) */
		var knob = el.querySelector('.tb-knob'), p = 0, done = 0, x0 = null;
		var rtl = function () { return getComputedStyle(el).direction === 'rtl'; };
		var max = function () { return parseFloat(getComputedStyle(el).getPropertyValue('--tb-max')) || 400; };
		var set = function (np, held) {
			p = np;
			el.style.setProperty('--tb-p', p);
			el.style.setProperty('--tb-held', held ? 1 : 0);
			el.style.setProperty('--tb-done', done);
			el.setAttribute('data-held', held ? 1 : 0);
			el.setAttribute('data-done', done);
			el.setAttribute('data-px', p >= 1 ? 0 : [32, 24, 18, 14, 10, 8, 6, 4][Math.min(7, Math.floor(p * 8))]);
		};
		var finish = function () { done = 1; set(1, false); };
		knob.addEventListener('pointerdown', function (ev) {
			if (done) return;
			x0 = ev.clientX; knob.setPointerCapture(ev.pointerId); set(p, true);
		});
		knob.addEventListener('pointermove', function (ev) {
			if (x0 == null) return;
			var x = Math.max(0, (ev.clientX - x0) * (rtl() ? -1 : 1)) / max();
			set(x * (1 + 2.2 * x) / (1 + x + 2.2 * x * x), true);
		});
		var up = function () {
			if (x0 == null) return;
			x0 = null;
			if (p > 0.72) finish(); else set(0, false);
		};
		knob.addEventListener('pointerup', up);
		knob.addEventListener('pointercancel', up);
		knob.addEventListener('keydown', function (ev) {
			if (!done && (ev.key === 'Enter' || ev.key === (rtl() ? 'ArrowLeft' : 'ArrowRight'))) { ev.preventDefault(); finish(); }
		});
		el.querySelector('.tb-reset').addEventListener('click', function () { done = 0; set(0, false); knob.focus(); });
		set(0, false);
	}

	/* the map band at work: Codrops' «Infinite Circular WebGL Gallery» (Luis Henrique Bizarro; MIT), in plain WebGL — a card a place
	   his books name (assets/data/places.json, the map's own): a picture of it (assets/data/place-photos.json, tools/build-place-photos.js),
	   its name and how many books name it under it, drawn on a canvas in the site's own fonts (so the Arabic joins). The cards stand on a wide arc, turned along it,
	   and ripple as they move, more the faster; dragged sideways (or by the arrow keys) they run on without end, settling on a
	   card when let go, and drift slowly by themselves until touched. A card clicked, tapped or given Enter opens its place on the map below. The
	   wheel scrolls the page, as anywhere else. Drawn only while on screen */
	function mapGallery(A) {
		var L = A.L, json = function (u) { return fetch(u).then(function (r) { return r.json(); }); };
		var n = function (k) { return k === 1 ? L('كتاب واحد يذكره', 'Named in one book') : k === 2 ? L('يذكره كتابان', 'Named in 2 books') : L('يذكره ' + A.num(k) + ' من كتبه', 'Named in ' + k + ' books'); };
		gallery(document.querySelector('.ph[data-ph="map"] .ph-stage'), A, {
			label: L('أماكن كتبه: اسحب أو استعمل الأسهم، وEnter لفتح المكان على الخريطة', 'The places of his books: drag or use the arrows, Enter opens the place on the map'),
			load: function () {
				return Promise.all([json('assets/data/places.json'), json('assets/data/place-photos.json')]).then(function (got) {
					var photos = got[1];
					return got[0].filter(function (p) { return photos[p.en] && (p.items || []).length; })
						.sort(function (a, b) { return b.items.length - a.items.length; })
						.map(function (p) { return { title: L(p.ar, p.en), sub: n(p.items.length), en: p.en, src: photos[p.en].src }; });
				});
			},
			/* a card opens its place on the map below (map.js), and goes there */
			show: function (c) {
				var P = window.PAGE, i = P && P._places ? P._places.findIndex(function (p) { return p.en === c.en; }) : -1;
				if (i < 0) { location.hash = encodeURIComponent(c.en); return; }
				P.open(i);
				return document.querySelector('.mp-panel') || document.querySelector('.mp-map');
			}
		});
	}

	/* the gallery itself, for a band's stage holding a .ph-gl canvas; o.load() gives its cards ({title, sub, src}), o.show(card)
	   opens one (and may give back the element to go to), o.label names it for screen readers */
	function gallery(stage, A, o) {
		var cv = stage && stage.querySelector('.ph-gl');
		if (!cv || cv.getAttribute('data-on')) return;
		cv.setAttribute('data-on', '1');
		var gl = cv.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
		if (!gl) { cv.remove(); return; }
		var L = A.L, still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
		var css = getComputedStyle(document.documentElement);
		var fDisplay = css.getPropertyValue('--f-display').trim() || 'serif', fBody = getComputedStyle(document.body).fontFamily;

		/* the shaders: the zip's, its vertex wave and cover fit (the card's canvas is made to the plane's shape, so it is drawn whole) */
		var VS = 'precision highp float; attribute vec3 position; attribute vec2 uv; uniform mat4 uMVP; uniform float uTime; uniform float uSpeed; varying vec2 vUv;' +
			'void main() { vUv = uv; vec3 p = position; p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);' +
			'gl_Position = uMVP * vec4(p, 1.0); }';
		var FS = 'precision highp float; uniform sampler2D tMap; uniform float uAlpha; varying vec2 vUv;' +
			'void main() { vec4 c = texture2D(tMap, vUv); gl_FragColor = vec4(c.rgb * uAlpha, c.a * uAlpha); }';
		var sh = function (type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
		var prog = gl.createProgram();
		gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { cv.remove(); return; }
		gl.useProgram(prog);
		var U = {}; ['uMVP', 'uTime', 'uSpeed', 'tMap', 'uAlpha'].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });

		/* the plane: 1 × 1, cut 100 × 50 as the zip's, so it can bend */
		var WS = 100, HS = 50, pos = [], uvs = [], idx = [];
		for (var j = 0; j <= HS; j++) for (var i = 0; i <= WS; i++) { pos.push(i / WS - 0.5, 0.5 - j / HS, 0); uvs.push(i / WS, j / HS); }
		for (j = 0; j < HS; j++) for (i = 0; i < WS; i++) { var a = j * (WS + 1) + i, b = a + WS + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
		var buf = function (target, data) { var x = gl.createBuffer(); gl.bindBuffer(target, x); gl.bufferData(target, data, gl.STATIC_DRAW); return x; };
		var bp = buf(gl.ARRAY_BUFFER, new Float32Array(pos)), lp = gl.getAttribLocation(prog, 'position');
		gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 3, gl.FLOAT, false, 0, 0);
		var bu = buf(gl.ARRAY_BUFFER, new Float32Array(uvs)), lu = gl.getAttribLocation(prog, 'uv');
		gl.bindBuffer(gl.ARRAY_BUFFER, bu); gl.enableVertexAttribArray(lu); gl.vertexAttribPointer(lu, 2, gl.FLOAT, false, 0, 0);
		buf(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx));
		gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

		/* the camera: the zip's, 45° at 20 */
		var FOV = 45 * Math.PI / 180, CZ = 20, vw = 0, vh = 0, W = 0, H = 0, P = new Float32Array(16);
		var resize = function () {
			var dpr = Math.min(window.devicePixelRatio || 1, 2);
			W = cv.clientWidth; H = cv.clientHeight;
			cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
			gl.viewport(0, 0, cv.width, cv.height);
			var f = 1 / Math.tan(FOV / 2), asp = W / H, n = 0.1, fr = 100;
			P.fill(0); P[0] = f / asp; P[5] = f; P[10] = (fr + n) / (n - fr); P[11] = -1; P[14] = 2 * fr * n / (n - fr);
			vh = 2 * Math.tan(FOV / 2) * CZ; vw = vh * asp;
			size();
		};
		/* each card's model: moved, turned about z, scaled; with the camera's view (back 20) and its projection */
		var mvp = function (x, y, rz, sx, sy) {
			var c = Math.cos(rz), s = Math.sin(rz);
			var m = [c * sx, s * sx, 0, 0, -s * sy, c * sy, 0, 0, 0, 0, 1, 0, x, y, -CZ, 1], o = new Float32Array(16);
			for (var r = 0; r < 4; r++) for (var k = 0; k < 4; k++) o[k * 4 + r] = P[r] * m[k * 4] + P[4 + r] * m[k * 4 + 1] + P[8 + r] * m[k * 4 + 2] + P[12 + r] * m[k * 4 + 3];
			return o;
		};

		/* the cards: one a place, the cover and its words drawn to a canvas of the card's shape */
		var CW = 512, CH = 800, cards = [], sx = 0, sy = 0, gap = 0, total = 0;
		var draw = function (card, img) {
			var c = document.createElement('canvas'), x = c.getContext('2d');
			c.width = CW; c.height = CH;
			var ih = 640, ink = getComputedStyle(stage); /* (the words in the band's own colours, dark or light) */
			card.img = img;
			x.fillStyle = '#16120f'; x.fillRect(0, 0, CW, ih);
			if (img) {
				/* the cover fills its part, cut to fit (the zip's fit) */
				var r = Math.max(CW / img.naturalWidth, ih / img.naturalHeight), w = img.naturalWidth * r, h = img.naturalHeight * r;
				x.drawImage(img, (CW - w) / 2, (ih - h) / 2, w, h);
			}
			x.direction = A.lang === 'en' ? 'ltr' : 'rtl'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
			x.fillStyle = ink.getPropertyValue('--ph-ink').trim() || '#efe6d2'; x.font = '64px ' + fDisplay;
			x.fillText(card.title, CW / 2, ih + 84, CW - 24);
			x.fillStyle = ink.getPropertyValue('--ph-dim').trim() || '#8f887a'; x.font = '30px ' + fBody;
			x.fillText(card.sub, CW / 2, ih + 136, CW - 24); /* (how many of his books name it) */
			var t = card.tex || gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, t);
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			card.tex = t; card.ready = true;
		};
		/* sizes: a card three quarters of the band's height, the zip's gap of 2 between them */
		var size = function () {
			sy = vh * 0.78; sx = sy * CW / CH; gap = 2;
			total = (sx + gap) * cards.length;
			/* (around the middle from the start, on both sides, so the circle is full at once) */
			var mid = Math.floor(cards.length / 2);
			cards.forEach(function (c, k) { c.x = (sx + gap) * (k - mid); });
		};

		/* scrolling: the zip's eased run — target, current, last */
		var sc = { ease: 0.05, current: 0, target: 0, last: 0 }, auto = !still, down = null, t0 = 0, live = true, raf = 0;
		var snap = function () { var w = sx + gap; sc.target = Math.round(sc.target / w) * w; };
		var show = function (c) {
			var to = o.show(c.data);
			if (to) to.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
		};
		var at = function (cx, any) {
			/* the card under the pointer: from its place across the band (it stands near the arc's middle there); any: the nearest, under it or not */
			var wx = (cx / W - 0.5) * vw, best = null;
			cards.forEach(function (c) { if ((any || Math.abs(c.px - wx) < sx / 2) && (!best || Math.abs(c.px - wx) < Math.abs(best.px - wx))) best = c; });
			return best;
		};
		cv.addEventListener('pointerdown', function (ev) {
			down = { x: ev.clientX, pos: sc.target, moved: false }; auto = false;
			try { cv.setPointerCapture(ev.pointerId); } catch (e) {}
		});
		cv.addEventListener('pointermove', function (ev) {
			if (!down) { var h = at(ev.clientX); cv.style.cursor = h ? 'pointer' : 'grab'; return; }
			var dx = down.x - ev.clientX;
			if (Math.abs(dx) > 6) down.moved = true;
			sc.target = down.pos + dx * (vw / W) * 1.1;
			cv.style.cursor = 'grabbing';
		});
		var up = function (ev) {
			if (!down) return;
			var d = down; down = null; cv.style.cursor = '';
			if (!d.moved && ev && ev.type === 'pointerup') { var c = at(ev.clientX); if (c) show(c); return; }
			snap();
		};
		cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
		/* the keyboard: a card at a time, Enter opens the one in the middle */
		cv.addEventListener('keydown', function (ev) {
			var w = sx + gap, rtl = A.lang !== 'en';
			if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
				ev.preventDefault(); auto = false;
				sc.target = Math.round(sc.target / w) * w + ((ev.key === 'ArrowRight') !== rtl ? w : -w);
			} else if (ev.key === 'Enter') { var c = at(W / 2, true); if (c) show(c); }
		});

		var frame = function () {
			raf = 0;
			if (!live || !document.body.contains(cv)) return;
			if (auto) sc.target += 0.012;
			sc.current += (sc.target - sc.current) * sc.ease;
			var dir = sc.current > sc.last ? 1 : -1, speed = sc.current - sc.last;
			gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
			/* the arc: the zip's cosine, made as deep at the band's edges as the band allows */
			var half = vw / 2, depth = vh * 0.32 / (1 - Math.cos(Math.min(0.95, half / total) * Math.PI));
			cards.forEach(function (c) {
				var x = c.x - sc.current - c.extra;
				/* the zip's endless run: a card gone off one side comes in at the other */
				if (dir > 0 && x + sx / 2 < -half - sx) { c.extra -= total; x += total; }
				if (dir < 0 && x - sx / 2 > half + sx) { c.extra += total; x -= total; }
				c.px = x;
				if (!c.ready || Math.abs(x) > half + sx) return;
				var y = (Math.cos(x / total * Math.PI) - 1) * depth + vh * 0.02, rz = -x / total * Math.PI;
				c.time += 0.04;
				gl.uniformMatrix4fv(U.uMVP, false, mvp(x, y, rz, sx, sy));
				gl.uniform1f(U.uTime, c.time); gl.uniform1f(U.uSpeed, still ? 0 : speed);
				gl.uniform1f(U.uAlpha, 1);
				gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, c.tex); gl.uniform1i(U.tMap, 0);
				gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
			});
			sc.last = sc.current;
			if (!still || down || Math.abs(sc.target - sc.current) > 0.001) raf = requestAnimationFrame(frame);
		};
		var go = function () { if (!raf && live) raf = requestAnimationFrame(frame); };
		['pointerdown', 'pointermove', 'keydown'].forEach(function (k) { cv.addEventListener(k, go); });
		/* drawn only while the band is on screen */
		if (window.IntersectionObserver) new IntersectionObserver(function (es) { live = es[0].isIntersecting; go(); }).observe(cv);
		window.addEventListener('resize', function () { resize(); go(); });

		o.load().then(function (list) {
			if (!document.body.contains(cv) || !list.length) return;
			/* enough cards to go round (the zip doubles its twelve) */
			while (list.length < 14) list = list.concat(list);
			cards = list.map(function (p, k) { return { title: p.title, sub: p.sub, src: p.src, data: p, x: 0, px: 1e9, extra: 0, time: 100 * Math.random(), k: k }; });
			resize();
			sc.target = sc.current = sc.last = 0;
			var ph = stage.closest('.ph');
			if (ph) ph.removeAttribute('aria-hidden'); /* (this band is a control, not a decoration) */
			cv.setAttribute('aria-label', o.label);
			/* the words wait for the site's fonts; each cover drawn in when it has come */
			(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
				var seen = {};
				cards.forEach(function (c) {
					draw(c, null);
					var img = seen[c.src] || new Image();
					seen[c.src] = img;
					var put = function () { draw(c, img); go(); };
					if (img.complete && img.naturalWidth) put(); else { img.addEventListener('load', put); if (!img.src) img.src = c.src; }
				});
				stage.classList.add('is-on');
				go();
				/* drawn again when the theme changes */
				new MutationObserver(function () { cards.forEach(function (c) { draw(c, c.img && c.img.naturalWidth ? c.img : null); }); go(); })
					.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
			});
		}).catch(function () {});
	}

	function render() {
		var A = window.App;
		if (!A) return;
		var d = A.data();
		[].slice.call(document.querySelectorAll('section.ph[data-ph]')).forEach(function (el) {
			/* (a page may bring its own band: PAGE.band(d, App), kept in its own script) */
			var f = R[el.getAttribute('data-ph')] || (window.PAGE && window.PAGE.band);
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
	window.PageHero = { render: render, gallery: gallery };
})();
