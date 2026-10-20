/* Works page — bookshelf hero (GSAP + SplitType).
   Adapted from a CodePen "book cover effect" shelf. His novels stand as covers with the
   series as spines between them; hovering (or focusing) one brings it forward, shows its
   title huge behind the shelf and animates its description in line by line.
   Covers and spines are links: on touch screens the first tap selects, the second opens. */
(function () {
	'use strict';

	function render(root) {
		var App = window.App, d = App.data(), S = window.WorksShared, e = App.esc, t = App.t, tx = App.tx, L = App.L;
		if (!root || !S) return;
		var info = d.bookInfo || {};
		var W = function (id) { return App.byId(d.works, id); };
		var ser = function (id) { return App.byId(d.series, id); };

		/* covers and spines alternate; the first three are what phones show */
		var lineup = [
			{ k: 'book', w: W('utopia') }, { k: 'spine', s: ser('mwt') }, { k: 'book', w: W('senga') },
			{ k: 'spine', s: ser('fantasia') }, { k: 'book', w: W('rats') }, { k: 'spine', s: ser('safari') },
			{ k: 'book', w: W('icarus') }
		].filter(function (x) { return x.w || x.s; });

		var items = lineup.map(function (x) {
			if (x.k === 'book') {
				var w = x.w, bi = info[w.id] || {};
				return { kind: 'book', href: S.bookHref(w.id), title: w.title, color: w.color, img: S.coverOf(bi),
					meta: t(S.TYPES[w.type] || {}) + (w.year ? ' · ' + App.num(w.year) : '') + (w.publisher ? ' · ' + t(w.publisher) : ''),
					text: t(bi.description || w.synopsis).split(/\n\s*\n/)[0] };
			}
			var s = x.s, si = (d.seriesInfo || {})[s.id] || {};
			return { kind: 'spine', href: S.seriesHref(s.id), title: s.title, color: s.color,
				meta: L('سلسلة', 'Series') + (s.years ? ' · ' + App.num(s.years) : '') + (s.count ? ' · ' + App.num(s.count) + L(' عددًا', ' issues') : ''),
				text: t(si.description || s.synopsis).split(/\n\s*\n/)[0] };
		});

		root.innerHTML =
			'<svg class="sh-grid" aria-hidden="true" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs>' +
				'<pattern id="shDots" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="rgba(239,230,210,.12)" /></pattern>' +
			'</defs><rect width="100%" height="100%" fill="url(#shDots)" /></svg>' +
			'<div class="sh-overlay" aria-hidden="true"><div class="sh-overlay-text"></div></div>' +
			'<div class="sh-books">' + items.map(function (it, i) {
				if (it.kind === 'spine') {
					return '<a class="sh-spine" href="' + e(it.href) + '" data-i="' + i + '" style="--c:' + e(it.color || '#3a1414') + '">' +
						'<span class="sh-spine-title">' + tx(it.title) + '</span><span class="sh-foot"></span></a>';
				}
				return '<div class="sh-item" data-i="' + i + '"><div class="sh-container"><div class="sh-cover">' +
					'<div class="sh-back-cover"></div>' +
					'<div class="sh-inside"><div class="sh-page"></div><div class="sh-page"></div><div class="sh-page"></div></div>' +
					'<div class="sh-image">' + S.miniCover({ img: it.img, color: it.color, title: t(it.title) }) +
						'<div class="sh-effect"></div><div class="sh-light"></div></div>' +
					'<a class="sh-hitbox" href="' + e(it.href) + '" data-i="' + i + '" aria-label="' + e(t(it.title)) + '"></a>' +
				'</div></div><span class="sh-foot"></span></div>';
			}).join('') + '</div>' +
			'<div class="sh-shelf" aria-hidden="true"></div>' +
			'<div class="sh-descriptions" aria-live="polite">' + items.map(function (it, i) {
				return '<div class="sh-desc" data-i="' + i + '">' +
					'<h3>' + tx(it.title) + '</h3>' +
					'<div class="sh-meta">' + e(it.meta) + '</div>' +
					'<p>' + e(it.text) + '</p>' +
					'<a class="sh-more" href="' + e(it.href) + '">' + (it.kind === 'spine' ? L('صفحة السلسلة ←', 'Series page →') : L('تفاصيل الكتاب ←', 'Book details →')) + '</a>' +
				'</div>';
			}).join('') + '</div>';

		var gsap = window.gsap;
		var overlayText = root.querySelector('.sh-overlay-text');
		var descs = [].slice.call(root.querySelectorAll('.sh-desc'));
		var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		/* split descriptions into lines (SplitType), each wrapped for the slide-up.
		   Lines are measured, so this waits for the web fonts; until then the text simply shows. */
		var split = false;
		function splitLines() {
			if (split || !window.SplitType || still) return;
			split = true;
			descs.forEach(function (desc) {
				try {
					['h3', '.sh-meta', 'p'].forEach(function (sel) { new window.SplitType(desc.querySelector(sel), { types: 'lines', lineClass: 'line' }); });
					desc.querySelectorAll('.line').forEach(function (line) { line.innerHTML = '<span class="line-inner">' + line.innerHTML + '</span>'; });
					if (gsap && !desc.classList.contains('active')) gsap.set(desc.querySelectorAll('.line-inner'), { yPercent: 100, opacity: 0 });
				} catch (x) {}
			});
		}

		/* per-book hover timelines */
		var tls = [];
		[].slice.call(root.querySelectorAll('.sh-item, .sh-spine')).forEach(function (el) {
			var i = +el.getAttribute('data-i');
			if (!gsap || still) { tls[i] = null; return; }
			var foot = el.querySelector('.sh-foot');
			var tl = gsap.timeline({ paused: true, defaults: { duration: el.classList.contains('sh-spine') ? 0.5 : 0.7, ease: 'power2.out' } });
			if (el.classList.contains('sh-spine')) {
				tl.to(el, { y: -6, boxShadow: 'var(--sh-shadow) 8px -5px 15px, var(--sh-shadow) 15px 0px 20px' }, 0)
				  .to(foot, { width: 36, opacity: .8 }, 0);
			} else {
				var img = el.querySelector('.sh-image'), pages = el.querySelectorAll('.sh-page');
				tl.to(img, { x: -10, scaleX: 0.96, boxShadow: 'var(--sh-shadow-strong) 20px 5px 20px, var(--sh-shadow) 30px 0px 30px' }, 0)
				  .to(foot, { width: el.offsetWidth < 140 ? 100 : 130, opacity: .8 }, 0)
				  .to(el.querySelector('.sh-effect'), { marginLeft: 10 }, 0)
				  .to(el.querySelector('.sh-light'), { opacity: .2 }, 0)
				  .to(pages[0], { x: 2, ease: 'power1.inOut' }, 0)
				  .to(pages[1], { x: 0, ease: 'power1.inOut' }, 0)
				  .to(pages[2], { x: -2, ease: 'power1.inOut' }, 0);
			}
			tls[i] = tl;
		});

		var active = null, DEFAULT = 0;
		function showDesc(i) {
			descs.forEach(function (desc) {
				var on = +desc.getAttribute('data-i') === i, was = desc.classList.contains('active');
				if (!on && was) {
					desc.classList.remove('active');
					if (gsap && !still) gsap.to(desc.querySelectorAll('.line-inner'), { yPercent: 100, opacity: 0, duration: 0.4, ease: 'power1.in', stagger: 0.03 });
				}
				if (on) {
					desc.classList.add('active');
					if (gsap && !still) gsap.fromTo(desc.querySelectorAll('.line-inner'), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power1.out' });
				}
			});
		}
		function focusBook(i) {
			if (i === active) return;
			if (active != null && tls[active]) tls[active].reverse();
			active = i;
			if (tls[i]) tls[i].play();
			overlayText.textContent = t(items[i].title);
			if (gsap && !still) gsap.fromTo(overlayText, { opacity: 0 }, { opacity: 1, duration: 0.4 });
			showDesc(i);
		}


		var targets = root.querySelectorAll('.sh-hitbox, .sh-spine');
		var touch = window.matchMedia && window.matchMedia('(hover: none)').matches;
		targets.forEach(function (a) {
			var i = +a.getAttribute('data-i');
			a.addEventListener('mouseenter', function () { focusBook(i); });
			a.addEventListener('focus', function () { focusBook(i); });
			a.addEventListener('click', function (ev) {
				/* touch: first tap brings the book forward, the second follows the link */
				if (touch && active !== i) { ev.preventDefault(); focusBook(i); }
			});
		});
		root.querySelector('.sh-books').addEventListener('mouseleave', function () { focusBook(DEFAULT); });

		focusBook(DEFAULT);
		var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
		fontsReady.then(function () { if (root.isConnected) { splitLines(); var a = active; active = null; focusBook(a); } });
	}

	window.ShelfHero = { render: render };
})();
