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
		/* the publishers directory, linked from the footer and the home page, not the header */
		more: [
			{ href: 'publishers.html', ar: 'دور النشر', en: 'Publishers' }
		],
		/* pages linked only from the footer, not the header */
		legal: [
			{ href: 'about.html', ar: 'عن الموقع', en: 'About' },
			{ href: 'sources.html', ar: 'المصادر وطريقة الجمع', en: 'Sources & method' },
			{ href: 'privacy.html', ar: 'الخصوصية', en: 'Privacy' },
			{ href: 'terms.html', ar: 'حقوق الاستخدام', en: 'Rights & use' },
			{ href: 'contact.html', ar: 'تواصل', en: 'Contact' }
		],
		fix: { ar: 'وجدت خطأً أو لديك إضافة؟ اقترح تصحيحًا ↗', en: 'Spotted a mistake or have an addition? Suggest a correction ↗' },
		/* the footer's last column: who made the site (the notes and credits live on about.html) */
		maker: {
			line: { ar: 'موقع محبّين غير رسمي، صُنع تقديرًا لأحمد خالد توفيق <span style="white-space:nowrap">(1962–2018)</span>. البيانات مجمّعة من مصادر عامة — راجع <a href="sources.html">صفحة المصادر</a>.', en: 'An unofficial fan tribute to Ahmed Khaled Tawfik <span style="white-space:nowrap">(1962–2018)</span>. Data compiled from public sources — see the <a href="sources.html">Sources page</a>.' },
			email: 'sameh.bilal@outlook.com',
			github: 'https://github.com/SamehBilal',
			portfolio: 'https://samehbilal.github.io/portfolio/',
			whatsapp: 'https://wa.me/201064444286'
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
		/* only the leads (main: true) have a page of their own; anyone else is their card on the characters page */
		charHasPage: function (id) { var c = App.byId(App.data().characters, id); return !!(c && c.main); },
		charHref: function (id) { return App.charHasPage(id) ? 'character.html?id=' + encodeURIComponent(id) : 'characters.html#c-' + encodeURIComponent(id); },
		workLink: function (id) {
			var w = App.findWork(id);
			return w ? '<a href="' + App.workHref(id) + '">' + App.tx(w.title) + '</a>' : '';
		},
		charLink: function (id) {
			var c = App.byId(App.data().characters, id);
			if (!c) return '';
			return c.main ? '<a href="' + App.charHref(id) + '">' + App.tx(c.name) + '</a>' : '<span class="char-plain">' + App.tx(c.name) + '</span>';
		},
		/* scroll to #hash after a render, and let the page react (open / flip) */
		/* a picture full size in a dialog, with its caption (the home timeline, a book's back cover) */
		showPic: function (src, alt) {
			var e = App.esc, dlg = document.getElementById('pic-dialog');
			if (!dlg) {
				dlg = document.createElement('dialog');
				dlg.id = 'pic-dialog';
				dlg.className = 'pic-dialog';
				document.body.appendChild(dlg);
				dlg.addEventListener('click', function (x) { if (x.target === dlg || x.target.closest('.close')) dlg.close(); });
				dlg.addEventListener('close', function () { dlg.innerHTML = ''; });
			}
			dlg.innerHTML = '<figure><img src="' + e(src) + '" alt="' + e(alt || '') + '">' + (alt ? '<figcaption>' + e(alt) + '</figcaption>' : '') + '</figure>' +
				'<button type="button" class="close" aria-label="' + e(App.L('إغلاق', 'Close')) + '">×</button>';
			dlg.showModal();
		},

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
						/* the phone menu's button stands just before the brand (hidden on wider screens) */
						'<button class="icon-btn menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="' + App.L('القائمة', 'Menu') + '">' +
							'<span class="stack" aria-hidden="true"><i></i><i></i><i></i></span>' +
						'</button>' +
						'<a class="brand" href="index.html"><span class="brand-ar">العرّاب</span><span class="brand-en">The Godfather</span></a>' +
						'<nav class="nav" id="site-nav" aria-label="' + App.L('التنقل الرئيسي', 'Main') + '" data-title="' + App.L('الفهرس', 'Contents') + '">' +
							UI.nav.map(function (n, i) {
								/* the empty span is the dotted leader to the page number in the phone menu */
								return '<a href="' + n.href + '" style="--i:' + i + '"' + (n.id === pageId ? ' aria-current="page"' : '') + '>' + App.esc(n[App.lang]) + '<span aria-hidden="true"></span></a>';
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
				/* the phone menu: opens and closes on its button, and closes on a link, Escape, a tap outside the header,
				   or when the screen grows past the phone layout */
				var setMenu = function (open) {
					header.classList.toggle('menu-open', open);
					header.querySelector('.menu-btn').setAttribute('aria-expanded', String(open));
				};
				header.querySelector('.menu-btn').addEventListener('click', function () { setMenu(!header.classList.contains('menu-open')); });
				header.querySelector('.nav').addEventListener('click', function (ev) { if (ev.target.closest('a')) setMenu(false); });
				if (!header.dataset.menuWired) {
					header.dataset.menuWired = '1';
					document.addEventListener('keydown', function (ev) {
						if (ev.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); header.querySelector('.menu-btn').focus(); }
					});
					document.addEventListener('click', function (ev) { if (!header.contains(ev.target)) setMenu(false); });
					var mq = window.matchMedia('(max-width: 760px)');
					(mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () { setMenu(false); });
				}
				header.querySelector('.lang-toggle').addEventListener('click', function () { App.setLang(App.lang === 'ar' ? 'en' : 'ar'); });
				header.querySelector('.theme-toggle').addEventListener('click', function () { App.setTheme(App.theme() === 'light' ? 'dark' : 'light'); });
				header.querySelector('.search-open').addEventListener('click', function () { Search.open(); });
			}
			var footer = document.getElementById('site-footer');
			if (footer) {
				footer.className = 'site-footer';
				/* one night for his three series, on one hilly horizon: Ma Wara' al-Tabi'a's haunted hill (a castle
				   with lit windows, a path, bare trees, old graves and a fence — from Vecteezy), bats, fog and eyes
				   in the dark; Safari's savanna (Vecteezy) against a sunset in the shape of Africa; Fantasia's open
				   book adrift among the stars. Then his motto on a headstone, and the pocket books' last line */
				var stars = [[6, 18], [11, 52], [19, 30], [24, 8], [29, 64], [38, 22], [44, 46], [51, 12], [57, 36], [63, 58], [69, 16], [74, 42], [81, 26], [86, 60], [92, 12], [96, 40]]
					.map(function (s, i) { return '<i style="inset-inline-start:' + s[0] + '%;top:' + s[1] + 'px;animation-delay:-' + (i * 0.7 % 5).toFixed(1) + 's"></i>'; }).join('');
				var book = '<svg class="ft-book" viewBox="0 0 80 40"><defs><linearGradient id="ft-pg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fbf1d2"/><stop offset="1" stop-color="#cdb98a"/></linearGradient></defs>' +
					'<path d="M40 36Q22 28 4 32V8Q22 4 40 12Z" fill="url(#ft-pg)"/><path d="M40 36Q58 28 76 32V8Q58 4 40 12Z" fill="url(#ft-pg)"/>' +
					'<g fill="none" stroke="#9c8a62" stroke-width=".8" opacity=".7"><path d="M10 13Q22 10 34 15M10 18Q22 15 34 20M10 23Q22 20 34 25"/><path d="M46 15Q58 10 70 13M46 20Q58 15 70 18M46 25Q58 20 70 23"/></g>' +
					'<path d="M40 12V36" stroke="#7d6c48" stroke-width="1"/></svg>';
				var africa = '<svg class="ft-africa" viewBox="0 0 100 110"><defs>' +
					'<linearGradient id="ft-sun" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#b4c86a"/><stop offset=".55" stop-color="#86a045"/><stop offset="1" stop-color="#5a6b2a"/></linearGradient>' +
					'<mask id="ft-bands"><rect width="100" height="110" fill="#fff"/><g fill="#000"><rect x="0" y="15" width="64" height="1.6"/><rect x="10" y="23" width="70" height="1.6"/><rect x="0" y="31" width="58" height="1.6"/><rect x="20" y="39" width="70" height="1.4"/></g></mask></defs>' +
					'<g mask="url(#ft-bands)" fill="url(#ft-sun)"><path d="M18 6 40 2 55 6 62 4 70 10 76 26 86 34 98 36 90 48 82 60 80 72 76 80 72 92 64 104 52 108 46 100 42 86 40 72 38 60 36 52 30 50 18 52 8 46 2 36 4 24 10 14Z"/>' +
					'<ellipse cx="88" cy="84" rx="3" ry="7" transform="rotate(20 88 84)"/></g></svg>';
				var bat = '<svg viewBox="0 0 20 10"><path fill="currentColor" d="M10 4C8 1 5 0 0 2c3 1 3 3 2 5 2-1 4-1 5 1 1-2 2-2 3-1 1-1 2-1 3 1 1-2 3-2 5-1-1-2-1-4 2-5-5-2-8-1-10 2Z"/></svg>';
				/* the bats: after Calleb's CodePen "Halloween" (codepen.io/Calleb/pen/vYZqgwz, MIT) —
				   three of them, wings flapping, eyes glowing, each on its own flight path */
				var penBat = function (k) {
					return '<g class="pb pb' + k + '">' +
						'<path d="M306.9,145.4l-7.3,7.3l-7.3-7.3c-0.6-0.6-1.6-0.2-1.6,0.6v7.9h7.6h2.5h7.6V146C308.5,145.2,307.5,144.8,306.9,145.4z"/>' +
						'<path class="pb-w" d="M408.4,167.5c-3.3-2.7-7.6-4.4-12.2-4.4c-9.3,0-17.1,6.6-18.9,15.4c-2.8-1.6-6.1-2.5-9.6-2.5c-8.5,0-15.7,5.5-18.3,13.1c-3-6.6-9.7-11.3-17.5-11.3c-7.7,0-14.4,4.6-17.5,11.1c-6.9-4.7-11-10.7-11-17.1c0-2.4,0.6-4.7,1.6-6.9c0.2,0,0.4,0,0.7,0c24.7,0,45.4-9,51.2-21.1C383,144.1,404.5,154.3,408.4,167.5z"/>' +
						'<path class="pb-w1" d="M191.6,167.5c3.3-2.7,7.6-4.4,12.2-4.4c9.3,0,17.1,6.6,18.9,15.4c2.8-1.6,6.1-2.5,9.6-2.5c8.5,0,15.7,5.5,18.3,13.1c3-6.6,9.7-11.3,17.5-11.3c7.7,0,14.4,4.6,17.5,11.1c6.9-4.7,11-10.7,11-17.1c0-2.4-0.6-4.7-1.6-6.9c-0.2,0-0.4,0-0.7,0c-24.7,0-45.4-9-51.2-21.1C217,144.1,195.5,154.3,191.6,167.5z"/>' +
						'<path d="M312.3,158.2c0,5.2-6,27.3-12.9,27.3c-7,0-12.3-22.1-12.3-27.3s5.7-9.5,12.6-9.5C306.6,148.8,312.3,153,312.3,158.2z"/>' +
						'<ellipse class="pb-eye" cx="295.2" cy="161.8" rx="1.5" ry="3"/><ellipse class="pb-eye" cx="304.2" cy="161.8" rx="1.5" ry="3"/>' +
					'</g>';
				};
				var bats = '<svg class="ft-bats" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">' + penBat(0) + penBat(1) + penBat(2) + '</svg>';
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
						/* Fantasia's sky: a big moon with a witch on her broom crossing it (from a Vecteezy Halloween
						   scene, free licence), and a flying saucer with its beam */
						/* the three worlds, each in its own zone: on wide screens a zone covers the whole scene, below 1200px each takes its side */
						'<div class="ft-zone z-fantasy">' +
						'<span class="ft-luna"><span class="ft-moon"></span><img class="ft-witch" src="assets/img/footer/witch.webp" alt="" loading="lazy"></span>' +
						/* Fantasia's citadel on its hill: a black silhouette like the rest, lilac windows, a violet rim from the moon */
						'<svg class="ft-citadel" viewBox="0 0 200 180" aria-hidden="true"><defs><linearGradient id="citStone" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#1c1030"/><stop offset=".35" stop-color="#0b0614"/><stop offset="1" stop-color="#050309"/></linearGradient></defs><path d="M0 180c18-30 52-46 100-48s84 18 100 48z" fill="#050507"/><g fill="url(#citStone)" stroke="#2a1848" stroke-opacity=".55" stroke-width="1" stroke-linejoin="round"><path d="M58 140v-38h84v38z"/><path d="M58 102v-7h7v7h7v-7h7v7h7v-7h7v7h6v-7h7v7h7v-7h7v7h7v-7h7v7h7v-7h6v7"/><path d="M40 142V78h22v64z"/><path d="M36 78l15-40 15 40z"/><path d="M138 142V86h22v56z"/><path d="M134 86l15-34 15 34z"/><path d="M80 142V52h40v90z"/><path d="M74 52l26-50 26 50z"/><path d="M66 102V72h12v30z"/><path d="M63 72l9-18 9 18z"/><path d="M122 102V74h12v28z"/><path d="M119 74l9-17 9 17z"/></g><g fill="#050309"><path d="M100 2v-8l9 3-9 3"/><path d="M51 38v-7l7 2.5-7 2.5"/><path d="M149 52v-7l7 2.5-7 2.5"/></g><path d="M100 2v-9M51 38v-8M149 52v-8" stroke="#050309" stroke-width="1.2"/><g class="cit-lit" fill="#d9c4ff"><path class="fl" d="M94 142v-14a6 6 0 0 1 12 0v14z"/><path d="M96 76v-8a4 4 0 0 1 8 0v8z"/><path class="fl2" d="M96 100v-8a4 4 0 0 1 8 0v8z"/><path d="M48 100v-7a3 3 0 0 1 6 0v7z"/><path class="fl" d="M48 122v-7a3 3 0 0 1 6 0v7z"/><path class="fl2" d="M146 106v-7a3 3 0 0 1 6 0v7z"/><path d="M146 126v-7a3 3 0 0 1 6 0v7z"/><path d="M70 90v-6a2 2 0 0 1 4 0v6z"/><path d="M126 92v-6a2 2 0 0 1 4 0v6z"/></g></svg>' +
						'<svg class="ft-ufo" viewBox="0 0 160 210" aria-hidden="true"><defs>' +
							'<linearGradient id="ufoBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfa0f0" stop-opacity=".45"/><stop offset="1" stop-color="#cdb0ff" stop-opacity="0"/></linearGradient>' +
							'<radialGradient id="ufoDome" cx=".42" cy=".35" r=".7"><stop offset="0" stop-color="#cdb6f0"/><stop offset="1" stop-color="#3c2566"/></radialGradient></defs>' +
							'<path class="ufo-beam" d="M64 54h32l46 156H18z" fill="url(#ufoBeam)"/>' +
							'<ellipse cx="80" cy="38" rx="25" ry="21" fill="url(#ufoDome)"/>' +
							'<ellipse cx="80" cy="47" rx="74" ry="14" fill="#0b0614" stroke="#7a5ab8" stroke-opacity=".55" stroke-width="1.4"/>' +
							'<ellipse cx="80" cy="44" rx="58" ry="7" fill="#160c28"/>' +
							'<ellipse cx="80" cy="56" rx="20" ry="5" fill="#bfa0f0"/>' +
							'<g class="ufo-lights" fill="#ecdcff"><ellipse cx="28" cy="49" rx="5" ry="2.4"/><ellipse cx="50" cy="53" rx="6" ry="2.6"/><ellipse cx="80" cy="54.5" rx="6" ry="2.6"/><ellipse cx="110" cy="53" rx="6" ry="2.6"/><ellipse cx="132" cy="49" rx="5" ry="2.4"/></g>' +
						'</svg>' +
						'<span class="ft-fantasia">' + book + '<span class="ft-sparks"><i></i><i></i><i></i><i></i><i></i><i></i></span></span>' +
						'</div>' +
						'<span class="ft-fog f1"></span><span class="ft-fog f2"></span>' +
						/* Safari: the savanna from Vecteezy (free licence, credited below) in front of the Africa-shaped sunset */
						'<div class="ft-zone z-safari"><span class="ft-safari">' + africa + '<img class="ft-savanna" src="assets/img/footer/savanna.webp" alt="" loading="lazy">' +
							'<span class="ft-lamp" aria-hidden="true"><i class="beam"></i></span></span></div>' +
						'<div class="ft-zone z-horror"><img class="ft-haunt" src="assets/img/footer/haunted-hill.webp" alt="" loading="lazy">' + bats +
						'<span class="ft-eyes e2"><i></i><i></i></span><span class="ft-eyes e3"><i></i><i></i></span></div>' +
						'<svg class="ft-hills" viewBox="0 0 1000 60" preserveAspectRatio="none"><path d="' + hill + '"/></svg>' +
					'</div>' +
					'<div class="ft-body"><div class="wrap">' +
						'<div class="ft-stone">' +
							/* the headstone itself, drawn after the two pictures sent in (no cross, bats or trees) */
							'<svg class="ft-stone-art" viewBox="0 0 260 320" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="stoneFace" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4a4d"/><stop offset=".45" stop-color="#2c2c30"/><stop offset="1" stop-color="#17171a"/></linearGradient><linearGradient id="stoneSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b1b1e"/><stop offset="1" stop-color="#0c0c0e"/></linearGradient><linearGradient id="stoneBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3e"/><stop offset="1" stop-color="#18181b"/></linearGradient><radialGradient id="stoneMoss" cx=".5" cy="1" r=".6"><stop offset="0" stop-color="#4f6a3a" stop-opacity=".55"/><stop offset="1" stop-color="#4f6a3a" stop-opacity="0"/></radialGradient></defs><path d="M30 248V104C30 44 74 14 130 14s100 30 100 90v42l-9 7 6 12-12 10 9 15-7 9 6 13-9 8 8 14v24Z" fill="url(#stoneFace)" stroke="#050507" stroke-width="3" stroke-linejoin="round"/><path d="M30 248V104C30 60 52 30 86 20 56 38 42 66 42 104v144Z" fill="url(#stoneSide)" opacity=".85"/><path d="M46 236V108c0-48 36-78 84-78s84 30 84 78v34" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/><path d="M47 236V108c0-47 35-77 83-77s83 30 83 77v34" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="1"/><path d="M150 16l-6 22 8 14-10 20 6 16-9 18" fill="none" stroke="#050507" stroke-width="2" stroke-linecap="round"/><path d="M151 17l-6 22 8 14-10 20 6 16-9 18" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="1"/><path d="M70 248l6-14-4-10 7-12" fill="none" stroke="#050507" stroke-width="1.6" stroke-linecap="round"/><path d="M20 248h220v18H20z" fill="url(#stoneBase)" stroke="#050507" stroke-width="3" stroke-linejoin="round"/><path d="M8 264h244v22H8z" fill="url(#stoneBase)" stroke="#050507" stroke-width="3" stroke-linejoin="round"/><path d="M10 266h240" stroke="#fff" stroke-opacity=".07"/><ellipse cx="130" cy="262" rx="120" ry="16" fill="url(#stoneMoss)"/><g fill="#2b2b2f" stroke="#050507" stroke-width="2" stroke-linejoin="round"><path d="M36 292l38-10 34 9-36 12z"/><path d="M150 288l44-12 40 10-42 14z"/><path d="M118 300l18-6 14 5-17 7z"/></g><path d="M48 291l20-5M164 288l26-7" stroke="#fff" stroke-opacity=".1"/><g fill="#3c3c41" stroke="#050507" stroke-width="1.4"><circle cx="20" cy="298" r="4"/><circle cx="104" cy="306" r="3"/><circle cx="242" cy="300" r="5"/><circle cx="226" cy="310" r="3"/><circle cx="60" cy="310" r="2.6"/><circle cx="196" cy="310" r="2.4"/></g><g fill="none" stroke="#0a0a0c" stroke-width="2" stroke-linecap="round"><path d="M4 286c2-10 6-16 10-20M10 287c0-8 2-14 6-18M246 286c1-9-1-15-4-20M252 288c2-8 1-13-1-17M22 285c1-6 4-10 7-12M234 286c0-6-2-10-5-13"/></g></svg>' +
							'<span class="ft-name">' + App.L('د. أحمد خالد توفيق', 'Dr. Ahmed Khaled Tawfik') + '</span>' +
							'<div class="motto">' + App.tx(UI.motto) + '</div>' +
							'<span class="ft-dates" dir="ltr">1962 — 2018</span>' +
						'</div>' +
						'<nav class="ft-links" aria-label="' + App.L('صفحات الموقع', 'Site pages') + '">' +
							UI.nav.concat(UI.more).map(function (n) { return '<a href="' + n.href + '">' + App.esc(n[App.lang]) + '</a>'; }).join('') +
						'</nav>' +
						'<nav class="ft-legal" aria-labelledby="ft-legal-h"><h2 id="ft-legal-h">' + App.L('خلف الكواليس', 'Behind the site') + '</h2>' +
							UI.legal.map(function (n) { return '<a href="' + n.href + '">' + App.esc(n[App.lang]) + '</a>'; }).join('') +
						'</nav>' +
						'<div class="ft-maker">' +
							'<p class="ft-maker-line">' + App.t(UI.maker.line) + '</p>' +
							'<div class="ft-maker-links">' +
								'<a href="mailto:' + UI.maker.email + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.4" d="M1.5 3.5h13v9h-13zM1.5 3.5l6.5 5.5 6.5-5.5"/></svg>' + App.L('Email me', 'Email me') + '</a>' +
								'<a class="wa" href="' + UI.maker.whatsapp + '" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M13.6 2.3A7.9 7.9 0 0 0 1.1 11.8L0 16l4.3-1.1a7.9 7.9 0 0 0 3.8 1A7.9 7.9 0 0 0 13.6 2.3M8 14.5a6.6 6.6 0 0 1-3.3-.9l-.3-.2-2.5.7.7-2.5-.2-.3A6.6 6.6 0 1 1 8 14.5m3.6-4.9c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.5.1l-.6.8c-.1.1-.2.2-.4.1a5.4 5.4 0 0 1-2.7-2.3c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.6-1.5c-.2-.4-.3-.3-.5-.3h-.4a.8.8 0 0 0-.6.3 2.4 2.4 0 0 0-.7 1.8 4.2 4.2 0 0 0 .9 2.2 9.6 9.6 0 0 0 3.7 3.2c1.4.6 1.9.6 2.6.5a2.2 2.2 0 0 0 1.4-1c.2-.5.2-.9.1-1z"/></svg>WhatsApp</a>' +
								'<a href="' + UI.maker.github + '" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>GitHub</a>' +
								'<a href="' + UI.maker.portfolio + '" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.4" d="M1.5 5.5h13v8h-13zM5.5 5.5v-2h5v2M1.5 9h13"/></svg>' + 'Portfolio</a>' +
							'</div>' +
							/* the copyright line from Sameh Bilal's portfolio, with its ASCII owl (App.owl) */
							(App.lang === 'ar'
								? '<p class="ft-copy is-ar" dir="rtl">حقوق النشر @2026، <span class="ascii owl" aria-hidden="true">,___,\n[o,o]\n/)__)\n~"--"~</span>' +
									'<span class="visually-hidden">بومة متحركة للزينة تدل على نشاط الموقع</span>جميع الحقوق محفوظة. ' +
									'<span>صُنع بـ <span style="color: #F9812E;">🧡</span> سامح بلال</span></p>'
								: '<p class="ft-copy" dir="ltr">Copyright @2026, <span class="ascii owl" aria-hidden="true">,___,\n[o,o]\n/)__)\n~"--"~</span>' +
									'<span class="visually-hidden">Decorative owl animation indicating site activity</span>All Rights Reserved. ' +
									'<span>Crafted with <span style="color: #F9812E;">🧡</span> Sameh Bilal</span></p>') +
						'</div>' +
					'</div>' +
					'<p class="ft-end">' + App.L('تمّت…', 'The end…') + ' <span>' + App.L('أو هكذا يبدو', 'or so it seems') + '</span></p></div>';
			}
			App.owl();
		},

		/* the footer owl, after Sameh Bilal's portfolio: it blinks while idle, wakes under the pointer,
		   glances when the page scrolls; one timer for the whole page, whichever owl is on it now */
		owl: function () {
			var F = {
				idle: [',___,\n[o,o]\n/)__)\n~"--"~', ',___,\n[o,-]\n/)__)\n~"--"~', ',___,\n[-,o]\n/)__)\n~"--"~'],
				scroll: [',___,\n[o,o]\n<(__)\n~"--"~', ',___,\n[o,o]\n/)__>\n~"--"~']
			};
			var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			var get = function () { return document.querySelector('.site-footer .owl'); };
			var o = App._owl;
			if (!o) {
				o = App._owl = { timer: null, last: 0 };
				o.play = function (set, speed, once) {
					clearInterval(o.timer);
					var i = 0;
					o.timer = setInterval(function () {
						var el = get();
						if (!el) return;
						el.textContent = set[i++];
						if (i >= set.length) { if (once) o.idle(); else i = 0; }
					}, speed);
				};
				o.idle = function () { if (!still) o.play(F.idle, 1400); };
				window.addEventListener('scroll', function () {
					var now = Date.now();
					if (still || now - o.last < 1200) return;
					o.last = now;
					o.play(F.scroll, 200, true);
				}, { passive: true });
				document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(o.timer); else o.idle(); });
			}
			var el = get();
			if (!el) return;
			el.addEventListener('mouseenter', function () { if (!still) o.play(F.idle, 300); });
			el.addEventListener('mouseleave', o.idle);
			o.idle();
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

		/* a row of covers that runs past the page gets previous / next buttons at its ends, a page of covers at a time;
		   they hide when the row fits and dim at either end (in Arabic the row runs right to left). Rows already done are skipped. */
		carousels: function (root) {
			(root || document).querySelectorAll('.cover-row').forEach(function (row) {
				if (row.parentNode && row.parentNode.classList.contains('row-car')) return;
				var box = document.createElement('div');
				box.className = 'row-car';
				row.parentNode.insertBefore(box, row);
				box.appendChild(row);
				var rtl = getComputedStyle(row).direction === 'rtl';
				var btn = function (dir, label, glyph) {
					var b = document.createElement('button');
					b.type = 'button';
					b.className = 'row-car-btn row-car-' + dir;
					b.setAttribute('aria-label', label);
					/* the arrow in a span of its own, set left to right, so right-to-left text doesn't mirror it */
					var g = document.createElement('span');
					g.setAttribute('aria-hidden', 'true');
					g.textContent = glyph;
					b.appendChild(g);
					b.addEventListener('click', function () {
						var step = Math.max(row.clientWidth * 0.85, 140) * (dir === 'next' ? 1 : -1) * (rtl ? -1 : 1);
						row.scrollBy({ left: step, behavior: 'smooth' });
					});
					box.appendChild(b);
					return b;
				};
				var prev = btn('prev', App.L('السابق', 'Previous'), rtl ? '›' : '‹');
				var next = btn('next', App.L('التالي', 'Next'), rtl ? '‹' : '›');
				var update = box._upd = function () {
					var max = row.scrollWidth - row.clientWidth, at = Math.abs(row.scrollLeft);
					box.classList.toggle('is-scrollable', max > 4);
					prev.disabled = at <= 4;
					next.disabled = at >= max - 4;
				};
				row.addEventListener('scroll', update, { passive: true });
				update();
				/* covers load lazily, so measure again once they have */
				setTimeout(update, 600);
			});
		},

		boot: function () {
			App.applyLang();
			App.renderChrome();
			App.fillStrings();
			if (window.PAGE && typeof window.PAGE.render === 'function') window.PAGE.render();
			App.observeRise();
			/* rows of covers show their scrollbar only while they are being scrolled */
			document.addEventListener('scroll', function (ev) {
				var el = ev.target;
				if (!el.classList || !el.classList.contains('cover-row')) return;
				el.classList.add('is-scrolling');
				clearTimeout(el._sbt);
				el._sbt = setTimeout(function () { el.classList.remove('is-scrolling'); }, 900);
			}, true);
			/* rows of covers become carousels, now and whenever a page draws new ones */
			App.carousels(document);
			var pend = 0;
			new MutationObserver(function () { if (!pend) pend = setTimeout(function () { pend = 0; App.carousels(document); }, 60); })
				.observe(document.body, { childList: true, subtree: true });
			window.addEventListener('resize', function () { document.querySelectorAll('.row-car').forEach(function (b) { if (b._upd) b._upd(); }); });
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
				legacy: { ar: 'الإرث', en: 'Legacy' }, tribute: { ar: 'قالوا عنه', en: 'Tribute' }, blog: { ar: 'المدونة', en: 'Blog' }, media: { ar: 'لقاء / مقال', en: 'Media' },
				about: { ar: 'كتاب عنه', en: 'Book about him' }, near: { ar: 'كتاب من حوله', en: 'Related book' }, publisher: { ar: 'دار نشر', en: 'Publisher' },
				award: { ar: 'جائزة', en: 'Award' }, audio: { ar: 'مسموع', en: 'Audio' }
			};
			var S = window.WorksShared;

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
			(d.characters || []).forEach(function (c) { add(K.character, c.name, App.findWork(c.work) ? App.findWork(c.work).title : '', App.charHref(c.id), both(c.role) + ' ' + both(c.desc)); });
			/* each writer once, on their own page (as people.js names it), with every work they share with him */
			var W = d.writers || {}, people = {};
			var slugOf = function (name) {
				return String((name && name.en) || '').replace(/^Dr\.\s*/, '').toLowerCase()
					.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'writer';
			};
			Object.keys(W).forEach(function (k) {
				(W[k] || []).forEach(function (w) {
					var id = slugOf(w.name), p = people[id] = people[id] || { name: w.name, work: w.work || w.book || '', body: [] };
					p.body.push(both(w.work), both(w.book), both(w.text));
				});
			});
			Object.keys(people).forEach(function (id) { var p = people[id]; add(K.writer, p.name, p.work, 'writer.html?id=' + encodeURIComponent(id), p.body.join(' ')); });
			/* the other writers' books with his words or dedicated to him, and the books about him: each has its page */
			if (S && S.entryBooks) S.entryBooks().forEach(function (x) { add(K.near, x.w.book, x.w.name, S.bookHref(x.id), both(x.w.text)); });
			(d.aboutBooks || []).forEach(function (b) { add(K.about, b.title, b.by, 'book.html?id=' + encodeURIComponent(b.id), both(b.by) + ' ' + both(b.publisher)); });
			if (S && S.publishers) S.publishers().forEach(function (x) { var p = x.p || x; add(K.publisher, p.name, p.city || '', 'publisher.html?id=' + encodeURIComponent(p.id), both(p.note) + ' ' + both(p.about)); });
			(d.awards || []).forEach(function (a) { add(K.award, a.title, a.year, a.work ? 'book.html?id=' + encodeURIComponent(a.work) : 'works.html#awards-section', both(a.text)); });
			/* the Audio page's own rows: Eslam Adel's readings, the After Midnight programme, its later seasons and their episodes */
			var au = d.audio || {};
			if (au.youtube && au.youtube.eslamAdel) au.youtube.eslamAdel.eps.forEach(function (ep) { add(K.audio, ep[2], { ar: 'بصوت إسلام عادل', en: 'Read by Eslam Adel' }, 'audio.html', 'بصوت إسلام عادل Eslam Adel YouTube'); });
			(au.midnight || []).forEach(function (m) { add(K.audio, { ar: m[0], en: m[0] }, { ar: 'بعد منتصف الليل', en: 'After Midnight' }, 'audio.html', 'audiohat'); });
			(au.seasons || []).forEach(function (se) {
				add(K.audio, { ar: 'بعد منتصف الليل — الموسم ' + se.n, en: 'After Midnight — season ' + se.n }, { ar: String(se.year || ''), en: String(se.year || '') }, 'audio.html',
					se.eps.map(function (ep) { return ep[2] || ''; }).join(' '));
			});
			if (au.midnightSpoofs) add(K.audio, au.midnightSpoofs.title, { ar: au.midnightSpoofs.years || '', en: au.midnightSpoofs.years || '' }, 'audio.html', 'audiohat');
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
