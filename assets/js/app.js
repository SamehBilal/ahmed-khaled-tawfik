/* Shared runtime: language, theme, header/footer, search, deep links, helpers.
   Each page sets window.PAGE = { id, render() } before this file loads. */
(function () {
	'use strict';

	var LANG_KEY = 'akt-lang';
	var THEME_KEY = 'akt-theme';
	var REPO = 'https://github.com/SamehBilal/ahmed-khaled-tawfik';

	var UI = {
		nav: [
			{ id: 'home', href: 'index.html', ar: 'الرئيسية', en: 'Home' },
			{ id: 'guide', href: 'guide.html', ar: 'من أين أبدأ؟', en: 'Start here' },
			{ id: 'works', href: 'works.html', ar: 'الأعمال', en: 'Works' },
			{ id: 'characters', href: 'characters.html', ar: 'الشخصيات', en: 'Characters' },
			{ id: 'writers', href: 'writers.html', ar: 'الكُتّاب', en: 'Writers' },
			{ id: 'quotes', href: 'quotes.html', ar: 'اقتباسات', en: 'Quotes' },
			{ id: 'audio', href: 'audio.html', ar: 'مسموع', en: 'Audio' },
			{ id: 'legacy', href: 'legacy.html', ar: 'الإرث', en: 'Legacy' },
			{ id: 'tributes', href: 'tributes.html', ar: 'قالوا عنه', en: 'Tributes' },
			{ id: 'blog', href: 'blog.html', ar: 'المدونة', en: 'Blog' }
		],
		toggle: { ar: 'English', en: 'العربية' },
		motto: { ar: 'جعل الشباب يقرؤون', en: 'He made the young read' },
		footerNote: {
			ar: 'موقع محبّين غير رسمي، صُنع تقديرًا لأحمد خالد توفيق (1962–2018). البيانات مجمّعة من مصادر عامة — راجع صفحة الكُتّاب للمراجع.',
			en: 'An unofficial fan tribute to Ahmed Khaled Tawfik (1962–2018). Data compiled from public sources — see the Writers page for references.'
		},
		fix: { ar: 'وجدت خطأً أو لديك إضافة؟ اقترح تصحيحًا ↗', en: 'Spotted a mistake or have an addition? Suggest a correction ↗' },
		credits: {
			ar: 'تصميم الكتب ثلاثية الأبعاد مبني على عروض Codrops — خط The Godfather من تصميم Jeff Bell.',
			en: '3D book designs built on Codrops demos — "The Godfather" font by Jeff Bell.'
		}
	};

	function store(k, v) {
		try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
	}

	/* Arabic-aware normalisation for search: strip diacritics/tatweel, unify letter variants */
	function norm(s) {
		return String(s || '').toLowerCase()
			.replace(/[ً-ٰٟـ]/g, '')
			.replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
			.replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
			.replace(/['’`".,:;!?()«»\-–—_/\\]/g, ' ')
			.replace(/\s+/g, ' ').trim();
	}

	var App = {
		lang: store(LANG_KEY) === 'en' ? 'en' : 'ar',
		UI: UI,
		REPO: REPO,
		norm: norm,

		/* pick a localized string from {ar, en} (or return plain strings as-is) */
		t: function (o) {
			if (o == null) return '';
			if (typeof o === 'string' || typeof o === 'number') return String(o);
			return o[App.lang] || o.ar || o.en || '';
		},
		/* the "other" language — used for subtitles */
		alt: function (o) {
			if (!o || typeof o !== 'object') return '';
			return App.lang === 'ar' ? (o.en || '') : (o.ar || '');
		},
		esc: function (s) {
			return String(s == null ? '' : s)
				.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
		},
		/* localized + escaped */
		tx: function (o) { return App.esc(App.t(o)); },
		L: function (ar, en) { return App.lang === 'ar' ? ar : en; },
		paras: function (o) {
			return App.t(o).split(/\n\s*\n/).filter(Boolean).map(function (p) {
				return '<p>' + App.esc(p.trim()) + '</p>';
			}).join('');
		},
		num: function (n) {
			if (n == null || n === '') return '';
			return App.digits(n);
		},
		/* Western digits (0-9) everywhere, in Arabic too */
		digits: function (s) {
			return String(s).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 0x0660; }).replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 0x06F0; });
		},
		data: function () { return window.AKT || {}; },
		byId: function (list, id) {
			list = list || [];
			for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
			return null;
		},
		/* find the series or standalone work a character / adaptation belongs to */
		findWork: function (id) {
			var d = App.data();
			return App.byId(d.series, id) || App.byId(d.works, id) || App.byId(d.otherSeries, id);
		},
		isSeries: function (id) { return !!App.byId(App.data().series, id); },

		/* ---------- deep links ---------- */
		workHref: function (id) {
			var d = App.data();
			return (App.isSeries(id) || App.byId(d.otherSeries, id) ? 'series.html?id=' : 'book.html?id=') + encodeURIComponent(id);
		},
		issueHref: function (sid, is) { if (is._special) return 'book.html?id=specials-' + is.n; if (is.work) return 'book.html?id=' + encodeURIComponent(is.work); return 'book.html?id=' + sid + '-' + (is.n != null ? is.n : 'x' + (is._idx || 0)) + (is.part ? '-' + is.part : ''); },
		charHref: function (id) { return 'character.html?id=' + encodeURIComponent(id); },
		workLink: function (id) {
			var w = App.findWork(id);
			return w ? '<a href="' + App.workHref(id) + '">' + App.tx(w.title) + '</a>' : '';
		},
		charLink: function (id) {
			var c = App.byId(App.data().characters, id);
			return c ? '<a href="' + App.charHref(id) + '">' + App.tx(c.name) + '</a>' : '';
		},
		/* scroll to #hash after a render, and let the page react (open / flip) */
		focusHash: function (onTarget) {
			var id = decodeURIComponent(location.hash.slice(1));
			if (!id) return;
			var el = document.getElementById(id);
			if (!el) return;
			el.classList.add('rise', 'in');
			if (onTarget) onTarget(el, id);
			setTimeout(function () {
				el.scrollIntoView({ behavior: 'smooth', block: 'center' });
				el.classList.remove('is-target'); void el.offsetWidth; el.classList.add('is-target');
			}, 60);
		},

		/* "suggest a correction" link to a pre-filled GitHub issue */
		fixHref: function (subject) {
			var title = (App.lang === 'ar' ? 'تصحيح: ' : 'Correction: ') + (subject || document.title);
			var body = (App.lang === 'ar'
				? 'الصفحة: ' + location.href + '\n\nما الخطأ؟\n\nالتصحيح المقترح:\n\nالمصدر (رابط):\n'
				: 'Page: ' + location.href + '\n\nWhat is wrong?\n\nSuggested fix:\n\nSource (link):\n');
			return REPO + '/issues/new?title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
		},
		fixLink: function (subject) {
			return '<a class="fix-link" href="' + App.esc(App.fixHref(subject)) + '" target="_blank" rel="noopener">' + App.L('اقترح تصحيحًا ↗', 'Suggest a fix ↗') + '</a>';
		},

		/* ---------- language / theme ---------- */
		setLang: function (l) {
			App.lang = l;
			store(LANG_KEY, l);
			App.applyLang();
			App.renderChrome();
			App.fillStrings();
			if (window.PAGE && typeof window.PAGE.render === 'function') window.PAGE.render();
			App.observeRise();
		},

		applyLang: function () {
			var html = document.documentElement;
			html.lang = App.lang;
			html.dir = App.lang === 'ar' ? 'rtl' : 'ltr';
			var p = window.PAGE || {};
			if (p.title) document.title = App.t(p.title) + ' — ' + (App.lang === 'ar' ? 'أحمد خالد توفيق' : 'Ahmed Khaled Tawfik');
		},

		theme: function () { return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; },
		setTheme: function (th) {
			document.documentElement.setAttribute('data-theme', th);
			store(THEME_KEY, th);
			var b = document.querySelector('.theme-toggle');
			if (b) b.setAttribute('aria-pressed', String(th === 'light'));
		},

		renderChrome: function () {
			var pageId = (window.PAGE && window.PAGE.id) || '';
			var header = document.getElementById('site-header');
			if (header) {
				header.className = 'site-header';
				header.innerHTML =
					'<div class="wrap">' +
						'<a class="brand" href="index.html"><span class="brand-ar">العرّاب</span><span class="brand-en">The Godfather</span></a>' +
						'<nav class="nav" aria-label="' + App.L('التنقل الرئيسي', 'Main') + '">' +
							UI.nav.map(function (n) {
								return '<a href="' + n.href + '"' + (n.id === pageId ? ' aria-current="page"' : '') + '>' + App.esc(n[App.lang]) + '</a>';
							}).join('') +
						'</nav>' +
						'<div class="tools">' +
							'<button class="icon-btn search-open" type="button" aria-label="' + App.L('بحث', 'Search') + '" title="' + App.L('بحث (/)', 'Search (/)') + '">' +
								'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
							'</button>' +
							'<button class="icon-btn theme-toggle" type="button" aria-pressed="' + (App.theme() === 'light') + '" aria-label="' + App.L('الوضع الورقي', 'Paper theme') + '" title="' + App.L('الوضع الورقي / الليلي', 'Paper / night theme') + '">' +
								'<svg class="i-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor"/></svg>' +
								'<svg class="i-page" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 11h7M9 15h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
							'</button>' +
							'<button class="lang-toggle" type="button" lang="' + (App.lang === 'ar' ? 'en' : 'ar') + '">' + App.tx(UI.toggle) + '</button>' +
						'</div>' +
					'</div>';
				header.querySelector('.lang-toggle').addEventListener('click', function () { App.setLang(App.lang === 'ar' ? 'en' : 'ar'); });
				header.querySelector('.theme-toggle').addEventListener('click', function () { App.setTheme(App.theme() === 'light' ? 'dark' : 'light'); });
				header.querySelector('.search-open').addEventListener('click', function () { Search.open(); });
			}
			var footer = document.getElementById('site-footer');
			if (footer) {
				footer.className = 'site-footer';
				/* one night for his three series, on one hilly horizon: Ma Wara' al-Tabi'a's castle with lit
				   windows, bare tree, old graves, a broken fence with a cat on it, bats, fog and eyes in the dark;
				   Safari's acacia, elephant and giraffe against a sunset in the shape of Africa; Fantasia's open
				   book adrift among the stars. Then his motto on a headstone, and the pocket books' last line */
				var branches = [
					['M100 230C99 196 104 162 96 128', 11], ['M97 148C80 128 58 122 36 96', 5], ['M58 120C48 108 50 92 42 76', 3],
					['M98 132C116 106 142 100 164 74', 5], ['M142 98C152 86 168 86 186 80', 3], ['M96 128C95 96 101 66 92 34', 4],
					['M94 76C80 66 74 50 68 34', 2.5], ['M97 64C110 54 118 38 126 22', 2.5], ['M40 98C30 94 22 96 12 90', 2], ['M164 74C168 60 176 54 182 44', 2]
				].map(function (b) { return '<path d="' + b[0] + '" stroke-width="' + b[1] + '"/>'; }).join('');
				var stars = [[6, 18], [11, 52], [19, 30], [24, 8], [29, 64], [38, 22], [44, 46], [51, 12], [57, 36], [63, 58], [69, 16], [74, 42], [81, 26], [86, 60], [92, 12], [96, 40]]
					.map(function (s, i) { return '<i style="inset-inline-start:' + s[0] + '%;top:' + s[1] + 'px;animation-delay:-' + (i * 0.7 % 5).toFixed(1) + 's"></i>'; }).join('');
				var book = '<svg class="ft-book" viewBox="0 0 80 40"><defs><linearGradient id="ft-pg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fbf1d2"/><stop offset="1" stop-color="#cdb98a"/></linearGradient></defs>' +
					'<path d="M40 36Q22 28 4 32V8Q22 4 40 12Z" fill="url(#ft-pg)"/><path d="M40 36Q58 28 76 32V8Q58 4 40 12Z" fill="url(#ft-pg)"/>' +
					'<g fill="none" stroke="#9c8a62" stroke-width=".8" opacity=".7"><path d="M10 13Q22 10 34 15M10 18Q22 15 34 20M10 23Q22 20 34 25"/><path d="M46 15Q58 10 70 13M46 20Q58 15 70 18M46 25Q58 20 70 23"/></g>' +
					'<path d="M40 12V36" stroke="#7d6c48" stroke-width="1"/></svg>';
				var acacia = '<svg class="ft-acacia" viewBox="0 0 200 110"><g fill="currentColor">' +
					'<path d="M96 110C97 92 98 80 94 66 88 56 74 50 60 44l2-4c14 4 26 10 34 18 2-8 4-14 0-22l4-2c4 8 4 16 2 24 8-8 22-14 38-18l1 4c-15 6-29 14-35 24-4 12-3 26-2 42Z"/>' +
					'<ellipse cx="100" cy="30" rx="88" ry="8"/><ellipse cx="58" cy="24" rx="46" ry="9"/><ellipse cx="142" cy="22" rx="50" ry="10"/><ellipse cx="100" cy="17" rx="46" ry="8"/>' +
					'<ellipse cx="34" cy="32" rx="28" ry="5"/><ellipse cx="168" cy="30" rx="28" ry="5"/></g></svg>';
				var africa = '<svg class="ft-africa" viewBox="0 0 100 110"><defs>' +
					'<linearGradient id="ft-sun" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f6c24a"/><stop offset=".55" stop-color="#ee8a2e"/><stop offset="1" stop-color="#c4501f"/></linearGradient>' +
					'<mask id="ft-bands"><rect width="100" height="110" fill="#fff"/><g fill="#000"><rect x="0" y="15" width="64" height="1.6"/><rect x="10" y="23" width="70" height="1.6"/><rect x="0" y="31" width="58" height="1.6"/><rect x="20" y="39" width="70" height="1.4"/></g></mask></defs>' +
					'<g mask="url(#ft-bands)" fill="url(#ft-sun)"><path d="M18 6 40 2 55 6 62 4 70 10 76 26 86 34 98 36 90 48 82 60 80 72 76 80 72 92 64 104 52 108 46 100 42 86 40 72 38 60 36 52 30 50 18 52 8 46 2 36 4 24 10 14Z"/>' +
					'<ellipse cx="88" cy="84" rx="3" ry="7" transform="rotate(20 88 84)"/></g></svg>';
				var elephant = '<svg class="ft-elephant" viewBox="0 0 70 56"><g fill="currentColor">' +
					'<path d="M24 20c2-10 16-12 28-10 10 2 16 10 16 20 0 6-2 10-4 12v14h-7l-1-12c-6 2-12 2-16 1v11h-7l-1-14c-4-2-7-6-8-10Z"/><circle cx="22" cy="22" r="11"/>' +
					'<path d="M14 26C8 28 6 22 6 16S8 4 4 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>' +
					'<path d="M67 30c3 6 3 12 2 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></g>' +
					'<path d="M24 14c10-2 14 8 10 18" fill="none" stroke="#2a1d14" stroke-width=".9"/>' +
					'<path d="M15 30c-4 2-6 0-7-2" fill="none" stroke="#e9dcc0" stroke-width="1.6" stroke-linecap="round" opacity=".8"/></svg>';
				var giraffe = '<svg class="ft-giraffe" viewBox="0 0 60 80"><g fill="currentColor">' +
					'<g class="neck"><path d="M24 44 12 13l6-3 14 30Z"/><ellipse cx="11" cy="11" rx="7" ry="3.4" transform="rotate(-18 11 11)"/><rect x="11" y="2" width="1.6" height="6" rx=".8"/><rect x="15" y="2" width="1.6" height="6" rx=".8"/></g>' +
					'<path d="M21 40Q36 33 51 42V52Q36 55 23 52Z"/>' +
					'<rect x="23" y="49" width="2.6" height="31" rx="1"/><rect x="28" y="50" width="2.6" height="30" rx="1"/><rect x="43" y="50" width="2.6" height="30" rx="1"/><rect x="47.5" y="49" width="2.6" height="31" rx="1"/>' +
					'<path d="M50.5 43q4 6 3 15" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></g></svg>';
				/* arched window or door: x, y, width, height */
				var arch = function (x, y, w, h, cls) { return '<path class="' + (cls || '') + '" d="M' + x + ' ' + (y + h) + 'V' + (y + w / 2) + 'a' + (w / 2) + ' ' + (w / 2) + ' 0 0 1 ' + w + ' 0V' + (y + h) + 'Z"/>'; };
				var castle = '<svg class="ft-castle" viewBox="0 0 120 130"><g fill="currentColor">' +
					'<rect x="20" y="70" width="80" height="60"/><path d="M20 70h8v-6h6v6h8v-6h6v6"/><path d="M72 70h8v-6h6v6h8v-6h6v6h0"/>' +
					'<rect x="48" y="30" width="24" height="100"/><path d="M46 30 60 0l14 30Z"/><path d="M60 0V-0" />' +
					'<rect x="14" y="50" width="18" height="80"/><path d="M12 50 23 20l11 30Z"/>' +
					'<rect x="88" y="45" width="18" height="85"/><path d="M86 45 97 14l11 31Z"/>' +
					'<rect x="34" y="60" width="10" height="70"/><path d="M33 60 39 44l6 16Z"/><rect x="76" y="60" width="10" height="70"/><path d="M75 60 81 44l6 16Z"/>' +
					/* pennants instead of crosses */
					'<path d="M97 14V6l7 2.5-7 2.5" /><path d="M23 20v-7l6 2.2-6 2.2"/></g>' +
					'<g class="ft-lit">' + arch(55, 42, 10, 14) + arch(19, 64, 7, 10, 'fl') + arch(94, 58, 6, 10) + arch(36, 84, 7, 12, 'fl2') + arch(77, 84, 7, 12) +
						'<circle cx="60" cy="80" r="3.2"/>' + arch(53, 106, 14, 24, 'fl') + '</g></svg>';
				var graves = '<svg class="ft-graves" viewBox="0 0 70 32"><g fill="currentColor">' +
					'<path d="M2 32V14a7 7 0 0 1 14 0v18Z" transform="rotate(-7 9 32)"/><path d="M24 32V10a8 8 0 0 1 16 0v22Z"/>' +
					'<path d="M48 32V17a6 6 0 0 1 12 0v15Z" transform="rotate(9 54 32)"/><rect x="60" y="26" width="10" height="6" rx="1"/></g></svg>';
				var fence = '<svg class="ft-fence" viewBox="0 0 70 34"><g fill="currentColor">' +
					'<path d="M2 34V8l3-4 3 4v26Z"/><path d="M16 34V7l3-4 3 4v27Z"/><path d="M30 34V9l3-4 3 4v25Z"/><path d="M45 34V10l3-4 3 4v24Z" transform="rotate(8 48 34)"/><path d="M59 34V7l3-4 3 4v27Z"/>' +
					'<rect x="0" y="12" width="38" height="2.6"/><rect x="0" y="24" width="66" height="2.6"/><rect x="44" y="11" width="22" height="2.6" transform="rotate(-6 55 12)"/></g></svg>';
				var cat = '<svg class="ft-cat" viewBox="0 0 40 42"><g fill="currentColor"><path d="M12 42C6 42 4 36 6 30s6-8 6-12L10 6l5 5h5l5-5-2 12c0 4 4 6 5 12 2 6-2 12-8 12Z"/>' +
					'<path d="M26 40c8 0 12-6 8-12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></g>' +
					'<g class="ft-cat-eyes" fill="#f5c542"><ellipse cx="14.6" cy="15" rx="1.4" ry="1"/><ellipse cx="20.4" cy="15" rx="1.4" ry="1"/></g></svg>';
				var pine = '<svg class="ft-pine" viewBox="0 0 50 110"><path fill="currentColor" d="M25 0 36 22h-6l12 20h-8l12 22H36l14 24H28v22h-6V88H0l14-24H4l12-22H8l12-20h-6Z"/></svg>';
				var bat = '<svg viewBox="0 0 20 10"><path fill="currentColor" d="M10 4C8 1 5 0 0 2c3 1 3 3 2 5 2-1 4-1 5 1 1-2 2-2 3-1 1-1 2-1 3 1 1-2 3-2 5-1-1-2-1-4 2-5-5-2-8-1-10 2Z"/></svg>';
				var bats = [1, 2, 3, 4, 5].map(function (i) { return '<span class="ft-bat b' + i + '">' + bat + '</span>'; }).join('');
				/* hills with grass along the top edge; the same curve sets how high each thing stands */
				var hillPts = [[0, 30], [110, 18], [220, 30], [400, 26], [600, 32], [790, 24], [1000, 28]];
				var hillY = function (x) {
					for (var k = 1; k < hillPts.length; k++) if (x <= hillPts[k][0]) {
						var a = hillPts[k - 1], b = hillPts[k], t = (x - a[0]) / (b[0] - a[0]);
						return a[1] + (b[1] - a[1]) * (1 - Math.cos(t * Math.PI)) / 2;
					}
					return 28;
				};
				var hill = 'M0 60';
				for (var hx = 0, hi = 0; hx <= 1000; hx += 4, hi++) hill += 'L' + hx + ' ' + (hillY(hx) - (hi % 3 === 0 ? 3 + (hi * 7) % 5 : 0)).toFixed(1);
				hill += 'L1000 60Z';
				footer.innerHTML =
					'<div class="ft-night" aria-hidden="true">' +
						'<span class="ft-stars">' + stars + '</span><span class="ft-shoot"></span>' +
						'<span class="ft-moon"></span>' +
						'<span class="ft-fog f1"></span><span class="ft-fog f2"></span>' +
						'<span class="ft-fantasia">' + book + '<span class="ft-sparks"><i></i><i></i><i></i><i></i><i></i><i></i></span></span>' +
						'<span class="ft-safari">' + africa + acacia + elephant + giraffe + '</span>' +
						bats + pine + castle +
						'<svg class="ft-tree" viewBox="0 0 200 230"><g fill="none" stroke="currentColor" stroke-linecap="round">' + branches + '</g></svg>' +
						graves + fence + cat +
						'<span class="ft-eyes e2"><i></i><i></i></span><span class="ft-eyes e3"><i></i><i></i></span>' +
						'<svg class="ft-hills" viewBox="0 0 1000 60" preserveAspectRatio="none"><path d="' + hill + '"/></svg>' +
					'</div>' +
					'<div class="ft-body"><div class="wrap">' +
						'<div class="ft-stone">' +
							'<span class="ft-name">' + App.L('د. أحمد خالد توفيق', 'Dr. Ahmed Khaled Tawfik') + '</span>' +
							'<div class="motto">' + App.tx(UI.motto) + '</div>' +
							'<span class="ft-dates" dir="ltr">1962 — 2018</span>' +
						'</div>' +
						'<nav class="ft-links" aria-label="' + App.L('صفحات الموقع', 'Site pages') + '">' +
							UI.nav.map(function (n) { return '<a href="' + n.href + '">' + App.esc(n[App.lang]) + '</a>'; }).join('') +
						'</nav>' +
						'<div class="ft-notes"><p>' + App.tx(UI.footerNote) + '</p>' +
							'<p><a href="' + App.esc(App.fixHref()) + '" target="_blank" rel="noopener">' + App.tx(UI.fix) + '</a></p>' +
							'<p class="ft-credits">' + App.tx(UI.credits) + '</p></div>' +
					'</div>' +
					'<p class="ft-end">' + App.L('تمّت…', 'The end…') + ' <span>' + App.L('أو هكذا يبدو', 'or so it seems') + '</span></p></div>';
			}
		},

		/* fill static [data-i18n] slots from PAGE.strings */
		fillStrings: function () {
			var s = (window.PAGE && window.PAGE.strings) || {};
			document.querySelectorAll('[data-i18n]').forEach(function (el) {
				var k = el.getAttribute('data-i18n');
				if (s[k]) el.textContent = App.t(s[k]);
			});
		},

		/* fade/rise elements with .rise when they scroll into view */
		observeRise: function () {
			var els = document.querySelectorAll('.rise:not(.in)');
			if (!('IntersectionObserver' in window)) {
				els.forEach(function (el) { el.classList.add('in'); });
				return;
			}
			if (!App._io) {
				App._io = new IntersectionObserver(function (entries) {
					entries.forEach(function (e) {
						if (e.isIntersecting) { e.target.classList.add('in'); App._io.unobserve(e.target); }
					});
				}, { rootMargin: '0px 0px -8% 0px' });
			}
			els.forEach(function (el) { App._io.observe(el); });
		},

		boot: function () {
			App.applyLang();
			App.renderChrome();
			App.fillStrings();
			if (window.PAGE && typeof window.PAGE.render === 'function') window.PAGE.render();
			App.observeRise();
			window.addEventListener('hashchange', function () {
				if (window.PAGE && window.PAGE.onHash) window.PAGE.onHash(); else App.focusHash();
			});
			document.addEventListener('keydown', function (e) {
				var tag = (e.target.tagName || '').toLowerCase();
				var typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
				if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
					e.preventDefault(); Search.open();
				}
			});
		}
	};

	/* ---------- search ---------- */

	var Search = {
		index: null,

		build: function () {
			var d = App.data(), items = [];
			var add = function (kind, title, sub, href, extra) {
				items.push({
					kind: kind, title: title, sub: sub || '', href: href,
					key: norm([title && title.ar, title && title.en].join(' ')),
					body: norm(extra || '')
				});
			};
			var both = function (o) { return o ? [o.ar, o.en].join(' ') : ''; };
			var K = {
				series: { ar: 'سلسلة', en: 'Series' }, work: { ar: 'كتاب', en: 'Book' }, issue: { ar: 'عدد', en: 'Issue' },
				character: { ar: 'شخصية', en: 'Character' }, writer: { ar: 'كاتب', en: 'Writer' }, quote: { ar: 'اقتباس', en: 'Quote' },
				legacy: { ar: 'الإرث', en: 'Legacy' }, tribute: { ar: 'قالوا عنه', en: 'Tribute' }, blog: { ar: 'المدونة', en: 'Blog' }, media: { ar: 'لقاء / مقال', en: 'Media' }
			};

			(d.series || []).forEach(function (s) { add(K.series, s.title, s.years, 'series.html?id=' + s.id, both(s.tagline) + ' ' + both(s.synopsis)); });
			(d.works || []).forEach(function (w) { add(K.work, w.title, w.year, 'book.html?id=' + w.id, both(w.synopsis)); });
			Object.keys(d.issues || {}).forEach(function (sid) {
				var s = App.byId(d.series, sid);
				(d.issues[sid] || []).forEach(function (is) {
					add(K.issue, is.title, (s ? s.title : null), App.issueHref(sid, is), String(is.n));
				});
			});
			(d.otherSeries || []).forEach(function (s) {
				add(K.series, s.title, s.owner || s.years, 'series.html?id=' + s.id, both(s.description));
				(s.issues || []).forEach(function (is, i) { add(K.issue, is.title, s.title, App.issueHref(s.id, Object.assign({ _idx: i }, is)), both(is.original)); });
			});
			(d.characters || []).forEach(function (c) { add(K.character, c.name, App.findWork(c.work) ? App.findWork(c.work).title : '', 'character.html?id=' + c.id, both(c.role) + ' ' + both(c.desc)); });
			var W = d.writers || {};
			Object.keys(W).forEach(function (k) {
				(W[k] || []).forEach(function (w, i) { add(K.writer, w.name, w.work || w.book || '', 'writers.html#wr-' + k + '-' + i, both(w.text)); });
			});
			(d.quotes || []).forEach(function (q, i) { add(K.quote, q.text, q.from, 'quotes.html#q-' + i, both(q.from)); });
			(d.legacy || []).forEach(function (l, i) { add(K.legacy, l.title, l.date, 'legacy.html#l-' + i, both(l.text)); });
			(d.tributes || []).forEach(function (p, i) { add(K.tribute, p.name, p.role, 'tributes.html#t-' + i, both(p.quote) + ' ' + both(p.context)); });
			(d.media || []).forEach(function (m, i) { add(K.media, m.title, m.outlet, 'legacy.html#m-' + i, both(m.note)); });
			/* his columns, stories and comics from the blog archive (loaded on first search) */
			((d.blog && d.blog.posts) || []).forEach(function (p) { add(K.blog, { ar: p.t, en: p.t }, { ar: p.src || p.d, en: p.src || p.d }, 'blog.html?post=' + p.id, (p.l || []).join(' ') + ' ' + (p.ex || '')); });
			Search.index = items;
		},

		query: function (q) {
			var nq = norm(q);
			if (!nq) return [];
			var terms = nq.split(' ');
			return Search.index.map(function (it) {
				var score = 0;
				for (var i = 0; i < terms.length; i++) {
					var t = terms[i];
					if (it.key.indexOf(t) >= 0) score += it.key.indexOf(t) === 0 ? 6 : 4;
					else if (it.body.indexOf(t) >= 0) score += 1;
					else return null;
				}
				if (it.key.indexOf(nq) >= 0) score += 5;
				return { it: it, score: score };
			}).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).slice(0, 40).map(function (r) { return r.it; });
		},

		open: function () {
			if (!Search.index) Search.build();
			/* the blog index is large, so pages other than the blog fetch it only when search opens */
			if (!App.data().blog && !Search.loadingBlog) {
				Search.loadingBlog = true;
				var bs = document.createElement('script');
				bs.src = 'assets/js/data-blog.js';
				bs.onload = function () {
					Search.build();
					var inp = document.querySelector('#search-dialog input');
					if (inp && inp.value.trim()) inp.dispatchEvent(new Event('input'));
				};
				document.head.appendChild(bs);
			}
			var dlg = document.getElementById('search-dialog');
			if (!dlg) {
				dlg = document.createElement('dialog');
				dlg.id = 'search-dialog';
				dlg.className = 'search-dialog';
				document.body.appendChild(dlg);
				dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
			}
			dlg.innerHTML =
				'<form method="dialog" class="search-box" role="search">' +
					'<input type="search" autocomplete="off" placeholder="' + App.L('ابحث عن كتاب، عدد، شخصية، كاتب، اقتباس، مقال…', 'Search books, issues, characters, writers, quotes, articles…') + '" aria-label="' + App.L('بحث', 'Search') + '">' +
					'<button type="submit" class="search-close" aria-label="' + App.L('إغلاق', 'Close') + '">Esc</button>' +
				'</form>' +
				'<ul class="search-results" role="listbox"></ul>' +
				'<p class="search-hint">' + App.L('اكتب للبحث — يعمل بالعربية والإنجليزية.', 'Type to search — works in Arabic and English.') + '</p>';
			var input = dlg.querySelector('input'), list = dlg.querySelector('.search-results'), hint = dlg.querySelector('.search-hint');
			var render = function () {
				var res = Search.query(input.value);
				hint.hidden = !!input.value.trim();
				if (input.value.trim() && !res.length) { list.innerHTML = '<li class="none">' + App.L('لا نتائج.', 'No results.') + '</li>'; return; }
				list.innerHTML = res.map(function (it, i) {
					var sub = typeof it.sub === 'object' ? App.t(it.sub) : App.num(it.sub);
					return '<li><a href="' + App.esc(it.href) + '"' + (i === 0 ? ' class="active"' : '') + '>' +
						'<span class="kind">' + App.tx(it.kind) + '</span>' +
						'<span class="ttl">' + App.tx(it.title) + '</span>' +
						(sub ? '<span class="sub">' + App.esc(sub) + '</span>' : '') +
					'</a></li>';
				}).join('');
			};
			input.addEventListener('input', render);
			input.addEventListener('keydown', function (e) {
				var links = [].slice.call(list.querySelectorAll('a'));
				var cur = links.findIndex(function (a) { return a.classList.contains('active'); });
				if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
					e.preventDefault();
					if (!links.length) return;
					if (cur >= 0) links[cur].classList.remove('active');
					cur = (cur + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
					links[cur].classList.add('active');
					links[cur].scrollIntoView({ block: 'nearest' });
				} else if (e.key === 'Enter') {
					e.preventDefault();
					if (cur >= 0) { dlg.close(); location.href = links[cur].href; }
				}
			});
			list.addEventListener('click', function (e) { if (e.target.closest('a')) dlg.close(); });
			dlg.showModal();
			input.focus();
		}
	};

	App.Search = Search;
	window.App = App;

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', App.boot);
	else App.boot();
})();
