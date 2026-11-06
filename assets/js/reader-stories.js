/* «حكايات القرّاء وبخط يده» (reader-stories.html): his readers and him, both ways — how readers met him and his books, in their own
   words (AKT.readerStories, data-readers.js), with how to send one (readers-invite.js, which «تواصل وساهم» shows too); and what he
   wrote by hand for them (AKT.handwriting, data-pages.js), his books' printed dedications (AKT.dedications) and a form for a
   dedication of one's own (#hand, #dedications, #send — once handwriting.html, which now leads here).
   Its reel puts two pens together: Chris Bolson's «Scroll-Driven Photo Gallery #CSSonly» (codepen.io/cbolson) — white
   polaroids with a handwritten caption that grow out of nothing as they scroll into place, markers and arrows to move
   between them — and Toc's «Stacked Card Scroll Effect» (codepen.io/ol-ivier) — each card, once seen, scaling down and
   flying out along a curve, turning, onto a stack. Here the stacks are two piles of polaroids, one each side. While no
   story is published, the polaroids are his covers asking the questions a story answers, and the last is left blank. */
window.PAGE = {
	id: 'reader-stories',
	title: { ar: 'حكايات القرّاء وبخط يده', en: 'Readers’ stories, and his hand' },
	strings: {
		eyebrow: { ar: 'بأقلامكم وبخط يده', en: 'In your words, and in his hand' },
		title: { ar: 'حكايات القرّاء وبخط يده', en: 'Readers’ stories, and his hand' },
		lead: { ar: 'أول عدد اشتريته من بائع الجرائد، الكتاب الذي خبّأته تحت كتب المدرسة، الندوة التي وقّع لك فيها، اليوم الذي عرفت فيه أنه رحل — وما كتبه هو بيده لقرّائه: إهداءات على نسخهم وتوقيعات وقصاصات. كل قارئ له حكاية مع العرّاب، وهنا تُحكى بأصحابها.',
			en: 'The first issue you bought from the newsstand, the book hidden under your schoolbooks, the talk where he signed your copy, the day you heard he had gone — and what he wrote by hand for his readers: dedications in their copies, signatures, notes. Every reader has a story with the Godfather, and here they are told by those who lived them.' }
	},
	/* the band, the two pages' bands in one: in the middle, «بخط يده»'s ruled sheet, a pen writing a dedication on it and signing
	   it; around it, «حكايات القرّاء»'s polaroids of his covers tossed on the table, after Toc's «Scattered Polaroids — CSS
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
		}).join('') + '</div>' +
			'<a class="hw-page" href="#hand" aria-label="' + e(A.L('بخط يده', 'In his hand')) + '"><p class="hw-line"><span>' + e(A.L('إلى القارئ العزيز.. ابق حيًا حتى اللقاء القادم', 'To the dear reader.. stay alive till we meet again')) + '</span></p>' +
			'<p class="hw-sign"><span>' + e(A.L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik')) + '</span></p></a>';
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
		if (ph) ph.removeAttribute('aria-hidden'); /* (its sheet is a link, to «بخط يده» below) */
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
		/* the page's two halves, a chip each and for what can be sent */
		var jump = '<nav class="section rs-jump" aria-label="' + e(L('في هذه الصفحة', 'On this page')) + '"><div class="wrap chips">' +
			[['#reel', L('حكايات القرّاء', 'Readers’ stories')], ['#write', L('احكِ حكايتك', 'Tell your story')], ['#hand', L('بخط يده', 'In his hand')],
				['#dedications', L('إهداءات كتبه', 'His books’ dedications')], ['#send', L('أرسل إهداءك', 'Send your dedication')]].map(function (x) {
				return '<a class="chip" href="' + x[0] + '">' + e(x[1]) + '</a>';
			}).join('') + '</div></nav>';
		document.getElementById('content').innerHTML = jump +
			this.reel(this.cards()) +
			'<section class="section"><div class="wrap">' + stories + '</div></section>' +
			'<section class="section" id="write"><div class="wrap">' + window.ReaderStories.invite(false) + '</div></section>' +
			this.hand();
		this.wireReel();
		this.wire();
		A.focusHash();
	},

	/* the kinds of thing in his hand */
	KIND: { dedication: { ar: 'إهداء', en: 'Dedication' }, signature: { ar: 'توقيع', en: 'Signature' }, note: { ar: 'قصاصة', en: 'Note' }, letter: { ar: 'رسالة', en: 'Letter' }, manuscript: { ar: 'مخطوط', en: 'Manuscript' } },

	/* «بخط يده» (#hand): what he wrote by hand for his readers, as they and reporters told of it, linked where it was published;
	   then his books' printed dedications, and the call and form for a dedication of one's own */
	hand: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this, list = App.data().handwriting || [];
		return '<section class="section hw" id="hand"><div class="wrap"><h2 class="hw-h">' + e(L('بخط يده', 'In his hand')) + '</h2>' +
			'<p class="hw-lead">' + e(L('ما كتبه بيده لقرّائه: إهداءات على نسخهم وتوقيعات في حفلات التوقيع وقصاصات جيبه، كما رواها أصحابها.', 'What he wrote by hand for his readers: dedications in their copies, signatures at signings, the notes in his pocket, as their owners told of them.')) + '</p>' +
			'<div class="hw-list">' + list.map(function (x) {
				return '<article class="hw-card"><p class="hw-kind">' + e(t(self.KIND[x.kind] || { ar: x.kind, en: x.kind })) + (x.year ? ' · ' + e(App.num(x.year)) : '') + '</p>' +
					'<h3>' + e(t(x.title)) + '</h3><p>' + e(t(x.text)) + '</p>' +
					'<a class="hw-src" href="' + e(x.url) + '" target="_blank" rel="noopener">' + e(t(x.outlet || { ar: 'المصدر', en: 'Source' })) + ' ↗</a></article>';
			}).join('') + '</div>' +
			this.dedications() +
			'<aside class="hw-call"><h2>' + e(L('هل عندك إهداء منه؟', 'Do you have a dedication from him?')) + '</h2>' +
				'<p>' + e(L('قلّما نُشر خطه: لم نجد بعد مخطوطًا أو رسالة بخطه في مكان عام. إن كتب لك إهداءً على نسختك، أو عندك ورقة بخطه، فصوّرها وأرسلها، واكتب سطرًا عن اليوم؛ تُنشر هنا باسمك إن أردت.', 'His hand was seldom published: we have yet to find a manuscript or a letter of his shown anywhere public. If he wrote a dedication in your copy, or you have a page in his hand, photograph it and send it with a line about the day; it goes up here, under your name if you wish.')) + '</p>' +
				this.form() +
			'</aside>' +
		'</div></section>';
	},

	/* «إهداءات كتبه» (#dedications): the printed dedication at the front of his books and issues — to whom, its words where a
	   source gives them, and what it tells (AKT.dedications, data-pages.js) */
	dedications: function () {
		var App = window.App, S = window.WorksShared, e = App.esc, t = App.t, L = App.L, list = App.data().dedications || [];
		if (!list.length || !S) return '';
		return '<section class="hw-ded" id="dedications"><h2>' + e(L('إهداءات كتبه', 'His books’ dedications')) + ' <small>' + e(App.num(list.length)) + '</small></h2>' +
			'<p class="hw-ded-lead">' + e(L('وفي أول صفحة من بعض كتبه إهداء مطبوع: لمن أهدى الكتاب، وبماذا، كما نقلته المصادر. أكثر كتبه وأعداده بلا إهداء.', 'And on the first page of some of his books, a printed dedication: to whom he gave the book, and in what words, as the sources quote it. Most of his books and issues have none.')) + '</p>' +
			'<div class="hw-ded-list">' + list.map(function (x) {
				var r = S.resolveBook(x.book);
				if (!r) return '';
				var title = r.series ? t(r.series.s.title) + ' ' + App.num(r.item.n) + ': ' + t(r.item.title) : t(r.item.title);
				var img = r.series ? S.issueCover(r.series.s.id, r.item) : S.coverOf(r.info), href = r.series ? 'book.html?id=' + x.book : App.workHref(x.book);
				return '<article class="hw-ded-card"><a class="hw-ded-cv" href="' + e(href) + '">' + S.miniCover({ img: img, color: '#3a2a1f', title: t(r.item.title) }) + '</a><div>' +
					'<h3><a href="' + e(href) + '">' + e(title) + '</a></h3><p class="hw-ded-to">' + e(L('إلى ', 'To ')) + e(t(x.to)) + '</p>' +
					(x.text ? '<blockquote dir="rtl" lang="ar">' + e(x.text) + '</blockquote>' : '') +
					(x.note ? '<p class="hw-ded-note">' + e(t(x.note)) + '</p>' : '') +
					(x.src || []).map(function (u, i) { return '<a class="hw-src" href="' + e(u) + '" target="_blank" rel="noopener">' + e(L('المصدر', 'Source') + ((x.src || []).length > 1 ? ' ' + App.num(i + 1) : '') + ' ↗') + '</a>'; }).join(' ') +
				'</div></article>';
			}).join('') + '</div></section>';
	},

	/* the form, after Muhammed Erdem's «Credit Card Form» on CodePen (made there with Vue; here in plain script): above the boxes, a
	   card that fills in as you write — not a bank card but the dedication itself, a book's first page over its cover: the book's
	   name where the card's number would be, «إلى» and your name where its holder's, when and where for its date, and what you
	   have (a dedication, a signature…) where its make. A frame glides to the part of the card the box you are in fills; the
	   words slide in as they are written; and for the story of the day the card turns over to its back, where the story is
	   written above his signature */
	form: function () {
		var App = window.App, e = App.esc, t = App.t, L = App.L, self = this;
		var nib = '<svg class="dc-nib" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 31 17 24 37h-8L9 17Z"/><path class="cut" d="M20 14v12"/><circle class="cut" cx="20" cy="13" r="2.4"/></svg>';
		return '<div class="hw-form-wrap">' +
			'<div class="dc" aria-hidden="true"><div class="dc-card">' +
				'<div class="dc-side dc-front"><div class="dc-cover"></div><div class="dc-focus"></div>' +
					'<div class="dc-top">' + nib + '<span class="dc-kind" data-for="kind"><b>' + e(t(self.KIND.dedication)) + '</b></span></div>' +
					'<p class="dc-book" data-for="book"><span class="dc-ph">' + e(L('اسم الكتاب أو العدد', 'The book or issue')) + '</span></p>' +
					'<div class="dc-foot"><p class="dc-to" data-for="name"><small>' + e(L('إلى', 'To')) + '</small><span class="dc-val"><span class="dc-ph">' + e(L('اسمك', 'Your name')) + '</span></span></p>' +
						'<p class="dc-when" data-for="when"><small>' + e(L('متى وأين', 'When & where')) + '</small><span class="dc-val"><span class="dc-ph">—</span></span></p></div></div>' +
				'<div class="dc-side dc-back"><div class="dc-cover"></div><div class="dc-band"></div>' +
					'<div class="dc-story"><small>' + e(L('حكاية اليوم', 'The story of that day')) + '</small><p class="dc-story-t"><span class="dc-ph">…</span></p></div>' +
					'<p class="dc-sign">' + e(L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik')) + '</p></div>' +
			'</div></div>' +
			'<form class="hw-form" id="send">' +
				'<label class="hw-wide">' + e(L('الكتاب أو العدد', 'The book or issue')) + '<input name="book" autocomplete="off" placeholder="' + e(L('مثال: يوتوبيا، أو ما وراء الطبيعة ٣٣', 'e.g. Utopia, or Paranormal 33')) + '"></label>' +
				'<label>' + e(L('اسمك كما تحب أن يظهر', 'Your name as you’d like it shown')) + '<input name="name" autocomplete="off" placeholder="' + e(L('اتركه فارغًا إن لم ترد ذكره', 'Leave it empty to stay unnamed')) + '"></label>' +
				'<label>' + e(L('ما الذي عندك؟', 'What do you have?')) + '<select name="kind">' + ['dedication', 'signature', 'note', 'letter'].map(function (k) { return '<option value="' + k + '">' + e(t(self.KIND[k])) + '</option>'; }).join('') + '</select></label>' +
				'<label class="hw-wide">' + e(L('متى وأين؟', 'When and where?')) + '<input name="when" autocomplete="off" placeholder="' + e(L('مثال: معرض القاهرة للكتاب، يناير 2014', 'e.g. Cairo Book Fair, January 2014')) + '"></label>' +
				'<label class="hw-wide">' + e(L('حكاية اليوم', 'The story of that day')) + '<textarea name="story" rows="4"></textarea></label>' +
				'<label class="hw-wide hw-check"><input type="checkbox" name="credit" checked> ' + e(L('اذكروا اسمي مع الصورة', 'Show my name with it')) + '</label>' +
				'<p class="hw-wide hw-how">' + e(L('اختر طريقة الإرسال، ثم أرفق صور الإهداء هناك: على GitHub اسحب الصور إلى خانة «الصور»، وفي البريد أرفقها بالرسالة.', 'Pick how to send it, then attach the photos there: on GitHub drag them into the «Photos» box; by email, attach them to the message.')) + '</p>' +
				'<p class="hw-wide hw-acts"><button type="submit" class="buy-btn" value="github">' + e(L('أرسل عبر GitHub ↗', 'Send on GitHub ↗')) + '</button>' +
				'<button type="submit" class="share-btn" value="mail">' + e(L('أرسل بالبريد', 'Send by email')) + '</button></p>' +
			'</form></div>';
	},

	/* the card at work, and the sending */
	wire: function () {
		var App = window.App, d = App.data(), S = window.WorksShared, t = App.t, L = App.L, e = App.esc, self = this;
		var form = document.getElementById('send'), card = document.querySelector('.dc'), focus = card.querySelector('.dc-focus');
		/* the card's picture: the cover of the book named, if it is one of his best known, or else one of them in turn */
		var COVERS = [['ما وراء|رفعت|paranormal', S && S.seriesCover('mwt')], ['فانتازيا|fantasia', S && S.seriesCover('fantasia')], ['سافاري|safari', S && S.seriesCover('safari')],
			['يوتوبيا|utopia', S && S.coverOf((d.bookInfo || {}).utopia)]].filter(function (c) { return c[1]; });
		var setCover = function (src) { [].forEach.call(card.querySelectorAll('.dc-cover'), function (c) { c.style.backgroundImage = 'url("' + new URL(src, document.baseURI).href + '")'; }); };
		var base = COVERS.length ? COVERS[Math.floor(Math.random() * COVERS.length)][1] : '';
		if (base) setCover(base);
		/* a value onto the card: its words, the new ones sliding in (words, not letters: Arabic letters held apart would lose their joins) */
		var shown = {};
		var put = function (key, el, ph) {
			var v = (form.elements[key].value || '').replace(/\s+/g, ' ').trim(), old = shown[key] || '';
			if (v === old) return;
			var ow = old ? old.split(' ') : [], nw = v ? v.split(' ') : [], same = 0;
			while (same < ow.length && same < nw.length && ow[same] === nw[same]) same++;
			el.innerHTML = v ? nw.map(function (w, i) { return '<span class="dc-w' + (i >= same ? ' is-new' : '') + '">' + e(w) + '</span>'; }).join(' ') : '<span class="dc-ph is-new">' + e(ph) + '</span>';
			shown[key] = v;
		};
		var PH = { book: L('اسم الكتاب أو العدد', 'The book or issue'), name: L('اسمك', 'Your name'), when: '—', story: '…' };
		var target = { book: card.querySelector('.dc-book'), name: card.querySelector('.dc-to .dc-val'), when: card.querySelector('.dc-when .dc-val'), story: card.querySelector('.dc-story-t') };
		var update = function (key) {
			if (key === 'kind') {
				var k = card.querySelector('.dc-kind');
				k.innerHTML = '<b class="is-new">' + e(t(self.KIND[form.elements.kind.value])) + '</b>';
				return;
			}
			if (!target[key]) return;
			put(key, target[key], PH[key]);
			if (key === 'book') {
				var v = form.elements.book.value.toLowerCase(), hit = COVERS.filter(function (c) { return new RegExp(c[0]).test(v); })[0];
				setCover(hit ? hit[1] : base);
			}
		};
		/* the frame over the part of the card the box fills; on the story, the card turns over */
		var place = function (key) {
			var el = key && card.querySelector('.dc-front [data-for="' + key + '"]');
			card.classList.toggle('is-back', key === 'story');
			if (!el) { focus.classList.remove('is-on'); return; }
			var front = card.querySelector('.dc-front').getBoundingClientRect(), r = el.getBoundingClientRect();
			focus.style.width = r.width + 'px'; focus.style.height = r.height + 'px';
			focus.style.transform = 'translate(' + (r.left - front.left) + 'px,' + (r.top - front.top) + 'px)';
			focus.classList.add('is-on');
		};
		[].forEach.call(form.elements, function (el) {
			if (!el.name || el.type === 'checkbox' || el.type === 'submit') return;
			el.addEventListener('input', function () { update(el.name); place(el.name); });
			el.addEventListener('change', function () { update(el.name); });
			el.addEventListener('focus', function () { place(el.name); });
			el.addEventListener('blur', function () { setTimeout(function () { if (!form.contains(document.activeElement) || !document.activeElement.name) place(null); }, 0); });
		});
		form.addEventListener('submit', function (ev) {
			ev.preventDefault();
			var f = form.elements, v = function (n) { return f[n].value.trim(); }, kind = t(self.KIND[v('kind')]), how = ev.submitter ? ev.submitter.value : 'github';
			var title = L('بخط يده: ', 'In his hand: ') + kind + (v('book') ? ' — ' + v('book') : '');
			if (how === 'mail') {
				var body = [L('الاسم: ', 'Name: ') + (v('name') || '—'), L('النوع: ', 'Kind: ') + kind, L('الكتاب أو العدد: ', 'Book or issue: ') + (v('book') || '—'), L('متى وأين: ', 'When and where: ') + (v('when') || '—'),
					L('الحكاية: ', 'The story: ') + (v('story') || '—'), L('ذكر الاسم: ', 'Name shown: ') + (f.credit.checked ? L('نعم', 'yes') : L('لا', 'no')), '', L('(أرفق الصور بهذه الرسالة)', '(attach the photos to this message)')].join('\n');
				location.href = 'mailto:' + self.EMAIL + '?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
				return;
			}
			/* GitHub's issue form (.github/ISSUE_TEMPLATE/handwriting.yml), its boxes filled from this one; the photos are dropped in there */
			var q = { template: 'handwriting.yml', title: title, name: v('name'), book: v('book'), when: v('when'), story: v('story') };
			window.open(self.REPO + '/issues/new?' + Object.keys(q).filter(function (k) { return q[k]; }).map(function (k) { return k + '=' + encodeURIComponent(q[k]); }).join('&'), '_blank', 'noopener');
		});
	},
	REPO: 'https://github.com/SamehBilal/ahmed-khaled-tawfik',
	EMAIL: 'sameh.bilal@outlook.com'
};
