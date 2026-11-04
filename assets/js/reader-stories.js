/* «حكايات القرّاء» (reader-stories.html): how readers met him and his books, in their own words (AKT.readerStories,
   data-readers.js) — and under them how to send one (readers-invite.js, which «تواصل وساهم» shows too).
   Its reel puts two pens together: Chris Bolson's «Scroll-Driven Photo Gallery #CSSonly» (codepen.io/cbolson) — white
   polaroids with a handwritten caption that grow out of nothing as they scroll into place, markers and arrows to move
   between them — and Toc's «Stacked Card Scroll Effect» (codepen.io/ol-ivier) — each card, once seen, scaling down and
   flying out along a curve, turning, onto a stack. Here the stacks are two piles of polaroids, one each side. While no
   story is published, the polaroids are his covers asking the questions a story answers, and the last is left blank. */
window.PAGE = {
	id: 'reader-stories',
	title: { ar: 'حكايات القرّاء', en: 'Readers’ stories' },
	strings: {
		eyebrow: { ar: 'بأقلامكم', en: 'In your own words' },
		title: { ar: 'حكايات القرّاء', en: 'Readers’ stories' },
		lead: { ar: 'أول عدد اشتريته من بائع الجرائد، الكتاب الذي خبّأته تحت كتب المدرسة، الندوة التي وقّع لك فيها، اليوم الذي عرفت فيه أنه رحل. كل قارئ له حكاية مع العرّاب، وهنا تُحكى بأصحابها.',
			en: 'The first issue you bought from the newsstand, the book hidden under your schoolbooks, the talk where he signed your copy, the day you heard he had gone. Every reader has a story with the Godfather, and here they are told by those who lived them.' }
	},
	/* the band: notes on lined paper drifting on the dark, each a reader's few lines still to be written */
	band: function () {
		var spots = [[6, 30, -8], [21, 120, 5], [37, 18, -3], [52, 140, 7], [66, 40, -6], [81, 112, 4], [93, 26, 9]];
		return '<div class="rs-band">' + spots.map(function (p, i) {
			return '<span class="rs-note" style="inset-inline-start:calc(' + p[0] + '% - 75px);top:' + p[1] + 'px;--r:' + p[2] + 'deg;--d:-' + (i * 1.3).toFixed(1) + 's">' +
				[86, 64, 92, 48].map(function (w) { return '<i style="--w:' + ((w + i * 7) % 60 + 40) + '%"></i>'; }).join('') + '</span>';
		}).join('') + '</div>';
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
		return '<section class="rs-reel" id="reel" style="--n:' + cards.length + '" aria-label="' + e(L('صور الحكايات', 'The stories’ polaroids')) + '">' +
			'<div class="rs-stage">' +
				'<p class="rs-hint" aria-hidden="true">' + e(L('مرّر لتقلّب الصور', 'Scroll to turn the polaroids')) + ' <i>↓</i></p>' +
				cards.map(function (c, i) {
					return '<a class="rs-pol' + (c.blank ? ' is-blank' : '') + '" href="' + e(c.href || '#write') + '" style="--i:' + i + '">' +
						'<span class="rs-pic">' + (c.img ? '<img src="' + e(c.img) + '" alt="" loading="lazy" decoding="async">' : '<b aria-hidden="true">✎</b>') + '</span>' +
						'<span class="rs-cap">' + e(c.cap) + '</span>' + (c.sub ? '<small>' + e(c.sub) + '</small>' : '') + '</a>';
				}).join('') +
				'<div class="rs-nav">' +
					'<button type="button" class="rs-step" data-d="-1" aria-label="' + e(L('السابقة', 'Previous')) + '">' + (A.lang === 'ar' ? '❯' : '❮') + '</button>' +
					'<span class="rs-dots">' + cards.map(function (c, i) { return '<button type="button" data-i="' + i + '" aria-label="' + e(A.num(i + 1) + ' — ' + c.cap) + '"></button>'; }).join('') + '</span>' +
					'<button type="button" class="rs-step" data-d="1" aria-label="' + e(L('التالية', 'Next')) + '">' + (A.lang === 'ar' ? '❮' : '❯') + '</button>' +
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
		document.getElementById('content').innerHTML =
			this.reel(this.cards()) +
			'<section class="section"><div class="wrap">' + stories + '</div></section>' +
			'<section class="section" id="write"><div class="wrap">' + window.ReaderStories.invite(false) + '</div></section>';
		this.wireReel();
	}
};
