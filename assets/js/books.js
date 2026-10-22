/* 3D book builders + behaviour.
   Showcase: vanilla port of Codrops "3D Book Showcase" (books1.js).
   Hardcover: markup for Codrops "Animated Books", plus tap/keyboard support. */
(function () {
	'use strict';

	var A = function () { return window.App; };

	/* ---------- Showcase ---------- */

	/* opts: { color, num, motif, title{ar,en}, back (html), meta, pages: [html,...], info: { title, sub, text, facts:[[label,value]] }, href }
	   With href, the closed book is a link to that page (its title in the card too). */
	function showcase(o) {
		var App = A(), e = App.esc;
		var pages = (o.pages || []).map(function (p, i) {
			return '<div class="bk-content' + (i === 0 ? ' bk-content-current' : '') + '" dir="' + document.documentElement.dir + '">' + p + '</div>';
		}).join('');
		var facts = (o.info.facts || []).filter(function (f) { return f[1]; }).map(function (f) {
			return '<span>' + e(f[0]) + ' <b>' + e(f[1]) + '</b></span>';
		}).join('');

		return '' +
		'<li class="rise' + (o.href ? ' bk-linked' : '') + '"' + (o.id ? ' id="' + e(o.id) + '"' : '') + (o.key ? ' data-ls-key="' + e(o.key) + '"' : '') + (o.href ? ' data-href="' + e(o.href) + '"' : '') + '>' +
			/* mirrored, so the spine is on the right and the cover opens to the right, as Arabic books do */
			'<div class="bk-mirror"' + (o.href ? ' role="link" tabindex="0" aria-label="' + e(o.info.title) + '"' : '') + '><div class="bk-book bk-bookdefault" style="--bk-c:' + e(o.color || '#333') + '">' +
				'<div class="bk-front">' +
					'<div class="bk-cover-back"></div>' +
					'<div class="bk-cover' + (o.img ? ' has-img' : '') + '">' +
						(o.img ? '<img class="bk-img" src="' + e(o.img) + '" alt="" loading="lazy" onerror="this.parentNode.classList.remove(\'has-img\');this.remove()">' : '') +
						(o.num ? '<span class="bk-num">' + e(o.num) + '</span>' : '') +
						(o.motif ? '<span class="bk-motif">' + e(o.motif) + '</span>' : '') +
						'<h2><span class="t-ar">' + e(o.title.ar || '') + '</span><span class="t-en">' + e(o.title.en || '') + '</span><span class="by">' + e(o.by || 'د. أحمد خالد توفيق') + '</span></h2>' +
					'</div>' +
				'</div>' +
				'<div class="bk-page">' + pages + '</div>' +
				/* the back: a photo of the real back cover when there is one, else the blurb */
				'<div class="bk-back' + (o.backImg ? ' has-img' : '') + '">' + (o.backImg ? '<img class="bk-back-img" src="' + e(o.backImg) + '" alt="" loading="lazy">' : '<p>' + (o.back || '') + '</p>' + (o.meta ? '<div class="bk-meta">' + e(o.meta) + '</div>' : '')) + '</div>' +
				'<div class="bk-right"></div>' +
				'<div class="bk-left"><h2><span class="t-ar">' + e(o.title.ar || '') + '</span><span class="t-en">' + e(o.title.en || '') + '</span></h2></div>' +
				'<div class="bk-top"></div>' +
				'<div class="bk-bottom"></div>' +
			'</div></div>' +
			'<div class="bk-info">' +
				'<div class="bk-actions">' +
					'<button type="button" class="bk-bookback">' + (App.lang === 'ar' ? 'اقلب الكتاب' : 'Flip') + '</button>' +
					'<button type="button" class="bk-bookview">' + (App.lang === 'ar' ? 'تصفّح من الداخل' : 'View inside') + '</button>' +
				'</div>' +
				'<h3>' + (o.href ? '<a href="' + e(o.href) + '">' + e(o.info.title) + '</a>' : e(o.info.title)) + (o.info.sub ? '<small>' + e(o.info.sub) + '</small>' : '') + '</h3>' +
				'<p>' + e(o.info.text || '') + '</p>' +
				(o.info.extra || '') +
				(facts ? '<div class="facts">' + facts + '</div>' : '') +
			'</div>' +
		'</li>';
	}

	/* a book page shows its scrollbar only while it scrolls (once, for every showcase on the page) */
	var scrollWired = false;
	function wireScroll() {
		if (scrollWired) return;
		scrollWired = true;
		document.addEventListener('scroll', function (ev) {
			var p = ev.target;
			if (!p.classList || !p.classList.contains('bk-content')) return;
			p.classList.add('is-scrolling');
			clearTimeout(p._scrollT);
			p._scrollT = setTimeout(function () { p.classList.remove('is-scrolling'); }, 900);
		}, true);
	}

	function initShowcase(list) {
		wireScroll();
		var items = Array.prototype.slice.call(list.children);
		var books = items.map(function (li) { return li.querySelector('.bk-book'); });

		items.forEach(function (li, idx) {
			var book = books[idx];
			var page = book.querySelector('.bk-page');
			var contents = page.querySelectorAll('.bk-content');
			var viewBtn = li.querySelector('.bk-bookview');
			var backBtn = li.querySelector('.bk-bookback');
			var state = { opened: false, flip: false, current: 0 };
			book._state = state;

			function show(i) {
				state.current = i;
				contents.forEach(function (c, k) { c.classList.toggle('bk-content-current', k === i); });
				if (counter) counter.textContent = A().num(i + 1) + ' / ' + A().num(contents.length);
			}

			backBtn.addEventListener('click', function () {
				viewBtn.classList.remove('bk-active');
				if (state.flip) {
					state.opened = false; state.flip = false;
					book.classList.remove('bk-viewback'); book.classList.add('bk-bookdefault');
				} else {
					state.opened = false; state.flip = true;
					book.classList.remove('bk-viewinside', 'bk-bookdefault'); book.classList.add('bk-viewback');
				}
			});

			viewBtn.addEventListener('click', function () {
				books.forEach(function (other, k) {
					if (other === book) return;
					other._state.opened = false;
					other.classList.remove('bk-viewinside');
					items[k].style.zIndex = 0;
					items[k].querySelector('.bk-bookview').classList.remove('bk-active');
					if (!other.classList.contains('bk-viewback')) other.classList.add('bk-bookdefault');
				});
				if (state.opened) {
					viewBtn.classList.remove('bk-active');
					state.opened = false; state.flip = false;
					book.classList.remove('bk-viewinside'); book.classList.add('bk-bookdefault');
				} else {
					viewBtn.classList.add('bk-active');
					state.opened = true; state.flip = false;
					book.classList.remove('bk-viewback', 'bk-bookdefault'); book.classList.add('bk-viewinside');
					li.style.zIndex = books.length;
					show(0);
				}
			});

			/* a linked book: clicking it while it stands closed (or Enter on it) opens its page; open or flipped, clicks stay with the book */
			var href = li.getAttribute('data-href');
			if (href) {
				var mirror = li.querySelector('.bk-mirror');
				mirror.addEventListener('click', function () { if (!state.opened && !state.flip) location.href = href; });
				mirror.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' && ev.target === mirror) location.href = href; });
			}

			var counter = null;
			if (contents.length > 1) {
				var nav = document.createElement('nav');
				nav.dir = 'rtl'; /* the books open the Arabic way in both languages, so the next page is always to the left */
				/* drawn chevrons, not ‹ › characters: those get mirrored by right-to-left text and by the mirrored book */
				var chev = function (right) { return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="' + (right ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7') + '" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'; };
				/* next on the left, previous on the right, both arrows pointing in toward the page count */
				nav.innerHTML = '<button type="button" aria-label="' + A().L('السابق', 'Previous') + '">' + chev(false) + '</button><span class="bk-count"></span><button type="button" aria-label="' + A().L('التالي', 'Next') + '">' + chev(true) + '</button>';
				var btns = nav.querySelectorAll('button');
				counter = nav.querySelector('.bk-count');
				btns[0].addEventListener('click', function (ev) { ev.stopPropagation(); if (state.current > 0) show(state.current - 1); });
				btns[1].addEventListener('click', function (ev) { ev.stopPropagation(); if (state.current < contents.length - 1) show(state.current + 1); });
				page.appendChild(nav);
				show(0);
			}
		});
	}

	/* ---------- Hardcover ---------- */

	/* opts: { color, title{ar,en}, ribbon, year, typeLabel, img } -> returns the <figure class="hc"> markup */
	function hardcover(o) {
		var e = A().esc;
		return '' +
		'<figure class="hc" tabindex="0"' + (o.key ? ' data-ls-key="' + e(o.key) + '"' : '') + ' style="--hc-c:' + e(o.color || '#444') + '" aria-label="' + e((o.title.ar || '') + ' — ' + (o.title.en || '')) + '">' +
			'<ul class="hc-front">' +
				'<li><div class="hc-cover' + (o.img ? ' has-img' : '') + '">' +
					(o.img ? '<img class="hc-img" src="' + e(o.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.remove(\'has-img\');this.remove()">' : '') +
					(o.ribbon ? '<span class="hc-ribbon">' + e(o.ribbon) + '</span>' : '') +
					'<span class="c-ar">' + e(o.title.ar || '') + '</span>' +
					'<span class="c-en">' + e(o.title.en || '') + '</span>' +
					'<span class="c-by">أحمد خالد توفيق</span>' +
				'</div></li>' +
				'<li></li>' +
			'</ul>' +
			'<ul class="hc-pages">' +
				'<li></li>' +
				'<li><span class="pg-year">' + e(A().num(o.year || '')) + '</span><span class="pg-type">' + e(o.typeLabel || '') + '</span></li>' +
				'<li></li><li></li><li></li>' +
			'</ul>' +
			'<ul class="hc-back"><li></li><li></li></ul>' +
			'<ul class="hc-spine"><li></li><li></li></ul>' +
		'</figure>';
	}

	/* tap / keyboard to open, since :hover is unreliable on touch */
	function initHardcovers(root) {
		root.addEventListener('click', function (ev) {
			var hc = ev.target.closest('.hc');
			if (!hc) return;
			var was = hc.classList.contains('is-open');
			root.querySelectorAll('.hc.is-open').forEach(function (x) { x.classList.remove('is-open'); });
			if (!was) hc.classList.add('is-open');
		});
		root.addEventListener('keydown', function (ev) {
			if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList.contains('hc')) {
				ev.preventDefault();
				ev.target.classList.toggle('is-open');
			}
		});
	}

	window.Books = { showcase: showcase, initShowcase: initShowcase, hardcover: hardcover, initHardcovers: initHardcovers };
})();
