/* series.html?id=<series id> — one page per series: his own, or one by others he contributed to */
window.PAGE = {
	id: 'works',
	title: { ar: 'سلسلة', en: 'Series' },

	render: function () {
		var App = window.App, d = App.data(), S = window.WorksShared;
		var e = App.esc, t = App.t, tx = App.tx, L = App.L;
		var id = new URLSearchParams(location.search).get('id') || '';
		var ser = S.anySeries(id);
		var root = document.getElementById('content');

		if (!ser) {
			root.innerHTML = '<section class="page-hero"><div class="wrap"><p class="eyebrow">404</p><h1>' + L('لم نجد هذه السلسلة', 'Series not found') + '</h1>' +
				'<p class="lead"><a href="works.html">' + L('عودة إلى كل الأعمال', 'Back to all works') + '</a></p></div></section>';
			return;
		}

		var s = ser.s, info = ser.info || {}, other = ser.other;
		this.title = s.title;
		App.applyLang();

		var issues = S.seriesIssues(id);
		var desc = info.description || s.description || s.synopsis;
		var hero = s.hero ? App.byId(d.characters, s.hero) : null;
		var chars = (d.characters || []).filter(function (c) { return c.work === id; });
		var adapts = (d.adaptations || []).filter(function (a) { return a.basedOn === id; });

		/* 3D book: own series reuse the works-page book; others get a simple one */
		var bookOpts = ser.own ? S.seriesBook(s) : {
			/* the cover of its first book (the first issue that has one), else the series' own */
			img: S.seriesCover(s.id),
			color: s.color || '#4b3b2a', title: s.title, motif: S.monogram(s.title),
			back: tx(s.description || ''), meta: s.years || '',
			pages: ['<h4>' + tx(s.title) + '</h4>' + App.paras(s.description)],
			info: { title: '', text: '' },
			by: ser.inspired ? t(S.seriesAuthor(ser)) : ''
		};
		/* its back: its own back cover (a collected volume's), else the back cover of its first book that has one */
		if (info.back) bookOpts.backImg = info.back;
		if (!ser.own && !bookOpts.backImg) issues.some(function (is) { var bk = S.backOf(is.work || S.issueKey(id, is)); if (bk) bookOpts.backImg = bk; return !!bk; });
		bookOpts.id = '';
		bookOpts.info = { title: '', text: '' };

		var facts = [
			[L('السنوات', 'Years'), App.num(s.years || '')],
			[L('عدد الأعداد', 'Issues'), App.num(s.count || (issues.length || ''))],
			[L('الناشر', 'Publisher'), s.publisher ? t(s.publisher) : '', s.publisher ? S.publisherLink(s.publisher) : ''],
			[L('صاحب السلسلة', 'Created by'), ser.own ? L('أحمد خالد توفيق', 'Ahmed Khaled Tawfik') : (s.owner ? t(s.owner) : '')],
			[ser.inspired ? L('صلتها به', 'Link to him') : L('دوره', 'His role'), !ser.own && s.role ? t(s.role) : (other && other.role ? t(other.role) : '')],
			[L('البطل', 'Lead'), hero ? t(hero.name) : ''],
			[L('الشكل', 'Format'), info.format ? t(info.format) : '']
		].filter(function (x) { return x[1]; });

		/* each issue's number stands beside its cover, as on the guide (.step-n) */
		/* the widest number sets the column all the numbers stand in, so every cover is the same width */
		var digits = Math.max.apply(null, [1].concat(issues.map(function (is) { return is.n != null ? String(is.n).length : 1; })));
		var issueGrid = issues.map(function (is) {
			var n = is.n != null ? App.num(is.n) + (is.part ? '/' + App.num(is.part) : '') : '';
			return '<a class="cover-link" href="' + App.issueHref(id, is) + '" title="' + e(t(is.title)) + '">' +
				'<span class="cl-cover">' + S.miniCover({ img: S.issueCover(id, is), color: s.color, title: t(is.title), sub: is.original ? t(is.original) : '', by: t(S.seriesAuthor(ser)) }) +
					(n ? '<b class="cl-n"' + (is.part ? ' data-part' : '') + '>' + e(n) + '</b>' : '') + '</span>' +
				'<span class="cl-t">' + tx(is.title) + '</span>' +
				((d.audio && (d.audio.issues[id + '-' + is.n] || (d.audio.youtube && d.audio.youtube.issues[id + '-' + is.n])) && !(is.part > 1)) ? '<span class="cl-audio" title="' + L('متاح مسموعًا على Audiohat', 'Audiobook on Audiohat') + '">' + L('مسموع ♪', 'Audio ♪') + '</span>' : '') +
			'</a>';
		}).join('');

		var eds = (info.editions || []).map(function (ed) {
			return '<li><b>' + tx(ed.publisher) + '</b>' + (ed.years ? ' · ' + App.num(ed.years) : '') + (ed.kind ? ' — ' + tx(ed.kind) : '') +
				(ed.note ? '<br><span class="meta">' + tx(ed.note) + '</span>' : '') +
				(ed.source ? ' <a href="' + e(ed.source) + '" target="_blank" rel="noopener">↗</a>' : '') + '</li>';
		}).join('');

		var links = (info.links || []).map(function (l) { return '<a href="' + e(l.url) + '" target="_blank" rel="noopener">' + e(l.label) + ' ↗</a>'; }).join('');
		var sources = (info.sources || []).concat(s.source ? [s.source] : []);

		/* other series list for navigation */
		var all = S.ownSeries().map(function (x) { return { id: x.id, title: x.title, color: x.color, own: true }; })
			.concat(S.contributedSeries().map(function (x) { return { id: x.id, title: x.title, color: x.color, own: false }; }));
		/* from this world in other series: a series that counts as this one's specials (specialsOf, e.g. the comics) joins
		   its special issues; the rest, with the series that grew out of it (grewFrom, e.g. Lasheen), is "what came of it" */
		var related = [], extraSpecials = [];
		S.contributedSeries().forEach(function (x) {
			S.seriesIssues(x.id).forEach(function (is) {
				if (is.related === id) (x.specialsOf === id ? extraSpecials : related).push({ s: x, is: is });
			});
		});
		var grown = (d.otherSeries || []).filter(function (x) { return x.inspired && x.grewFrom === id; });
		var specials = S.specialIssues(id);

		root.innerHTML =
			'<section class="detail"><div class="wrap">' +
				'<nav class="crumbs"><a href="works.html">' + L('الأعمال', 'Works') + '</a> / <span>' + tx(s.title) + '</span></nav>' +
				'<div class="detail-grid">' +
					'<aside class="d-cover"><ul class="bk-list bk-solo" id="d-book">' + window.Books.showcase(bookOpts) + '</ul>' +
						(links ? '<div class="d-links">' + links + '</div>' : '') + '</aside>' +
					'<div class="d-main">' +
						'<p class="eyebrow">' + (ser.own ? L('سلسلة من تأليفه', 'His series') : ser.inspired ? L('عالم خرج من أدبه', 'A world grown from his work') : L('سلسلة شارك فيها', 'A series he contributed to')) + '</p>' +
						'<h1>' + tx(s.title) + '</h1>' +
						'<p class="d-alt">' + e(App.alt(s.title)) + '</p>' +
						(s.tagline ? '<p class="d-by">' + tx(s.tagline) + '</p>' : '') +
						(desc ? '<div class="d-desc">' + App.paras(desc) + '</div>' : '') +
						(info.genres && info.genres.length ? '<div class="d-genres">' + info.genres.map(function (g) { return '<span>' + tx(g) + '</span>'; }).join('') + '</div>' : '') +
						'<dl class="d-facts">' + facts.map(function (x) { return '<dt>' + e(x[0]) + '</dt><dd>' + (x[2] || e(x[1])) + '</dd>'; }).join('') + '</dl>' +
						(info.altTitles && info.altTitles.length ? '<section class="d-block"><h3>' + L('عناوين أخرى', 'Other titles') + '</h3><ul class="alt-titles">' +
							info.altTitles.map(function (a) { return '<li><b>' + e(a.title) + '</b>' + (a.note ? ' — ' + tx(a.note) : '') + '</li>'; }).join('') + '</ul></section>' : '') +
						(info.readingOrder ? '<section class="d-block"><h3>' + L('ترتيب القراءة', 'Reading order') + '</h3>' + App.paras(info.readingOrder) + '</section>' : '') +
						(d.audio && issues.some(function (is) { return d.audio.issues[id + '-' + is.n] || (d.audio.youtube && d.audio.youtube.issues[id + '-' + is.n]); }) ? '<p class="note"><a href="audio.html">♪ ' + L('عدد من أعدادها متاح مسموعًا — استمع على المسجّل', 'Many issues are on audio — listen on the cassette deck') + ' ←</a></p>' : '') +
						(info.blocks || []).map(function (b) {
							return '<section class="d-block d-extra"><h3>' + tx(b.title) + (b.items && b.items.length > 1 ? ' <small>(' + App.num(b.items.length) + ')</small>' : '') + '</h3>' +
								(b.text ? App.paras(b.text) : '') +
								(b.items ? '<ul class="ex-list">' + b.items.map(function (it) {
									var head = it.href ? '<a href="' + e(it.href) + '">' + tx(it.title) + '</a>' : it.url ? '<a href="' + e(it.url) + '" target="_blank" rel="noopener">' + tx(it.title) + ' ↗</a>' : '<b>' + tx(it.title) + '</b>';
									return '<li>' + head + (it.meta ? ' <span class="meta">' + tx(it.meta) + '</span>' : '') + (it.text ? '<br><span class="ex-t">' + tx(it.text) + '</span>' : '') + '</li>';
								}).join('') + '</ul>' : '') + '</section>';
						}).join('') +
						(chars.length ? '<section class="d-block"><h3>' + L('الشخصيات', 'Characters') + '</h3><p class="chips-line">' + chars.map(function (c) { return App.charLink(c.id); }).join('') + '</p></section>' : '') +
						(eds ? '<section class="d-block"><h3>' + L('الطبعات', 'Editions') + '</h3><ul class="ed-list">' + eds + '</ul></section>' : '') +
						/* collected volumes, box sets and the series logo, from the stores and Wikimedia */
						(((d.seriesCovers || {})[id] || []).length ? '<section class="d-block"><h3>' + L('المجلدات والأغلفة', 'Volumes and covers') + ' <small>(' + App.num(d.seriesCovers[id].length) + ')</small></h3><div class="sv-covers">' +
							d.seriesCovers[id].map(function (c) {
								return '<a class="sv-cover" href="' + e(c.source || c.cover) + '" target="_blank" rel="noopener" title="' + e(t(c.label)) + '"><img src="' + e(c.cover) + '" alt="' + e(t(c.label)) + '" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"><span>' + e(t(c.label)) + '</span></a>';
							}).join('') + '</div></section>' : '') +
						(adapts.length ? '<section class="d-block"><h3>' + L('على الشاشة', 'On screen') + '</h3>' + adapts.map(function (a) {
							return '<p><b>' + tx(a.title) + '</b> (' + App.num(a.year || '') + ') — ' + tx(a.text) + '</p>'; }).join('') + '</section>' : '') +
					'</div>' +
				'</div>' +
				(ser.own && hero && issues.length ? this.proximityHtml(s, hero, issues) : '') +
				(issues.length ? '<section class="d-block d-wide"><div class="d-head"><h3>' + (ser.own ? L('كل الأعداد', 'Every issue') : ser.inspired ? L('كتب السلسلة', 'The books') : L('ما كتبه أو ترجمه فيها', 'What he wrote or translated in it')) +
					' <small>(' + App.num(issues.length) + ')</small></h3></div><div class="cover-grid is-ranked" data-digits="' + digits + '" style="--c:' + e(s.color || '#c0392b') + ';--d:' + digits + '">' + issueGrid + '</div></section>' : '') +
				((specials.length + extraSpecials.length) ? '<section class="d-block d-wide"><div class="d-head"><h3>' + L('الأعداد الخاصة', 'Special issues') + ' <small>(' + App.num(specials.length + extraSpecials.length) + ')</small></h3></div><div class="cover-grid">' +
					specials.map(function (is) {
						var au = d.audio && d.audio.youtube && d.audio.youtube.issues[id + '-s' + is.n];
						return '<a class="cover-link" href="' + App.issueHref(id, is) + '" title="' + e(t(is.title)) + '">' +
							S.miniCover({ img: S.issueCover(id, is), color: '#1f1b2e', title: t(is.title), num: L('خاص ', 'S') + App.num(is.n) }) +
							'<span class="cl-t">' + L('عدد خاص ', 'Special ') + App.num(is.n) + '. ' + tx(is.title) + '</span>' +
							(au ? '<span class="cl-audio">' + L('مسموع ♪', 'Audio ♪') + '</span>' : '') +
						'</a>';
					}).join('') +
					/* the comics: special issues too, told in pictures */
					extraSpecials.map(function (r) {
						return '<a class="cover-link" href="' + App.issueHref(r.s.id, r.is) + '" title="' + e(t(r.is.title)) + '">' +
							S.miniCover({ img: S.issueCover(r.s.id, r.is), color: r.s.color, title: t(r.is.title), num: L('كوميكس', 'Comic'), sub: t(r.s.title) }) +
							'<span class="cl-t">' + tx(r.is.title) + ' · ' + tx(r.s.title) + '</span></a>';
					}).join('') + '</div></section>' : '') +
				/* what came of this world: its stories in other series, and the series that grew out of it */
				((related.length + grown.length) ? '<section class="d-block d-wide"><div class="d-head"><h3>' + L('ما خرج من عالمها', 'What grew from this world') + ' <small>(' + App.num(related.length + grown.length) + ')</small></h3></div><div class="cover-grid">' +
					related.map(function (r) {
						return '<a class="cover-link" href="' + App.issueHref(r.s.id, r.is) + '" title="' + e(t(r.is.title)) + '">' +
							S.miniCover({ img: S.issueCover(r.s.id, r.is), color: r.s.color, title: t(r.is.title), sub: t(r.s.title) }) +
							'<span class="cl-t">' + tx(r.is.title) + ' · ' + tx(r.s.title) + '</span></a>';
					}).join('') +
					grown.map(function (x) {
						return '<a class="cover-link" href="' + S.seriesHref(x.id) + '" title="' + e(t(x.title)) + '">' +
							S.miniCover({ img: S.seriesCover(x.id), color: x.color, title: t(x.title), sub: x.author ? t(x.author) : '' }) +
							'<span class="cl-t">' + L('سلسلة ', 'The series ') + tx(x.title) + (x.author ? ' · ' + tx(x.author) : '') +
								(x.count ? ' · ' + App.num(x.count) + ' ' + L('كتابًا', 'books') : '') + '</span></a>';
					}).join('') + '</div></section>' : '') +
				'<section class="d-block d-wide"><div class="d-head"><h3>' + L('سلاسل أخرى', 'Other series') + '</h3></div><div class="cover-row">' +
					all.filter(function (x) { return x.id !== id; }).map(function (x) {
						return '<a class="cover-link" href="' + S.seriesHref(x.id) + '">' + S.miniCover({ img: S.seriesCover(x.id), color: x.color, title: t(x.title), sub: x.own ? '' : L('مشاركة', 'Contributor') }) + '</a>';
					}).join('') + '</div></section>' +
				(sources.length ? '<section class="d-block d-sources d-wide"><h3>' + L('المصادر', 'Sources') + '</h3><ul>' +
					sources.map(function (u) { return '<li><a href="' + e(u) + '" target="_blank" rel="noopener">' + e(u.replace(/^https?:\/\/(www\.)?/, '').slice(0, 70)) + '</a></li>'; }).join('') + '</ul></section>' : '') +
				App.fixLink(t(s.title)) +
			'</div></section>';

		window.Books.initShowcase(document.getElementById('d-book'));
		this.initProximity(document.getElementById('prox'));
	},

	/* ---------- Thumbnail proximity effect (Codrops demo 3) ----------
	   The series' hero is the backdrop; every issue cover hides on top of it and
	   scales / fades in as the cursor gets near. The closest cover shows its title. */
	proximityHtml: function (s, hero, issues) {
		var App = window.App, S = window.WorksShared, e = App.esc, tx = App.tx, L = App.L;
		var img = hero.image || '';
		return '<section class="d-block d-wide"><div class="d-head"><h3>' + L('مكتبة ', 'The library of ') + tx(hero.name) + '</h3>' +
				'<span class="prox-hint">' + L('حرّك المؤشر فوق الصورة لتظهر الأعداد', 'Move your cursor over the picture to reveal the issues') + '</span></div>' +
			'<div class="prox' + (img ? ' has-img' : '') + '" id="prox" style="--c:' + e(s.color || '#3a1414') + (img ? ';background-image:url(\'' + e(img) + '\')' : '') + '">' +
				(img ? '' : '<div class="prox-art" aria-hidden="true"><span class="pa-name">' + tx(hero.name) + '</span><span class="pa-role">' + tx(hero.role) + '</span></div>') +
				'<ul class="prox-grid">' + issues.map(function (is) {
					return '<li><a href="' + App.issueHref(s.id, is) + '" data-n="' + e(App.num(is.n)) + (is.part ? '/' + e(App.num(is.part)) : '') + '" data-t="' + e(App.t(is.title)) + '">' +
						S.miniCover({ img: S.issueCover(s.id, is), color: s.color, title: App.t(is.title), num: is.n != null ? App.num(is.n) : '' }) + '</a></li>';
				}).join('') + '</ul>' +
				'<div class="prox-label" aria-hidden="true"></div>' +
				(hero.imageCredit ? '<span class="prox-credit">' + tx(hero.imageCredit) + '</span>' : '') +
			'</div></section>';
	},

	initProximity: function (box) {
		if (!box) return;
		var links = [].slice.call(box.querySelectorAll('.prox-grid a'));
		var label = box.querySelector('.prox-label');
		var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
		var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!fine || still) { box.classList.add('prox-static'); return; }

		var MAX = 170, MIN_S = 0, MAX_S = 1.35, MIN_O = 0, MAX_O = 1;
		var centres = [], px = null, py = null, raf = 0, active = null;

		function measure() {
			centres = links.map(function (a) {
				var r = a.parentNode.getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			});
		}
		function frame() {
			raf = 0;
			var best = null, bestP = 0;
			for (var i = 0; i < links.length; i++) {
				var d = px == null ? Infinity : Math.hypot(centres[i].x - px, centres[i].y - py);
				var p = d < MAX ? 1 - d / MAX : 0;
				var a = links[i];
				a.style.setProperty('--s', (MIN_S + p * (MAX_S - MIN_S)).toFixed(3));
				a.style.setProperty('--o', (MIN_O + p * (MAX_O - MIN_O)).toFixed(3));
				a.parentNode.style.zIndex = p > 0 ? String(10 + Math.round(p * 100)) : '';
				if (p > bestP) { bestP = p; best = a; }
			}
			if (best && bestP > 0.82) {
				if (active !== best) {
					active = best;
					label.innerHTML = '<b>' + best.getAttribute('data-n') + '</b> ' + window.App.esc(best.getAttribute('data-t'));
				}
				var br = best.parentNode.getBoundingClientRect(), bx = box.getBoundingClientRect();
				label.style.transform = 'translate(' + Math.round(br.left - bx.left + br.width / 2) + 'px,' + Math.round(br.top - bx.top - 14) + 'px) translate(-50%, -100%)';
				label.classList.add('on');
			} else {
				active = null;
				label.classList.remove('on');
			}
		}
		function queue() { if (!raf) raf = requestAnimationFrame(frame); }

		box.addEventListener('pointerenter', function () { measure(); });
		box.addEventListener('pointermove', function (ev) { px = ev.clientX; py = ev.clientY; queue(); });
		box.addEventListener('pointerleave', function () { px = py = null; queue(); });
		window.addEventListener('scroll', function () { if (px != null) { measure(); queue(); } }, { passive: true });
		window.addEventListener('resize', function () { measure(); queue(); });
		measure(); frame();
	}
};
