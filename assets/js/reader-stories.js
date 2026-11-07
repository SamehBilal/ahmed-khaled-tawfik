/* «حكايات القرّاء» (reader-stories.html): how readers met him and his books, in their own words (AKT.readerStories,
   data-readers.js), with how to send one (readers-invite.js, which «تواصل وساهم» shows too). What he wrote by hand for them is
   on its own page again, «بخط يده» (handwriting.html; this page's old #hand, #dedications and #send lead there).
   Its reel puts two pens together: Chris Bolson's «Scroll-Driven Photo Gallery #CSSonly» (codepen.io/cbolson) — white
   polaroids with a handwritten caption that grow out of nothing as they scroll into place, markers and arrows to move
   between them — and Toc's «Stacked Card Scroll Effect» (codepen.io/ol-ivier) — each card, once seen, scaling down and
   flying out along a curve, turning, onto a stack. Here the stacks are two piles of polaroids, one each side. While no
   story is published, the polaroids are his covers asking the questions a story answers, and the last is left blank. */
window.PAGE = {
	id: 'reader-stories',
	title: { ar: 'حكايات القرّاء', en: 'Readers’ stories' },
	strings: {
		eyebrow: { ar: 'بأقلامكم', en: 'In your words' },
		title: { ar: 'حكايات القرّاء', en: 'Readers’ stories' },
		lead: { ar: 'أول عدد اشتريته من بائع الجرائد، الكتاب الذي خبّأته تحت كتب المدرسة، الندوة التي وقّع لك فيها، اليوم الذي عرفت فيه أنه رحل. كل قارئ له حكاية مع العرّاب، وهنا تُحكى بأصحابها.',
			en: 'The first issue you bought from the newsstand, the book hidden under your schoolbooks, the talk where he signed your copy, the day you heard he had gone. Every reader has a story with the Godfather, and here they are told by those who lived them.' }
	},
	/* the band: his covers as polaroids tossed on the table, after Toc's «Scattered Polaroids — CSS
	   random()» (codepen.io/ol-ivier): each a little off true, turned and shadowed its own way, placed where it overlaps the
	   others by no more than about a third and keeps off the sheet; a polaroid under the pointer lifts and straightens. Laid
	   out once the band is on the page, and again on resize */
	band: function (d, A) {
		var S = window.WorksShared, t = A.t, e = A.esc, out = [];
		if (!S) return '';
		[['mwt', 7], ['fantasia', 5], ['safari', 5], ['www', 2]].forEach(function (x) {
			S.seriesIssues(x[0]).slice(0, x[1]).forEach(function (is) { var c = S.issueCover(x[0], is); if (c) out.push({ img: A.thumb(c), cap: t(is.title) }); });
		});
		['utopia', 'senga', 'icarus', 'rats', 'shaabeeb'].forEach(function (id) {
			var w = A.findWork(id), c = w && S.coverOf((d.bookInfo || {})[id] || {});
			if (c) out.push({ img: A.thumb(c), cap: t(w.title) });
		});
		/* shuffled the same way on every visit */
		var seed = 7, rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
		out.sort(function () { return rnd() - 0.5; });
		setTimeout(function () { window.PAGE.scatter(); }, 0);
		return '<div class="rs-scatter">' + out.map(function (c, i) {
			return '<span class="rs-sc" style="--d:' + (i * 0.05).toFixed(2) + 's"><img src="' + e(c.img) + '" alt="" loading="lazy" decoding="async"><i>' + e(c.cap.length > 22 ? c.cap.slice(0, 21) + '…' : c.cap) + '</i></span>';
		}).join('') + '</div>';
	},
	/* the pen's permissive anti-collision: for each polaroid up to 60 tries for a place where it covers no other by more than
	   35%, else the place that covers least — and never more than a corner of the sheet; as many as the band's size holds,
	   the rest left out */
	scatter: function () {
		var box = document.querySelector('.rs-scatter');
		if (!box) return;
		var cards = [].slice.call(box.querySelectorAll('.rs-sc')), W = box.clientWidth, H = box.clientHeight;
		if (!W || !H) return;
		var cw = W < 460 ? 62 : W < 560 ? 86 : 112, ch = cw * 1.36, placed = [], seed = 11;
		var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
		/* the sheet, as a box in the band's own terms */
		var sheet = document.querySelector('.ph .hw-page'), sb = sheet && sheet.getBoundingClientRect(), bb = box.getBoundingClientRect();
		var pad = W < 560 ? 0 : cw * 0.25;
		var no = sb ? { x: sb.left - bb.left - pad, y: sb.top - bb.top, w: sb.width + pad * 2, h: sb.height } : null;
		var free = (W * H - (no ? Math.max(0, Math.min(no.w, W)) * H : 0));
		var fit = Math.min(cards.length, Math.max(4, Math.round(free / (cw * ch) * 1.25)));
		var onSheet = function (p) {
			if (!no) return 0;
			var x = Math.max(0, Math.min(p.x + cw, no.x + no.w) - Math.max(p.x, no.x)), y = Math.max(0, Math.min(p.y + ch, no.y + no.h) - Math.max(p.y, no.y));
			return (x * y) / (cw * ch);
		};
		var over = function (a, b) {
			var x = Math.max(0, Math.min(a.x + cw, b.x + cw) - Math.max(a.x, b.x)), y = Math.max(0, Math.min(a.y + ch, b.y + ch) - Math.max(a.y, b.y));
			return (x * y) / (cw * ch);
		};
		cards.forEach(function (el, i) {
			if (i >= fit) { el.hidden = true; return; }
			el.hidden = false;
			var best = null, bestO = 9;
			for (var k = 0; k < 60; k++) {
				var p = { x: rnd() * (W - cw), y: 8 + rnd() * Math.max(1, H - ch - 16) };
				var o = Math.max(placed.reduce(function (m, q) { return Math.max(m, over(p, q)); }, 0), onSheet(p) * 3);
				if (o < bestO) { best = p; bestO = o; }
				if (o <= 0.35) break;
			}
			/* (no room beside the sheet for this one: left out, not laid over the writing) */
			if (onSheet(best) > 0.12) { el.hidden = true; return; }
			placed.push(best);
			el.style.cssText += ';--x:' + best.x.toFixed(0) + 'px;--y:' + best.y.toFixed(0) + 'px;--r:' + ((rnd() - 0.5) * 26).toFixed(1) + 'deg;--w:' + cw + 'px;--s:' + (0.25 + rnd() * 0.35).toFixed(2);
		});
		box.classList.add('is-laid');
		var ph = box.closest('.ph');
		setTimeout(function () { box.classList.add('is-done'); }, 2200);
		if (!box.dataset.wired) {
			box.dataset.wired = '1';
			var tm;
			window.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(function () { window.PAGE.scatter(); }, 200); });
		}
	},

	/* the reel's polaroids: the stories, or — until there are some — his covers asking the questions, and a blank one */
	cards: function () {
		var A = window.App, d = A.data(), t = A.t, L = A.L, S = window.WorksShared;
		var list = d.readerStories || [];
		var first = function (sid) { var is = S.seriesIssues(sid)[0]; return is ? S.issueCover(sid, is) : ''; };
		var bookCover = function (id) { var w = id && A.findWork(id); return w ? S.coverOf((d.bookInfo || {})[w.id] || {}) : ''; };
		if (list.length) return list.map(function (s, i) {
			return { img: s.photo || bookCover(s.book), cap: t(s.name), sub: t(s.text), href: '#s-' + i };
		});
		return [
			{ img: first('mwt'), cap: L('أول عدد قرأته له؟', 'The first one you read?'), sub: L('«ما وراء الطبيعة» 1', 'Ma Wara’ al-Tabi’a 1') },
			{ img: first('fantasia'), cap: L('من أعطاك إياه؟', 'Who gave it to you?'), sub: L('«فانتازيا» 1', 'Fantasia 1') },
			{ img: first('safari'), cap: L('أين كنت تقرؤه؟', 'Where did you read it?'), sub: L('«سافاري» 1', 'Safari 1') },
			{ img: bookCover('utopia'), cap: L('ماذا ترك فيك؟', 'What did it leave in you?'), sub: L('«يوتوبيا»', 'Utopia') },
			{ img: 'assets/img/photos/akt-portrait-cafe.webp', cap: L('هل التقيته؟', 'Did you ever meet him?'), sub: L('ندوة، أو حفل توقيع، أو رسالة', 'A talk, a signing, a letter') },
			{ img: 'assets/img/grave.webp', cap: L('أين كنت يوم رحل؟', 'Where were you the day he died?'), sub: L('2 أبريل 2018', '2 April 2018') },
			{ img: '', blank: true, cap: L('حكايتك هنا', 'Your story here'), sub: L('اكتبها لنا ←', 'Write it to us →') }
		];
	},
	reel: function (cards) {
		var A = window.App, e = A.esc, L = A.L;
		/* drawn chevrons, not ❮ ❯: right-to-left text mirrors those, and the arrows pointed the wrong way in Arabic */
		var chev = function (dir) { return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="' + (dir === 'left' ? 'M15 5 8 12l7 7' : 'M9 5l7 7-7 7') + '" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'; };
		return '<section class="rs-reel" id="reel" style="--n:' + cards.length + '" aria-label="' + e(L('صور الحكايات', 'The stories’ polaroids')) + '">' +
			'<div class="rs-stage">' +
				'<p class="rs-hint" aria-hidden="true">' + e(L('مرّر لتقلّب الصور', 'Scroll to turn the polaroids')) + ' <i>↓</i></p>' +
				cards.map(function (c, i) {
					return '<a class="rs-pol' + (c.blank ? ' is-blank' : '') + '" href="' + e(c.href || '#write') + '" style="--i:' + i + '">' +
						'<span class="rs-pic">' + (c.img ? '<img src="' + e(c.img) + '" alt="" loading="lazy" decoding="async">' : '<b aria-hidden="true">✎</b>') + '</span>' +
						'<span class="rs-cap">' + e(c.cap) + '</span>' + (c.sub ? '<small>' + e(c.sub) + '</small>' : '') + '</a>';
				}).join('') +
				'<div class="rs-nav">' +
					'<button type="button" class="rs-step" data-d="-1" aria-label="' + e(L('السابقة', 'Previous')) + '">' + chev(A.lang === 'ar' ? 'right' : 'left') + '</button>' +
					'<span class="rs-dots">' + cards.map(function (c, i) { return '<button type="button" data-i="' + i + '" aria-label="' + e(A.num(i + 1) + ' — ' + c.cap) + '"></button>'; }).join('') + '</span>' +
					'<button type="button" class="rs-step" data-d="1" aria-label="' + e(L('التالية', 'Next')) + '">' + chev(A.lang === 'ar' ? 'left' : 'right') + '</button>' +
				'</div>' +
			'</div></section>';
	},
	/* the flight: the reel's scroll, one card a step — t from -1 (far, small) through 0 (in the middle, full size) to 1
	   (landed on its pile); each card on its own side, its own turn, a little higher on the pile than the one before */
	wireReel: function () {
		var reel = document.getElementById('reel');
		if (!reel) return;
		var pols = [].slice.call(reel.querySelectorAll('.rs-pol')), dots = [].slice.call(reel.querySelectorAll('.rs-dots button'));
		var n = pols.length, cur = -1, queued = false;
		var rtl = document.documentElement.dir === 'rtl';
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { reel.classList.add('is-still'); return; }
		var ease = function (k) { return 1 - Math.pow(1 - k, 3); };
		var place = function () {
			queued = false;
			if (!reel.isConnected) return;
			var r = reel.getBoundingClientRect(), vh = window.innerHeight, w = reel.clientWidth;
			var run = Math.max(1, r.height - vh), p = Math.min(Math.max(-r.top / run, 0), 1) * (n - 1);
			var narrow = w < 700, far = Math.min(w * (narrow ? 0.34 : 0.3), 420);
			pols.forEach(function (el, i) {
				var t = p - i, side = (i % 2 ? 1 : -1) * (rtl ? -1 : 1), turn = side * (9 + (i * 7) % 11);
				var x = 0, y = 0, s = 1, rot = 0, o = 1;
				if (t < -1) { s = 0.15; o = 0; y = vh * 0.3; }
				else if (t < 0) {
					var k = ease(t + 1);
					s = 0.15 + 0.85 * k; o = Math.min(1, (t + 1) * 1.6); y = (1 - k) * vh * 0.3; rot = (1 - k) * -turn * 0.6;
				} else {
					var q = Math.min(t, 1), k2 = ease(q);
					s = 1 - (narrow ? 0.62 : 0.55) * k2;
					x = side * far * k2;
					y = -Math.sin(q * Math.PI) * vh * 0.16 + k2 * (vh * 0.12 - Math.floor(i / 2) * 6);
					rot = turn * k2;
				}
				el.style.transform = 'translate(-50%, -50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + rot.toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
				el.style.opacity = o.toFixed(3);
				el.style.zIndex = t < 0 ? 200 - i : 100 + i;
				el.tabIndex = Math.abs(t) < 0.5 ? 0 : -1;
			});
			var c = Math.round(p);
			if (c !== cur) { cur = c; dots.forEach(function (b, i) { b.setAttribute('aria-current', i === c ? 'true' : 'false'); }); }
			reel.classList.toggle('is-moved', p > 0.15);
		};
		var ask = function () { if (!queued) { queued = true; requestAnimationFrame(place); } };
		window.addEventListener('scroll', ask, { passive: true });
		window.addEventListener('resize', ask);
		/* a marker or an arrow scrolls to its card */
		var go = function (i) {
			i = Math.max(0, Math.min(n - 1, i));
			var r = reel.getBoundingClientRect(), run = r.height - window.innerHeight;
			window.scrollTo({ top: window.scrollY + r.top + run * (n > 1 ? i / (n - 1) : 0) + 1, behavior: 'smooth' });
		};
		reel.addEventListener('click', function (ev) {
			var b = ev.target.closest('.rs-dots button, .rs-step');
			if (!b) return;
			go(b.dataset.i != null ? +b.dataset.i : cur + (+b.dataset.d));
		});
		place();
	},

	render: function () {
		var A = window.App, d = A.data(), e = A.esc, t = A.t, L = A.L, S = window.WorksShared;
		var list = d.readerStories || [];
		var book = function (id) {
			if (!id) return '';
			var w = A.findWork && A.findWork(id);
			return w ? '<a href="' + e(S ? S.bookHref(w.id) : 'works.html') + '">' + e(t(w.title)) + '</a>' : e(id);
		};
		var stories = list.length
			? '<ul class="rs-grid">' + list.map(function (s, i) {
				return '<li class="rs-card rise" id="s-' + i + '">' + (s.photo ? '<img class="rs-photo" src="' + e(s.photo) + '" alt="" loading="lazy">' : '') +
					'<blockquote>' + e(t(s.text)) + '</blockquote>' +
					'<p class="rs-who"><b>' + e(t(s.name)) + '</b>' + (s.city ? ' · ' + e(t(s.city)) : '') +
						(s.first ? '<small>' + e(L('قرأه أول مرة عام ', 'First read him in ')) + e(A.num(s.first)) + (s.book ? ' — ' + book(s.book) : '') + '</small>' : '') + '</p></li>';
			}).join('') + '</ul>'
			: '<div class="rs-empty"><span class="rs-empty-ic" aria-hidden="true">✎</span><h2>' + e(L('الصفحة تنتظر حكايتك', 'This page is waiting for your story')) + '</h2>' +
				'<p>' + e(L('لم تُنشر حكايات بعد. أول من يكتب يفتتحها: سطرٌ واحد يكفي، أو صفحة كاملة.', 'No stories have been published yet. The first to write opens the page: one line is enough, or a whole page.')) + '</p></div>';
		/* an old link to the handwriting that was here (#hand, #dedications, #send) goes to its own page */
		if (/^#(hand|dedications|send)$/.test(location.hash)) { location.replace('handwriting.html' + (location.hash === '#hand' ? '' : location.hash)); return; }
		/* the page's parts, a chip each, and its sister page */
		var jump = '<nav class="section rs-jump" aria-label="' + e(L('في هذه الصفحة', 'On this page')) + '"><div class="wrap chips">' +
			[['#reel', L('حكايات القرّاء', 'Readers’ stories')], ['#write', L('احكِ حكايتك', 'Tell your story')], ['handwriting.html', L('بخط يده ←', 'In his hand →')]].map(function (x) {
				return '<a class="chip" href="' + x[0] + '">' + e(x[1]) + '</a>';
			}).join('') + '</div></nav>';
		document.getElementById('content').innerHTML = jump +
			this.reel(this.cards()) +
			'<section class="section"><div class="wrap">' + stories + '</div></section>' +
			'<section class="section" id="write"><div class="wrap">' + window.ReaderStories.invite(false) + '</div></section>';
		this.wireReel();
		A.focusHash();
	},

};
