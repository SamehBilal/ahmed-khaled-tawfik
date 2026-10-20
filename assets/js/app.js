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
		issueHref: function (sid, is) { if (is._special) return 'book.html?id=' + sid + '-s' + is.n; return 'book.html?id=' + sid + '-' + (is.n != null ? is.n : 'x' + (is._idx || 0)) + (is.part ? '-' + is.part : ''); },
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
				footer.innerHTML =
					'<div class="wrap">' +
						'<div><div class="motto">' + App.tx(UI.motto) + '</div><div>' + App.tx(UI.footerNote) + '</div>' +
							'<div style="margin-top:8px"><a href="' + App.esc(App.fixHref()) + '" target="_blank" rel="noopener">' + App.tx(UI.fix) + '</a></div></div>' +
						'<div style="max-width:420px">' + App.tx(UI.credits) + '</div>' +
					'</div>';
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
