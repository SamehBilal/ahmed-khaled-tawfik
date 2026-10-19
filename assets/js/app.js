/* Shared runtime: language, header/footer, helpers.
   Each page sets window.PAGE = { id, render() } before this file loads its content. */
(function () {
	'use strict';

	var STORE_KEY = 'akt-lang';

	var UI = {
		brand: { ar: 'العرّاب', en: 'The Godfather' },
		nav: [
			{ id: 'home', href: 'index.html', ar: 'الرئيسية', en: 'Home' },
			{ id: 'works', href: 'works.html', ar: 'الأعمال', en: 'Works' },
			{ id: 'characters', href: 'characters.html', ar: 'الشخصيات', en: 'Characters' },
			{ id: 'writers', href: 'writers.html', ar: 'الكُتّاب', en: 'Writers' }
		],
		toggle: { ar: 'English', en: 'العربية' },
		motto: { ar: 'اجعلهم يقرؤون', en: 'Make them read' },
		footerNote: {
			ar: 'موقع محبّين غير رسمي، صُنع تقديرًا لأحمد خالد توفيق (١٩٦٢–٢٠١٨). البيانات مجمّعة من مصادر عامة — راجع صفحة الكُتّاب للمراجع.',
			en: 'An unofficial fan tribute to Ahmed Khaled Tawfik (1962–2018). Data compiled from public sources — see the Writers page for references.'
		},
		credits: {
			ar: 'تصميم الكتب ثلاثية الأبعاد مبني على عروض Codrops — خط The Godfather من تصميم Jeff Bell.',
			en: '3D book designs built on Codrops demos — "The Godfather" font by Jeff Bell.'
		}
	};

	function getLang() {
		var l = null;
		try { l = localStorage.getItem(STORE_KEY); } catch (e) {}
		return l === 'en' ? 'en' : 'ar';
	}

	var App = {
		lang: getLang(),
		UI: UI,

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
		paras: function (o) {
			return App.t(o).split(/\n\s*\n/).filter(Boolean).map(function (p) {
				return '<p>' + App.esc(p.trim()) + '</p>';
			}).join('');
		},
		num: function (n) {
			if (n == null || n === '') return '';
			return App.lang === 'ar' ? String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }) : String(n);
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
			return App.byId(d.series, id) || App.byId(d.works, id);
		},

		setLang: function (l) {
			App.lang = l;
			try { localStorage.setItem(STORE_KEY, l); } catch (e) {}
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

		renderChrome: function () {
			var pageId = (window.PAGE && window.PAGE.id) || '';
			var header = document.getElementById('site-header');
			if (header) {
				header.className = 'site-header';
				header.innerHTML =
					'<div class="wrap">' +
						'<a class="brand" href="index.html"><span class="brand-ar">العرّاب</span><span class="brand-en">The Godfather</span></a>' +
						'<nav class="nav" aria-label="' + (App.lang === 'ar' ? 'التنقل الرئيسي' : 'Main') + '">' +
							UI.nav.map(function (n) {
								return '<a href="' + n.href + '"' + (n.id === pageId ? ' aria-current="page"' : '') + '>' + App.esc(n[App.lang]) + '</a>';
							}).join('') +
						'</nav>' +
						'<button class="lang-toggle" type="button" lang="' + (App.lang === 'ar' ? 'en' : 'ar') + '">' + App.tx(UI.toggle) + '</button>' +
					'</div>';
				header.querySelector('.lang-toggle').addEventListener('click', function () {
					App.setLang(App.lang === 'ar' ? 'en' : 'ar');
				});
			}
			var footer = document.getElementById('site-footer');
			if (footer) {
				footer.className = 'site-footer';
				footer.innerHTML =
					'<div class="wrap">' +
						'<div><div class="motto">' + App.tx(UI.motto) + '</div><div>' + App.tx(UI.footerNote) + '</div></div>' +
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
		}
	};

	window.App = App;

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', App.boot);
	else App.boot();
})();
